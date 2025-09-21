import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calculator, Utensils, Target, Zap, Activity, Leaf } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface ResultsProps {
  bodyFatPercentage: number;
  tmb: number;
  category: string;
  categoryColor: 'success' | 'warning' | 'destructive';
  onRecalculate: () => void;
}

interface DietCategory {
  name: string;
  description: string;
  calorieDeficit: number;
  dailyCalories: number;
  weeklyWeightLoss: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function Results({ bodyFatPercentage, tmb, category, categoryColor, onRecalculate }: ResultsProps) {
  const [, navigate] = useLocation();

  const getCategoryVariant = (color: string) => {
    switch (color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'destructive': return 'destructive';
      default: return 'default';
    }
  };

  // Calculate diet categories based on TDEE
  const calculateDietCategories = (tdee: number): DietCategory[] => {
    const restrictedDeficit = 700;
    const moderateDeficit = 500;
    const gentleDeficit = 300;

    // 1 kg of fat = approximately 7700 kcal
    const caloriesPerKg = 7700;
    const daysPerWeek = 7;

    return [
      {
        name: "Categoría Restringida",
        description: "Pérdida de peso más rápida con mayor déficit calórico",
        calorieDeficit: restrictedDeficit,
        dailyCalories: Math.max(1200, tdee - restrictedDeficit), // Minimum 1200 calories
        weeklyWeightLoss: (restrictedDeficit * daysPerWeek) / caloriesPerKg,
        icon: Zap,
        color: "text-red-600"
      },
      {
        name: "Categoría Moderada",
        description: "Equilibrio entre pérdida de peso y sostenibilidad",
        calorieDeficit: moderateDeficit,
        dailyCalories: Math.max(1200, tdee - moderateDeficit),
        weeklyWeightLoss: (moderateDeficit * daysPerWeek) / caloriesPerKg,
        icon: Activity,
        color: "text-orange-600"
      },
      {
        name: "Categoría Suave",
        description: "Pérdida de peso gradual y sostenible",
        calorieDeficit: gentleDeficit,
        dailyCalories: Math.max(1200, tdee - gentleDeficit),
        weeklyWeightLoss: (gentleDeficit * daysPerWeek) / caloriesPerKg,
        icon: Leaf,
        color: "text-green-600"
      }
    ];
  };

  const dietCategories = calculateDietCategories(tmb);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Tus Resultados de Composición Corporal
          </h1>
          <p className="text-muted-foreground">
            Análisis completo basado en el método de la Marina de EE.UU.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Body Fat Results */}
          <Card className="border-primary/20 bg-accent/30">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Porcentaje de Grasa Corporal</h3>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {bodyFatPercentage.toFixed(1)}%
                </div>
                <Badge variant={getCategoryVariant(categoryColor)}>
                  {category}
                </Badge>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Este resultado fue calculado usando el método oficial de la Marina de EE.UU.,
                  ampliamente reconocido por su precisión y confiabilidad.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metabolic Rate Results */}
          <Card className="border-primary/20 bg-accent/30">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Calculator className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Gasto Energético Diario</h3>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {Math.round(tmb)} <span className="text-lg">kcal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calorías que tu cuerpo necesita diariamente
                </p>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Calculado considerando tu composición corporal, edad, género y nivel de actividad física.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diet Categories Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Categorías de Dieta Recomendadas
            </h2>
            <p className="text-muted-foreground">
              Elige la categoría que mejor se adapte a tus objetivos y estilo de vida
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {dietCategories.map((dietCategory, index) => (
              <Card key={index} className="border-primary/20 bg-accent/30 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <dietCategory.icon className={`w-6 h-6 ${dietCategory.color}`} />
                    <CardTitle className={`text-lg ${dietCategory.color}`}>
                      {dietCategory.name}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dietCategory.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="bg-background/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Calorías diarias:</span>
                      <span className="font-semibold text-primary">
                        {dietCategory.dailyCalories} kcal
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Déficit calórico:</span>
                      <span className="font-semibold text-orange-600">
                        -{dietCategory.calorieDeficit} kcal
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm text-muted-foreground">Pérdida semanal:</span>
                      <span className="font-semibold text-green-600">
                        ~{dietCategory.weeklyWeightLoss.toFixed(1)} kg
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    Generar Menú
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-background/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-left">
                <p className="text-sm text-muted-foreground">
                  <strong>Porcentaje de Grasa:</strong> Calculado por el método oficial de la Marina de EE.UU.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Gasto Energético:</strong> Calculado por la fórmula Mifflin-St Jeor, considerando su nivel de actividad física
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Recomendaciones:</strong> Basadas en déficits calóricos seguros. Consulte un profesional antes de iniciar cualquier dieta restrictiva.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex-1 py-3 text-lg font-semibold"
            size="lg"
            data-testid="button-dashboard"
          >
            <Home className="w-5 h-5 mr-2" />
            Panel
          </Button>
          <Button
            onClick={onRecalculate}
            className="flex-1 py-3 text-lg font-semibold"
            size="lg"
            data-testid="button-recalculate"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Recalcular
          </Button>
        </div>
      </div>
    </div>
  );
}