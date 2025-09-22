import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, LogOut, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import GenderSelection from "./GenderSelection";
import MeasurementInput from "./MeasurementInput";

// Translation map from Spanish to Portuguese activity levels
const activityLevelTranslations: { [key: string]: string } = {
  'sedentario': 'sedentario',
  'ligero': 'leve',
  'moderado': 'moderado',
  'intenso': 'intenso'
};

// Function to translate Spanish activity levels to Portuguese
function translateActivityLevelToPortuguese(activityLevel: string): string {
  const lowerActivityLevel = activityLevel.toLowerCase();
  return activityLevelTranslations[lowerActivityLevel] || lowerActivityLevel;
}

interface FormData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  neck: string;
  waist: string;
  hip: string;
  activityLevel: string;
}

interface FormErrors {
  age?: string;
  height?: string;
  weight?: string;
  neck?: string;
  waist?: string;
  hip?: string;
  activityLevel?: string;
}

export default function BodyFatCalculator() {
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  // Mutations for saving data to server
  const saveBodyMetricsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/body-metrics", data);
      return response.json();
    },
  });

  const saveCalculationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calculation", data);
      return response.json();
    },
  });
  const [formData, setFormData] = useState<FormData>({
    gender: "male",
    age: "",
    height: "",
    weight: "",
    neck: "",
    waist: "",
    hip: "",
    activityLevel: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const age = parseFloat(formData.age);
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const neck = parseFloat(formData.neck);
    const waist = parseFloat(formData.waist);
    const hip = formData.gender === "female" ? parseFloat(formData.hip) : 0;

    if (!formData.age || age <= 0 || age > 120) {
      newErrors.age = "La edad es obligatoria y debe estar entre 1 y 120 años";
    }
    if (!formData.height || height <= 0) {
      newErrors.height = "La altura es obligatoria y debe ser mayor que 0";
    }
    if (!formData.weight || weight <= 0) {
      newErrors.weight = "El peso es obligatorio y debe ser mayor que 0";
    }
    if (!formData.neck || neck <= 0) {
      newErrors.neck = "La medida del cuello es obligatoria y debe ser mayor que 0";
    }
    if (!formData.waist || waist <= 0) {
      newErrors.waist = "La medida de la cintura es obligatoria y debe ser mayor que 0";
    }
    if (formData.gender === "female" && (!formData.hip || hip <= 0)) {
      newErrors.hip = "La medida de la cadera es obligatoria para mujeres y debe ser mayor que 0";
    }
    if (!formData.activityLevel) {
      newErrors.activityLevel = "El nivel de actividad física es obligatorio";
    } else if (!['sedentario', 'ligero', 'moderado', 'intenso'].includes(formData.activityLevel)) {
      newErrors.activityLevel = "Nivel de actividad física inválido";
    }

    // Critical validation for US Navy formula
    if (formData.gender === "male") {
      if (waist <= neck) {
        newErrors.waist = "Para hombres, la cintura debe ser mayor que el cuello";
        newErrors.neck = "Para hombres, el cuello debe ser menor que la cintura";
      }
    } else if (formData.gender === "female") {
      if (waist + hip <= neck) {
        newErrors.waist = "Para mujeres, cintura + cadera debe ser mayor que el cuello";
        newErrors.hip = "Para mujeres, cintura + cadera debe ser mayor que el cuello";
        newErrors.neck = "Para mujeres, el cuello debe ser menor que cintura + cadera";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBodyFat = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en los campos resaltados.",
        variant: "destructive",
      });
      return;
    }

    const age = parseFloat(formData.age);
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const neck = parseFloat(formData.neck);
    const waist = parseFloat(formData.waist);
    const hip = formData.gender === "female" ? parseFloat(formData.hip) : null;

    let bodyFatPercentage: number;

    if (formData.gender === "male") {
      // US Navy formula for males: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      // US Navy formula for females: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      // Hip measurement is required for females
      if (!hip || hip <= 0) {
        toast({
          title: "Error en el cálculo",
          description: "La medida de la cadera es obligatoria para el cálculo femenino.",
          variant: "destructive",
        });
        return;
      }
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    // Determine category and color
    let category: string;
    let categoryColor: 'success' | 'warning' | 'destructive';

    if (formData.gender === "male") {
      if (bodyFatPercentage < 6) {
        category = "Esencial";
        categoryColor = "warning";
      } else if (bodyFatPercentage < 14) {
        category = "Atlético";
        categoryColor = "success";
      } else if (bodyFatPercentage < 18) {
        category = "Fitness";
        categoryColor = "success";
      } else if (bodyFatPercentage < 25) {
        category = "Aceptable";
        categoryColor = "warning";
      } else {
        category = "Obesidad";
        categoryColor = "destructive";
      }
    } else {
      if (bodyFatPercentage < 10) {
        category = "Esencial";
        categoryColor = "warning";
      } else if (bodyFatPercentage < 21) {
        category = "Atlético";
        categoryColor = "success";
      } else if (bodyFatPercentage < 25) {
        category = "Fitness";
        categoryColor = "success";
      } else if (bodyFatPercentage < 32) {
        category = "Aceptable";
        categoryColor = "warning";
      } else {
        category = "Obesidad";
        categoryColor = "destructive";
      }
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr: number;
    if (formData.gender === "male") {
      // Male: BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      // Female: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Apply activity level factor to get TDEE (Total Daily Energy Expenditure)
    const activityFactors = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      intenso: 1.725
    };

    const activityFactor = activityFactors[formData.activityLevel as keyof typeof activityFactors];
    if (!activityFactor) {
      toast({
        title: "Error en el cálculo",
        description: "Nivel de actividad física inválido.",
        variant: "destructive",
      });
      return;
    }

    const tmb = Math.round(bmr * activityFactor);

    // Validate calculation results
    if (!isFinite(bodyFatPercentage) || isNaN(bodyFatPercentage) || !isFinite(tmb) || isNaN(tmb)) {
      toast({
        title: "Error en el cálculo",
        description: "No fue posible calcular el resultado con los valores proporcionados. Verifique los datos ingresados.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Translate activity level from Spanish to Portuguese
      const translatedActivityLevel = translateActivityLevelToPortuguese(formData.activityLevel);
      console.log("🌐 Activity level translation:", formData.activityLevel, "->", translatedActivityLevel);

      // Save body metrics to server
      const bodyMetricsData = {
        gender: formData.gender === "male" ? "masculino" : "feminino",
        age,
        height,
        weight,
        neck,
        waist,
        hip: formData.gender === "female" ? hip : null, // Only send hip for females
        activityLevel: translatedActivityLevel
      };

      await saveBodyMetricsMutation.mutateAsync(bodyMetricsData);

      // Save calculation results to server
      const calculationData = {
        bodyFatPercent: Math.max(0, Math.min(50, bodyFatPercentage)), // Clamp between 0-50%
        category,
        bmr,
        tdee: tmb
      };

      await saveCalculationMutation.mutateAsync(calculationData);

      // Invalidate and refetch queries to ensure data is available
      await queryClient.invalidateQueries({ queryKey: ['/api/me/summary'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/calculation'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/body-metrics'] });

      // Wait for calculation data to be available before navigating
      await queryClient.refetchQueries({ queryKey: ['/api/calculation'] });

      toast({
        title: "¡Cálculo realizado!",
        description: "Datos guardados con éxito. Redirigiendo...",
      });

      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error al guardar",
        description: "No fue posible guardar los datos. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      gender: "male",
      age: "",
      height: "",
      weight: "",
      neck: "",
      waist: "",
      hip: "",
      activityLevel: "",
    });
    setErrors({});
    // Clear any cached data
    queryClient.invalidateQueries({ queryKey: ['/api/me/summary'] });
    queryClient.invalidateQueries({ queryKey: ['/api/calculation'] });
    queryClient.invalidateQueries({ queryKey: ['/api/body-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
    toast({
      title: "Formulario limpiado",
      description: "Todos los campos han sido restablecidos.",
    });
  };

  const updateFormData = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              SRC - Sistema de Reequilibrio Corporal
            </h1>
            <p className="text-muted-foreground">
              Método oficial de la Marina de EE.UU.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm text-muted-foreground mb-2">
              Hola, {user?.username}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToDashboard}
                data-testid="button-dashboard"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Panel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {logoutMutation.isPending ? "Saliendo..." : "Salir"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-primary" />
              <span>Datos Corporales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <GenderSelection
              value={formData.gender}
              onChange={updateFormData('gender')}
            />

            <div className="space-y-4">
              <MeasurementInput
                id="age"
                label="Edad"
                value={formData.age}
                onChange={updateFormData('age')}
                placeholder="Ej: 30"
                unit="años"
                error={errors.age}
              />

              <MeasurementInput
                id="height"
                label="Altura"
                value={formData.height}
                onChange={updateFormData('height')}
                placeholder="Ej: 175"
                unit="cm"
                error={errors.height}
              />

              <MeasurementInput
                id="weight"
                label="Peso"
                value={formData.weight}
                onChange={updateFormData('weight')}
                placeholder="Ej: 70"
                unit="kg"
                error={errors.weight}
              />

              <MeasurementInput
                id="neck"
                label="Cuello"
                value={formData.neck}
                onChange={updateFormData('neck')}
                placeholder="Ej: 38"
                unit="cm"
                error={errors.neck}
              />

              <MeasurementInput
                id="waist"
                label="Cintura"
                value={formData.waist}
                onChange={updateFormData('waist')}
                placeholder="Ej: 85"
                unit="cm"
                error={errors.waist}
              />

              {formData.gender === "female" && (
                <MeasurementInput
                  id="hip"
                  label="Cadera"
                  value={formData.hip}
                  onChange={updateFormData('hip')}
                  placeholder="Ej: 95"
                  unit="cm"
                  error={errors.hip}
                />
              )}
            </div>

            {/* Activity Level Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">
                ¿Cuál es su nivel de actividad física?
              </h3>
              <div className="space-y-2">
                {[
                  { value: "sedentario", label: "Sedentario", description: "poco o ningún ejercicio" },
                  { value: "ligero", label: "Ligero", description: "ejercicio ligero 1-3 días/semana" },
                  { value: "moderado", label: "Moderado", description: "ejercicio moderado 3-5 días/semana" },
                  { value: "intenso", label: "Intenso", description: "ejercicio intenso 6-7 días/semana" }
                ].map((level) => (
                  <label
                    key={level.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.activityLevel === level.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-muted/50"
                    }`}
                    data-testid={`radio-activity-${level.value}`}
                  >
                    <input
                      type="radio"
                      name="activityLevel"
                      value={level.value}
                      checked={formData.activityLevel === level.value}
                      onChange={(e) => updateFormData('activityLevel')(e.target.value)}
                      className="mt-1 w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground">{level.label}</div>
                      <div className="text-xs text-muted-foreground">({level.description})</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.activityLevel && (
                <p className="text-sm text-destructive mt-1" data-testid="error-activityLevel">
                  {errors.activityLevel}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={calculateBodyFat}
                className="flex-1"
                disabled={saveBodyMetricsMutation.isPending || saveCalculationMutation.isPending}
                data-testid="button-calculate"
              >
                <Calculator className="w-4 h-4 mr-2" />
                {(saveBodyMetricsMutation.isPending || saveCalculationMutation.isPending) ? "Guardando..." : "Calcular"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                size="icon"
                data-testid="button-reset"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}