
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Utensils, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface MacroDistributionProps {
  dailyCalories: number;
  categoryName: string;
  onGenerateMenu: () => void;
  onBack: () => void;
}

interface MacroInfo {
  name: string;
  percentage: number;
  calories: number;
  grams: number;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MacroDistribution({ 
  dailyCalories, 
  categoryName, 
  onGenerateMenu, 
  onBack 
}: MacroDistributionProps) {
  
  // Calcular distribución de macronutrientes
  const calculateMacros = (): MacroInfo[] => {
    const proteinPercentage = 40;
    const carbPercentage = 35;
    const fatPercentage = 25;

    const proteinCalories = Math.round(dailyCalories * (proteinPercentage / 100));
    const carbCalories = Math.round(dailyCalories * (carbPercentage / 100));
    const fatCalories = Math.round(dailyCalories * (fatPercentage / 100));

    // Convertir a gramos (proteína = 4 kcal/g, carbs = 4 kcal/g, grasa = 9 kcal/g)
    const proteinGrams = Math.round(proteinCalories / 4);
    const carbGrams = Math.round(carbCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    return [
      {
        name: "Proteínas",
        percentage: proteinPercentage,
        calories: proteinCalories,
        grams: proteinGrams,
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200",
        icon: Target
      },
      {
        name: "Carbohidratos",
        percentage: carbPercentage,
        calories: carbCalories,
        grams: carbGrams,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
        icon: Target
      },
      {
        name: "Grasas",
        percentage: fatPercentage,
        calories: fatCalories,
        grams: fatGrams,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200",
        icon: Target
      }
    ];
  };

  const macros = calculateMacros();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Distribución de Macronutrientes
          </h1>
          <p className="text-muted-foreground mb-4">
            Basada en tu categoría seleccionada: <strong>{categoryName}</strong>
          </p>
          
          {/* Total Calories Badge */}
          <Badge variant="outline" className="text-lg py-2 px-4 font-semibold">
            {dailyCalories} kcal diarias
          </Badge>
        </div>

        {/* Macro Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {macros.map((macro, index) => (
            <Card key={index} className={`${macro.bgColor} border-2 hover:shadow-lg transition-shadow`}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <macro.icon className={`w-6 h-6 ${macro.color}`} />
                  <CardTitle className={`text-xl ${macro.color}`}>
                    {macro.name}
                  </CardTitle>
                </div>
                
                {/* Percentage Badge */}
                <Badge 
                  variant="secondary" 
                  className={`text-lg py-1 px-3 font-bold ${macro.color}`}
                >
                  {macro.percentage}%
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-white/70 rounded-lg p-4 space-y-3">
                  
                  {/* Calories */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-medium">
                      Calorías:
                    </span>
                    <span className={`font-bold text-lg ${macro.color}`}>
                      {macro.calories} kcal
                    </span>
                  </div>

                  {/* Grams */}
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-sm text-muted-foreground font-medium">
                      Cantidad:
                    </span>
                    <span className={`font-bold text-xl ${macro.color}`}>
                      {macro.grams}g
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="bg-accent/30 border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                Resumen Nutricional Diario
              </h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-600">
                    {macros[0].grams}g
                  </p>
                  <p className="text-sm text-muted-foreground">Proteínas</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-600">
                    {macros[1].grams}g
                  </p>
                  <p className="text-sm text-muted-foreground">Carbohidratos</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-yellow-600">
                    {macros[2].grams}g
                  </p>
                  <p className="text-sm text-muted-foreground">Grasas</p>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Esta distribución optimiza la pérdida de peso manteniendo una alta ingesta de proteínas 
                  para preservar la masa muscular, mientras proporciona carbohidratos y grasas esenciales 
                  para el funcionamiento óptimo del organismo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 py-3 text-lg font-semibold"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Regresar a Categorías
          </Button>
          
          <Button
            onClick={onGenerateMenu}
            className="flex-1 py-3 text-lg font-semibold"
            size="lg"
          >
            <Target className="w-5 h-5 mr-2" />
            Panel
          </Button>
        </div>
      </div>
    </div>
  );
}
