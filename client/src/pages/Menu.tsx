import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Utensils, Target, Calculator, Home } from "lucide-react";
import { calculateMacroTargets, convertToHouseholdMeasures, translateCategoryToPortuguese } from "@/lib/nutrition";
import { MacroTarget, MenuPlan } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface CalculationData {
  bodyFatPercent: number;
  category: string;
  bmr: number;
  tdee: number;
}

interface BodyMetricsData {
  gender: string;
  age: number;
  height: number;
  weight: number;
  neck: number;
  waist: number;
  hip: number | null;
  activityLevel: string;
}

interface MenuPlanData {
  category: string;
  tdee: number;
  targetCalories: number;
  macroTarget: MacroTarget;
  meals: any[];
  dailyTotals: any;
}

export default function MenuPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [generatingMenu, setGeneratingMenu] = useState(false);

  // Get category and calories from URL params (if coming from results page selection)
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get('cat') as 'suave' | 'moderado' | 'restritivo' | null;
  const selectedCalories = params.get('cal') ? parseInt(params.get('cal')!) : null;

  // Fetch user's calculation data
  const { data: calculation, isLoading: calculationLoading } = useQuery<CalculationData>({
    queryKey: ['/api/calculation'],
    enabled: !!user,
  });

  // Fetch user's body metrics
  const { data: bodyMetrics, isLoading: metricsLoading } = useQuery<BodyMetricsData>({
    queryKey: ['/api/body-metrics'],
    enabled: !!user,
  });

  // Fetch existing menu plan
  const { data: existingMenu, isLoading: menuLoading, error: menuError } = useQuery<MenuPlanData>({
    queryKey: ['/api/menu'],
    enabled: !!user,
  });

  // Mutation to save menu plan
  const saveMenuMutation = useMutation({
    mutationFn: async (menuData: any) => {
      const response = await apiRequest("POST", "/api/menu", menuData);
      return response.json();
    },
  });

  const isLoading = calculationLoading || metricsLoading || menuLoading || generatingMenu;

  // Generate menu plan using templates
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!calculation || !bodyMetrics) {
      if (!calculationLoading && !metricsLoading) {
        toast({
          title: "Datos no encontrados",
          description: "Realice el cálculo primero. Redirigiendo...",
          variant: "destructive",
        });
        navigate('/calculator');
      }
      return;
    }

    // If category is selected from URL params, ALWAYS generate new menu using templates
    if (selectedCategory && !generatingMenu) {
      generateMenuFromTemplate();
    }

    // If no category selected and no existing menu, redirect to results
    if (!selectedCategory && !existingMenu && !menuLoading && !menuError && !generatingMenu) {
      navigate('/results');
    }
  }, [calculation, bodyMetrics, selectedCategory, user, calculationLoading, metricsLoading, generatingMenu]);

  const generateMenuFromTemplate = async () => {
    if (!calculation || !bodyMetrics) return;

    // Additional validation before starting generation
    if (isNaN(calculation.tdee) || isNaN(calculation.bodyFatPercent) || 
        isNaN(bodyMetrics.weight) || calculation.tdee <= 0 || bodyMetrics.weight <= 0) {
      toast({
        title: "Datos de cálculo inválidos",
        description: "Por favor, realice los cálculos nuevamente.",
        variant: "destructive",
      });
      navigate('/calculator');
      return;
    }

    setGeneratingMenu(true);
    try {
      // SEMPRE deletar qualquer cardápio existente primeiro
      try {
        await apiRequest("DELETE", "/api/menu");
        console.log("✅ Cardápio anterior deletado com sucesso");
      } catch (deleteError) {
        // Se erro 404 (não existe), tudo bem, continua
        console.log("ℹ️ Nenhum cardápio anterior para deletar (normal)");
      }

      // Invalidar cache para garantir que não há cardápio antigo
      await queryClient.invalidateQueries({ queryKey: ['/api/menu'] });

      // Use selected category or default to 'moderado', translate if necessary
      const rawCategory = selectedCategory || 'moderado';
      const category = translateCategoryToPortuguese(rawCategory);
      console.log("🌐 Category translation:", rawCategory, "->", category);

      // Calculate target calories
      let targetCalories: number;
      if (selectedCalories) {
        targetCalories = selectedCalories;
      } else {
        // Fallback calculation with correct deficits matching Results component
        const calorieReductions = { suave: 300, moderado: 500, restritivo: 750 };
        targetCalories = Math.max(1200, calculation.tdee - calorieReductions[category]);
      }

      // Calculate macro targets for template matching
      const macroTarget = calculateMacroTargets(
        calculation.tdee,
        targetCalories,
        bodyMetrics.weight,
        calculation.bodyFatPercent,
        category
      );

      // Find best matching template
      const templateResponse = await apiRequest("POST", "/api/find-template", {
        gender: bodyMetrics.gender,
        targetCalories: targetCalories,
        targetProtein: macroTarget.protein_g,
        targetCarb: macroTarget.carb_g,
        targetFat: macroTarget.fat_g
      });

      const bestTemplate = await templateResponse.json();

      if (!bestTemplate) {
        throw new Error("Nenhum template encontrado para seus critérios");
      }

      console.log("✅ Template encontrado:", bestTemplate.name);

      // Process template meals to add missing totals
      const processedMeals = bestTemplate.meals.map((meal: any) => ({
        ...meal,
        totals: {
          protein: Math.round(meal.approximate_calories * 0.16 / 4), // Approximate protein from calories
          carb: Math.round(meal.approximate_calories * 0.55 / 4), // Approximate carb from calories  
          fat: Math.round(meal.approximate_calories * 0.29 / 9), // Approximate fat from calories
          kcal: meal.approximate_calories
        }
      }));

      // Create menu data using the processed template
      const menuData = {
        category,
        tdee: calculation.tdee,
        targetCalories,
        macroTarget,
        meals: processedMeals,
        dailyTotals: {
          protein: bestTemplate.protein_grams,
          carb: bestTemplate.carb_grams,
          fat: bestTemplate.fat_grams,
          kcal: bestTemplate.total_calories,
        }
      };

      // Save to server
      await saveMenuMutation.mutateAsync(menuData);

      // Invalidate cache to fetch updated menu
      await queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/me/summary'] });

      toast({
        title: "¡Menú generado!",
        description: "Su menú personalizado ha sido creado con éxito.",
      });

      // Clear the category parameter from URL to prevent re-generation
      navigate('/menu', { replace: true });

    } catch (error) {
      console.error('Error generating menu from template:', error);

      let errorMessage = "No se pudo generar el menú. Inténtelo de nuevo.";
      if (error instanceof Error) {
        if (error.message.includes('inválidos') || error.message.includes('NaN')) {
          errorMessage = "Datos de cálculo inválidos. Por favor, recalcule.";
        } else if (error.message.includes('template')) {
          errorMessage = "No se encontró ninguna plantilla compatible. Intente una categoría diferente.";
        }
      }

      toast({
        title: "Error al generar menú",
        description: errorMessage,
        variant: "destructive",
      });

      if (error instanceof Error && error.message.includes('inválidos')) {
        navigate('/calculator');
      }
    } finally {
      setGeneratingMenu(false);
    }
  };

  const handleGoBack = () => {
    navigate("/results");
  };

  const handleRecalculate = () => {
    // Invalidate cache and redirect to calculator
    queryClient.invalidateQueries({ queryKey: ['/api/calculation'] });
    queryClient.invalidateQueries({ queryKey: ['/api/body-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
    queryClient.invalidateQueries({ queryKey: ['/api/me/summary'] });
    navigate("/calculator");
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
        <Card className="border-primary/20 bg-accent/30">
          <CardContent className="p-8 text-center">
            <Calculator className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-foreground">
              {generatingMenu ? "Generando su menú personalizado..." : "Cargando..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!existingMenu || !calculation) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive">
              {!calculation ? "No se encontraron cálculos." : "Error al cargar el menú."}
            </p>
            <Button onClick={handleGoBack} data-testid="button-back-to-results">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Resultados
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuPlan: MenuPlan = {
    category: existingMenu.category as 'suave' | 'moderado' | 'restritivo',
    tdee: existingMenu.tdee,
    targetCalories: existingMenu.targetCalories,
    macroTarget: existingMenu.macroTarget,
    meals: existingMenu.meals,
    dailyTotals: existingMenu.dailyTotals,
  };

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'suave': return 'default';
      case 'moderado': return 'secondary';
      case 'restritivo': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Utensils className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Menú Personalizado</h1>
          </div>
          <Badge 
            variant={getCategoryBadgeVariant(menuPlan.category)}
            className="text-sm px-3 py-1"
            data-testid={`badge-category-${menuPlan.category}`}
          >
            Plan {menuPlan.category.charAt(0).toUpperCase() + menuPlan.category.slice(1)}
          </Badge>

        </div>

        {/* Macro Targets */}
        <Card className="border-primary/20 bg-accent/30" data-testid="card-macro-targets">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Metas de Macronutrientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-target-calories">
                  {menuPlan.macroTarget.calories}
                </div>
                <p className="text-xs text-muted-foreground">Calorías</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-target-protein">
                  {menuPlan.macroTarget.protein_g}g
                </div>
                <p className="text-xs text-muted-foreground">Proteína ({menuPlan.macroTarget.protein_percent}%)</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-target-carb">
                  {menuPlan.macroTarget.carb_g}g
                </div>
                <p className="text-xs text-muted-foreground">Carbohidratos ({menuPlan.macroTarget.carb_percent}%)</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-target-fat">
                  {menuPlan.macroTarget.fat_g}g
                </div>
                <p className="text-xs text-muted-foreground">Grasas ({menuPlan.macroTarget.fat_percent}%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        <div className="space-y-4">
          {menuPlan.meals.map((meal, index) => (
            <Card key={meal.name} className="border-primary/20 bg-accent/30" data-testid={`card-meal-${meal.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {meal.name}
                </CardTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{meal.approximate_calories} kcal</span>
                  <span>•</span>
                  <span>P: {meal.totals.protein}g</span>
                  <span>•</span>
                  <span>C: {meal.totals.carb}g</span>
                  <span>•</span>
                  <span>G: {meal.totals.fat}g</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meal.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item?.name || "Item sin nombre"}</div>
                        <div className="text-xs text-muted-foreground">
                          {item?.grams || 0}g {item?.name ? convertToHouseholdMeasures(item.name, item.grams || 0) : ""}
                        </div>
                      </div>
                      <div className="text-right text-xs space-y-1">
                        <div>{item?.protein || 0}g P</div>
                        <div>{item?.carb || 0}g C</div>
                        <div>{item?.fat || 0}g G</div>
                        <div className="font-medium">{item?.kcal || 0} kcal</div>
                      </div>
                    </div>
                  )) || <div className="text-muted-foreground">Ningún item disponible</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm font-medium bg-muted/30 p-3 rounded">
          <span>Total de la Comida:</span>
          <div className="flex space-x-4">
            <span>{menuPlan.dailyTotals?.protein || 0}g P</span>
            <span>{menuPlan.dailyTotals?.carb || 0}g C</span>
            <span>{menuPlan.dailyTotals?.fat || 0}g G</span>
            <span className="font-bold">{menuPlan.dailyTotals?.kcal || 0} kcal</span>
          </div>
        </div>

        {/* Daily Totals */}
        <Card className="border-primary/20 bg-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Totales Diarios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-daily-calories">
                  {menuPlan.dailyTotals?.kcal || 0}
                </div>
                <p className="text-xs text-muted-foreground">Calorías Totales</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-daily-protein">
                  {menuPlan.dailyTotals?.protein || 0}g
                </div>
                <p className="text-xs text-muted-foreground">Proteína</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-daily-carb">
                  {menuPlan.dailyTotals?.carb || 0}g
                </div>
                <p className="text-xs text-muted-foreground">Carbohidratos</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-daily-fat">
                  {menuPlan.dailyTotals?.fat || 0}g
                </div>
                <p className="text-xs text-muted-foreground">Grasas</p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleGoToDashboard}
            variant="outline"
            data-testid="button-dashboard"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button 
            onClick={handleGoBack}
            variant="outline"
            data-testid="button-back-to-results"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Resultados
          </Button>
          <Button 
            onClick={handleRecalculate}
            className="bg-primary hover:bg-primary/90"
            data-testid="button-recalculate"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Recalcular
          </Button>
        </div>
      </div>
    </div>
  );
}