import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GenderSelection from "./GenderSelection";
import MeasurementInput from "./MeasurementInput";
import ResultDisplay from "./ResultDisplay";

interface FormData {
  gender: string;
  height: string;
  weight: string;
  neck: string;
  waist: string;
  hip: string;
}

interface FormErrors {
  height?: string;
  weight?: string;
  neck?: string;
  waist?: string;
  hip?: string;
}

export default function BodyFatCalculator() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    gender: "male",
    height: "",
    weight: "",
    neck: "",
    waist: "",
    hip: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<{
    bodyFatPercentage: number;
    category: string;
    categoryColor: 'success' | 'warning' | 'destructive';
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = "Altura é obrigatória e deve ser maior que 0";
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = "Peso é obrigatório e deve ser maior que 0";
    }
    if (!formData.neck || parseFloat(formData.neck) <= 0) {
      newErrors.neck = "Medida do pescoço é obrigatória e deve ser maior que 0";
    }
    if (!formData.waist || parseFloat(formData.waist) <= 0) {
      newErrors.waist = "Medida da cintura é obrigatória e deve ser maior que 0";
    }
    if (formData.gender === "female" && (!formData.hip || parseFloat(formData.hip) <= 0)) {
      newErrors.hip = "Medida do quadril é obrigatória para mulheres e deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBodyFat = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros nos campos destacados.",
        variant: "destructive",
      });
      return;
    }

    const height = parseFloat(formData.height);
    const neck = parseFloat(formData.neck);
    const waist = parseFloat(formData.waist);
    const hip = formData.gender === "female" ? parseFloat(formData.hip) : 0;

    let bodyFatPercentage: number;

    if (formData.gender === "male") {
      // US Navy formula for males: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      // US Navy formula for females: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    // Determine category and color
    let category: string;
    let categoryColor: 'success' | 'warning' | 'destructive';

    if (formData.gender === "male") {
      if (bodyFatPercentage < 6) {
        category = "Essencial";
        categoryColor = "warning";
      } else if (bodyFatPercentage < 14) {
        category = "Atlético";
        categoryColor = "success";
      } else if (bodyFatPercentage < 18) {
        category = "Fitness";
        categoryColor = "success";
      } else if (bodyFatPercentage < 25) {
        category = "Aceitável";
        categoryColor = "warning";
      } else {
        category = "Obesidade";
        categoryColor = "destructive";
      }
    } else {
      if (bodyFatPercentage < 10) {
        category = "Essencial";
        categoryColor = "warning";
      } else if (bodyFatPercentage < 21) {
        category = "Atlético";
        categoryColor = "success";
      } else if (bodyFatPercentage < 25) {
        category = "Fitness";
        categoryColor = "success";
      } else if (bodyFatPercentage < 32) {
        category = "Aceitável";
        categoryColor = "warning";
      } else {
        category = "Obesidade";
        categoryColor = "destructive";
      }
    }

    setResult({
      bodyFatPercentage: Math.max(0, Math.min(50, bodyFatPercentage)), // Clamp between 0-50%
      category,
      categoryColor,
    });

    toast({
      title: "Cálculo realizado!",
      description: "Seu percentual de gordura corporal foi calculado com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      gender: "male",
      height: "",
      weight: "",
      neck: "",
      waist: "",
      hip: "",
    });
    setErrors({});
    setResult(null);
    toast({
      title: "Formulário limpo",
      description: "Todos os campos foram resetados.",
    });
  };

  const updateFormData = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Calculadora de Gordura Corporal
          </h1>
          <p className="text-muted-foreground">
            Método oficial da Marinha dos EUA
          </p>
        </div>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-primary" />
              <span>Dados Corporais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <GenderSelection
              value={formData.gender}
              onChange={updateFormData('gender')}
            />

            <div className="space-y-4">
              <MeasurementInput
                id="height"
                label="Altura"
                value={formData.height}
                onChange={updateFormData('height')}
                placeholder="Ex: 175"
                unit="cm"
                error={errors.height}
              />

              <MeasurementInput
                id="weight"
                label="Peso"
                value={formData.weight}
                onChange={updateFormData('weight')}
                placeholder="Ex: 70"
                unit="kg"
                error={errors.weight}
              />

              <MeasurementInput
                id="neck"
                label="Pescoço"
                value={formData.neck}
                onChange={updateFormData('neck')}
                placeholder="Ex: 38"
                unit="cm"
                error={errors.neck}
              />

              <MeasurementInput
                id="waist"
                label="Cintura"
                value={formData.waist}
                onChange={updateFormData('waist')}
                placeholder="Ex: 85"
                unit="cm"
                error={errors.waist}
              />

              {formData.gender === "female" && (
                <MeasurementInput
                  id="hip"
                  label="Quadril"
                  value={formData.hip}
                  onChange={updateFormData('hip')}
                  placeholder="Ex: 95"
                  unit="cm"
                  error={errors.hip}
                />
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={calculateBodyFat}
                className="flex-1"
                data-testid="button-calculate"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular
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

        {/* Result */}
        {result && (
          <ResultDisplay
            bodyFatPercentage={result.bodyFatPercentage}
            category={result.category}
            categoryColor={result.categoryColor}
          />
        )}
      </div>
    </div>
  );
}