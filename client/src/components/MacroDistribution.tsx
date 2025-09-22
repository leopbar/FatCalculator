
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
  const [showMenu, setShowMenu] = useState(false);
  const [menuMacros, setMenuMacros] = useState<any>(null);
  
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

  // Configurar query para buscar menu mais próximo
  const { data: menuData, isLoading: isLoadingMenu, refetch: generateMenu } = useQuery({
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
    enabled: false, // Só executa quando chamado manualmente
  });

  const handleGenerateMenu = () => {
    setMenuMacros(macros);
    setShowMenu(true);
    generateMenu();
  };

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

        {/* Generated Menu Section */}
        {showMenu && (
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 mb-8">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <ChefHat className="w-8 h-8 text-green-600" />
                <CardTitle className="text-2xl text-green-700">
                  Tu Menú Personalizado
                </CardTitle>
              </div>
              {menuData && (
                <Badge variant="outline" className="text-base py-2 px-4 bg-white/70">
                  {menuData.nombre}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {isLoadingMenu ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generando tu menú personalizado...</p>
                </div>
              ) : menuData ? (
                <>
                  {/* Menu Overview */}
                  <div className="bg-white/70 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Resumen del Menú
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-600">{Math.round(menuData.calorias_totales)}</div>
                        <div className="text-sm text-red-700">Calorías</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(menuData.proteina_total_gramos)}g</div>
                        <div className="text-sm text-blue-700">Proteínas</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">{Math.round(menuData.carbohidratos_total_gramos)}g</div>
                        <div className="text-sm text-green-700">Carbohidratos</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-600">{Math.round(menuData.grasas_total_gramos)}g</div>
                        <div className="text-sm text-yellow-700">Grasas</div>
                      </div>
                    </div>
                  </div>

                  {/* Meals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-700 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Comidas del Día
                    </h3>
                    
                    {menuData.meals && menuData.meals.map((meal: any, index: number) => (
                      <Card key={meal.id} className="bg-white/50 border-green-100 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getMealIcon(meal.tipo_comida)}</span>
                              <div>
                                <h4 className="font-semibold text-lg capitalize">{meal.tipo_comida}</h4>
                                <div className="flex space-x-4 text-sm text-muted-foreground">
                                  <span>{Math.round(meal.calorias_comida)} kcal</span>
                                  <span>{Math.round(meal.proteina_comida_gramos)}g prot</span>
                                  <span>{Math.round(meal.carbohidratos_comida_gramos)}g carb</span>
                                  <span>{Math.round(meal.grasas_comida_gramos)}g grasa</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="grid gap-3">
                            {meal.alimentos && meal.alimentos.map((alimento: any, idx: number) => (
                              <div key={alimento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <span className="text-xl">{getCategoryIcon(alimento.categoria.nombre)}</span>
                                  <div>
                                    <p className="font-medium">{alimento.nombre}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {alimento.cantidad_gramos}g
                                      {alimento.medida_casera && ` (${alimento.medida_casera})`}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right text-sm">
                                  <p className="font-semibold">{Math.round(alimento.calorias)} kcal</p>
                                  <p className="text-muted-foreground">
                                    {Math.round(alimento.proteina_gramos)}p / {Math.round(alimento.carbohidratos_gramos)}c / {Math.round(alimento.grasas_gramos)}g
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Apple className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No se encontraron menús disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
            onClick={handleGenerateMenu}
            className="flex-1 py-3 text-lg font-semibold"
            size="lg"
            disabled={isLoadingMenu}
          >
            <ChefHat className="w-5 h-5 mr-2" />
            {isLoadingMenu ? 'Generando...' : 'Generar Menú'}
          </Button>
        </div>
      </div>
    </div>
  );
}
