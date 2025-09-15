import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Utensils, Target, Calculator, Home } from "lucide-react";
import { calculateMacroTargets, generateMealPlan } from "@/lib/nutrition";
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

  // Get category from URL params (if coming from results page selection)
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get('cat') as 'suave' | 'moderado' | 'restritivo' | null;

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

  // Generate menu plan if needed
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!calculation || !bodyMetrics) {
      if (!calculationLoading && !metricsLoading) {
        toast({
          title: "Dados não encontrados",
          description: "Realize o cálculo primeiro. Redirecionando...",
          variant: "destructive",
        });
        navigate('/calculator');
      }
      return;
    }

    // Only generate if category is selected (from URL params) and no existing menu
    if (selectedCategory && !generatingMenu && !existingMenu) {
      generateMenuPlan();
    }
    
    // If no category selected and no existing menu, redirect to results
    if (!selectedCategory && !existingMenu && !menuLoading && !menuError) {
      navigate('/results');
    }
  }, [calculation, bodyMetrics, selectedCategory, user, calculationLoading, metricsLoading, generatingMenu, existingMenu, menuLoading, menuError]);

  const generateMenuPlan = async () => {
    if (!calculation || !bodyMetrics) return;

    setGeneratingMenu(true);
    try {
      // Use selected category or default to 'moderado'
      const category = selectedCategory || 'moderado';
      
      // Calculate target calories based on category
      const calorieReductions = { suave: 200, moderado: 400, restritivo: 600 };
      const targetCalories = calculation.tdee - calorieReductions[category];

      // Calculate macro targets
      const macroTarget = calculateMacroTargets(
        calculation.tdee,
        targetCalories,
        bodyMetrics.weight,
        calculation.bodyFatPercent,
        category
      );

      // Generate meal plan
      const meals = generateMealPlan(macroTarget, category);

      // Calculate daily totals
      const dailyTotals = meals.reduce(
        (acc, meal) => ({
          protein: acc.protein + meal.totals.protein,
          carb: acc.carb + meal.totals.carb,
          fat: acc.fat + meal.totals.fat,
          kcal: acc.kcal + meal.totals.kcal,
        }),
        { protein: 0, carb: 0, fat: 0, kcal: 0 }
      );

      const menuData = {
        category,
        tdee: calculation.tdee,
        targetCalories,
        macroTarget,
        meals,
        dailyTotals: {
          protein: Math.round(dailyTotals.protein * 10) / 10,
          carb: Math.round(dailyTotals.carb * 10) / 10,
          fat: Math.round(dailyTotals.fat * 10) / 10,
          kcal: Math.round(dailyTotals.kcal),
        },
      };

      // Save to server
      await saveMenuMutation.mutateAsync(menuData);

      // Invalidate cache to fetch updated menu - wait for invalidation
      await queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/me/summary'] });

      toast({
        title: "Cardápio gerado!",
        description: "Seu cardápio personalizado foi criado com sucesso.",
      });

      // Clear the category parameter from URL to prevent re-generation
      navigate('/menu', { replace: true });

    } catch (error) {
      console.error('Error generating menu:', error);
      toast({
        title: "Erro ao gerar cardápio",
        description: "Não foi possível gerar o cardápio. Tente novamente.",
        variant: "destructive",
      });
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
              {generatingMenu ? "Gerando seu cardápio personalizado..." : "Carregando..."}
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
              {!calculation ? "Nenhum cálculo encontrado." : "Erro ao carregar cardápio."}
            </p>
            <Button onClick={handleGoBack} data-testid="button-back-to-results">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Resultados
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
            <h1 className="text-2xl font-bold text-foreground">Cardápio Personalizado</h1>
          </div>
          <Badge 
            variant={getCategoryBadgeVariant(menuPlan.category)}
            className="text-sm px-3 py-1"
            data-testid={`badge-category-${menuPlan.category}`}
          >
            Plano {menuPlan.category.charAt(0).toUpperCase() + menuPlan.category.slice(1)}
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
                <p className="text-xs text-muted-foreground">Calorias</p>
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
                <p className="text-xs text-muted-foreground">Carboidratos ({menuPlan.macroTarget.carb_percent}%)</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-target-fat">
                  {menuPlan.macroTarget.fat_g}g
                </div>
                <p className="text-xs text-muted-foreground">Gorduras ({menuPlan.macroTarget.fat_percent}%)</p>
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
                  <span>{meal.totals.kcal} kcal</span>
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
                  {meal.items.map((item, itemIndex) => (
                    <div 
                      key={item.foodId} 
                      className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0"
                      data-testid={`food-item-${item.foodId}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.kcal} kcal • P: {item.protein}g • C: {item.carb}g • G: {item.fat}g
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary" data-testid={`food-grams-${item.foodId}`}>
                          {item.grams}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Totals */}
        <Card className="border-primary/20 bg-accent/30" data-testid="card-daily-totals">
          <CardHeader>
            <CardTitle className="text-center">Total Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="text-total-calories">
                  {menuPlan.dailyTotals.kcal}
                </div>
                <p className="text-xs text-muted-foreground">Calorias</p>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground" data-testid="text-total-protein">
                  {menuPlan.dailyTotals.protein}g
                </div>
                <p className="text-xs text-muted-foreground">Proteína</p>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground" data-testid="text-total-carb">
                  {menuPlan.dailyTotals.carb}g
                </div>
                <p className="text-xs text-muted-foreground">Carboidratos</p>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground" data-testid="text-total-fat">
                  {menuPlan.dailyTotals.fat}g
                </div>
                <p className="text-xs text-muted-foreground">Gorduras</p>
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
            Voltar aos Resultados
          </Button>
          <Button 
            onClick={handleRecalculate}
            className="bg-primary hover:bg-primary/90"
            data-testid="button-recalculate"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Refazer Cálculo
          </Button>
        </div>
      </div>
    </div>
  );
}