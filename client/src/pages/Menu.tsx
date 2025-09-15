import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Utensils, Target, Calculator } from "lucide-react";
import { calculateMacroTargets, generateMealPlan } from "@/lib/nutrition";
import { MacroTarget, MenuPlan } from "@shared/schema";

export default function MenuPage() {
  const [, navigate] = useLocation();
  const [menuPlan, setMenuPlan] = useState<MenuPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('cat') as 'suave' | 'moderado' | 'restritivo';
    const calories = params.get('cal');
    const tdee = params.get('tdee');
    const weight = params.get('weight');
    const bodyFat = params.get('bf');

    if (!category || !calories || !tdee || !weight || !bodyFat) {
      setError("Parâmetros inválidos. Retorne à tela de resultados.");
      setLoading(false);
      return;
    }

    try {
      const targetCalories = parseInt(calories);
      const tdeeValue = parseInt(tdee);
      const bodyWeight = parseFloat(weight);
      const bodyFatPercentage = parseFloat(bodyFat);

      // Validate numeric values
      if (!Number.isFinite(targetCalories) || !Number.isFinite(tdeeValue) || 
          !Number.isFinite(bodyWeight) || !Number.isFinite(bodyFatPercentage) ||
          targetCalories <= 0 || tdeeValue <= 0 || bodyWeight <= 0 || 
          bodyFatPercentage < 0 || bodyFatPercentage > 50) {
        throw new Error("Invalid numeric parameters");
      }

      // Calculate macro targets
      const macroTarget = calculateMacroTargets(
        tdeeValue,
        targetCalories,
        bodyWeight,
        bodyFatPercentage,
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

      const plan: MenuPlan = {
        category,
        tdee: tdeeValue,
        target_calories: targetCalories,
        macro_target: macroTarget,
        meals,
        daily_totals: {
          protein: Math.round(dailyTotals.protein * 10) / 10,
          carb: Math.round(dailyTotals.carb * 10) / 10,
          fat: Math.round(dailyTotals.fat * 10) / 10,
          kcal: Math.round(dailyTotals.kcal),
        },
      };

      setMenuPlan(plan);
    } catch (err) {
      setError("Erro ao gerar o cardápio. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGoBack = () => {
    navigate("/results");
  };

  const handleRecalculate = () => {
    localStorage.removeItem("bodyFatResult");
    localStorage.removeItem("calculatorFormData");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
        <Card className="border-primary/20 bg-accent/30">
          <CardContent className="p-8 text-center">
            <Calculator className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-foreground">Gerando seu cardápio personalizado...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !menuPlan) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleGoBack} data-testid="button-back-to-results">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Resultados
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  {menuPlan.macro_target.calories}
                </div>
                <p className="text-xs text-muted-foreground">Calorias</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-target-protein">
                  {menuPlan.macro_target.protein_g}g
                </div>
                <p className="text-xs text-muted-foreground">Proteína ({menuPlan.macro_target.protein_percent}%)</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-target-carb">
                  {menuPlan.macro_target.carb_g}g
                </div>
                <p className="text-xs text-muted-foreground">Carboidratos ({menuPlan.macro_target.carb_percent}%)</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground" data-testid="text-target-fat">
                  {menuPlan.macro_target.fat_g}g
                </div>
                <p className="text-xs text-muted-foreground">Gorduras ({menuPlan.macro_target.fat_percent}%)</p>
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
                  {menuPlan.daily_totals.kcal}
                </div>
                <p className="text-xs text-muted-foreground">Calorias</p>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground" data-testid="text-total-protein">
                  {menuPlan.daily_totals.protein}g
                </div>
                <p className="text-xs text-muted-foreground">Proteína</p>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground" data-testid="text-total-carb">
                  {menuPlan.daily_totals.carb}g
                </div>
                <p className="text-xs text-muted-foreground">Carboidratos</p>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground" data-testid="text-total-fat">
                  {menuPlan.daily_totals.fat}g
                </div>
                <p className="text-xs text-muted-foreground">Gorduras</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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