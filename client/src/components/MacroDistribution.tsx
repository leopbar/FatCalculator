import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Utensils, ArrowLeft, ArrowRight, ChefHat, Clock, Apple } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface MacroDistributionProps {
  dailyCalories: number;
  categoryName: string;
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
  onBack
}: MacroDistributionProps) {
  const [, navigate] = useLocation();

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

  // Configurar query para buscar menu mais próximo automaticamente
  const { data: menuData, isLoading: isLoadingMenu, error: menuError } = useQuery({
    queryKey: ['closest-menu', dailyCalories, macros[0].grams, macros[1].grams, macros[2].grams],
    queryFn: async () => {
      const response = await fetch('/api/menu/closest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          calories: dailyCalories,
          protein_g: macros[0].grams,
          carb_g: macros[1].grams,
          fat_g: macros[2].grams,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar cardápio');
      }

      return response.json();
    },
    enabled: dailyCalories > 0, // Executa automaticamente quando há calorias válidas
  });

  const getMealIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'desayuno':
        return '🌅';
      case 'almuerzo':
        return '🍽️';
      case 'merienda':
        return '🍎';
      case 'cena':
        return '🌙';
      case 'colación':
        return '🥜';
      default:
        return '🍴';
    }
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'proteínas':
        return '🥩';
      case 'carbohidratos':
        return '🍞';
      case 'grasas':
        return '🥑';
      case 'vegetales':
        return '🥬';
      case 'frutas':
        return '🍎';
      case 'lácteos':
        return '🥛';
      default:
        return '🍽️';
    }
  };

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

        {/* Menu Section */}
        {isLoadingMenu && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-lg">Generando tu menú personalizado...</span>
            </div>
          </div>
        )}

        {menuError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">
              Error al generar el menú. Intenta nuevamente más tarde.
            </p>
          </div>
        )}

        {menuData && !isLoadingMenu && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-700 mb-2 flex items-center justify-center gap-2">
                <ChefHat className="w-6 h-6" />
                Menú Personalizado
              </h2>
              <p className="text-green-600 font-medium">{menuData.nombre}</p>

              {/* Menu Totals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 max-w-2xl mx-auto">
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Calorías</div>
                  <div className="text-lg font-bold text-green-600">{Math.round(menuData.calorias_totales)}</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Proteínas</div>
                  <div className="text-lg font-bold text-blue-600">{Math.round(menuData.proteina_total_gramos)}g</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Carbos</div>
                  <div className="text-lg font-bold text-green-600">{Math.round(menuData.carbohidratos_total_gramos)}g</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Grasas</div>
                  <div className="text-lg font-bold text-yellow-600">{Math.round(menuData.grasas_total_gramos)}g</div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuData.meals?.map((meal: any, index: number) => (
                <Card key={meal.id || index} className="bg-white/80 border-2 border-white hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{getMealIcon(meal.tipo_comida)}</span>
                      <span className="capitalize text-gray-700">{meal.tipo_comida}</span>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(meal.calorias_comida || 0)} kcala)} kcal
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Meal Macros */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="text-center bg-blue-50 rounded p-2">
                        <div className="font-semibold text-blue-600">{Math.round(meal.proteina_comida_gramos)}g</div>
                        <div className="text-blue-500">Prot.</div>
                      </div>
                      <div className="text-center bg-green-50 rounded p-2">
                        <div className="font-semibold text-green-600">{Math.round(meal.carbohidratos_comida_gramos)}g</div>
                        <div className="text-green-500">Carbs</div>
                      </div>
                      <div className="text-center bg-yellow-50 rounded p-2">
                        <div className="font-semibold text-yellow-600">{Math.round(meal.grasas_comida_gramos)}g</div>
                        <div className="text-yellow-500">Grasas</div>
                      </div>
                    </div>

                    {/* Foods */}
                    <div className="space-y-2">
                      {meal.alimentos?.map((alimento: any, foodIndex: number) => (
                        <div key={alimento.id || foodIndex} className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
                          <span className="text-lg">{getCategoryIcon(alimento.categoria?.nombre || '')}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">{alimento.nombre}</div>
                            <div className="text-xs text-gray-500">
                              {alimento.cantidad_gramos}g
                              {alimento.medida_casera && (
                                <span className="ml-1">({alimento.medida_casera})</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-right text-gray-500">
                            <div>{Math.round(alimento.calorias)} kcal</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Panel
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Resultados
          </Button>
        </div>
      </div>
    </div>
  );
}