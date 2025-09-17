import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RotateCcw, Info, Flame, Target, ChefHat, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface ResultsProps {
  bodyFatPercentage: number;
  tmb: number;
  category: string;
  categoryColor: 'success' | 'warning' | 'destructive';
  onRecalculate: () => void;
}

export default function Results({ bodyFatPercentage, tmb, category, categoryColor, onRecalculate }: ResultsProps) {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<{
    category: 'suave' | 'moderado' | 'restritivo';
    calories: number;
  } | null>(null);
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  const getCategoryVariant = (color: string) => {
    switch (color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'destructive': return 'destructive';
      default: return 'default';
    }
  };

  // Get stored form data for menu generation
  const getStoredFormData = () => {
    const storedData = localStorage.getItem("calculatorFormData");
    return storedData ? JSON.parse(storedData) : null;
  };

  const handleSelectCategory = (category: 'suave' | 'moderado' | 'restritivo', calories: number) => {
    setSelectedCategory({ category, calories });
  };

  const handleGenerateMenu = () => {
    if (!selectedCategory) return;
    
    const formData = getStoredFormData();
    if (!formData) {
      console.error("Form data not found");
      return;
    }

    // Navigate to menu with parameters
    const params = new URLSearchParams({
      cat: selectedCategory.category,
      cal: selectedCategory.calories.toString(),
      tdee: tmb.toString(),
      weight: formData.weight.toString(),
      bf: bodyFatPercentage.toString()
    });
    
    navigate(`/menu?${params.toString()}`);
  };

  // Calculate weight loss recommendations based on TDEE
  const getWeightLossRecommendations = (tdee: number) => {
    const recommendations = [
      {
        category: "Suave",
        deficit: 300,
        intensity: "low"
      },
      {
        category: "Moderado", 
        deficit: 500,
        intensity: "medium"
      },
      {
        category: "Restritivo",
        deficit: 750,
        intensity: "high"
      }
    ];

    return recommendations.map(rec => {
      const dailyCalories = Math.max(1200, tdee - rec.deficit); // Minimum safe calories
      const weeklyDeficit = rec.deficit * 7;
      const weeklyWeightLoss = weeklyDeficit / 7700; // 1kg fat ≈ 7700 kcal
      
      return {
        ...rec,
        dailyCalories,
        weeklyWeightLoss: Math.round(weeklyWeightLoss * 10) / 10 // Round to 1 decimal
      };
    });
  };

  const weightLossRecommendations = getWeightLossRecommendations(tmb);

  return (
    <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
      <div className="max-w-md mx-auto space-y-6 w-full">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Resultado do Cálculo
          </h1>
          <p className="text-muted-foreground">
            Método oficial da Marinha dos EUA
          </p>
        </div>

        {/* Body Fat Result Card */}
        <Card className="border-primary/20 bg-accent/30" data-testid="card-result">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Percentual de Gordura</h2>
            </div>
            
            <div className="space-y-4">
              <div className="text-6xl font-bold text-primary" data-testid="text-percentage">
                {bodyFatPercentage.toFixed(1)}%
              </div>
              <Badge 
                variant={getCategoryVariant(categoryColor)} 
                className="text-lg px-4 py-2"
                data-testid="badge-category"
              >
                {category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* TDEE Result Card */}
        <Card className="border-primary/20 bg-accent/30" data-testid="card-tdee">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Flame className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Gasto Energético Diário</h3>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary" data-testid="text-tdee">
                {tmb.toLocaleString('pt-BR')}
              </div>
              <p className="text-sm text-muted-foreground">calorias por dia</p>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Energia que seu corpo gasta diariamente com seu nível de atividade física
            </p>
          </CardContent>
        </Card>

        {/* Weight Loss Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Target className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recomendações para Emagrecimento</h3>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Selecione uma categoria para gerar seu cardápio personalizado
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            {weightLossRecommendations.map((rec, index) => {
              const categoryKey = rec.category.toLowerCase() as 'suave' | 'moderado' | 'restritivo';
              const isSelected = selectedCategory?.category === categoryKey;
              
              return (
                <Card 
                  key={rec.category} 
                  className={`hover-elevate cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10 ring-2 ring-primary' 
                      : 'border-primary/20 bg-accent/30'
                  }`}
                  data-testid={`card-weight-loss-${rec.category.toLowerCase()}`}
                  onClick={() => handleSelectCategory(categoryKey, rec.dailyCalories)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="text-center">
                      <Badge 
                        variant={isSelected ? 'default' : (rec.intensity === 'low' ? 'default' : rec.intensity === 'medium' ? 'secondary' : 'outline')}
                        className={`text-sm px-3 py-1 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        {rec.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-center">
                      <div>
                        <div className={`text-2xl font-bold ${isSelected ? 'text-primary' : 'text-primary'}`} data-testid={`text-calories-${rec.category.toLowerCase()}`}>
                          {rec.dailyCalories.toLocaleString('pt-BR')}
                        </div>
                        <p className="text-xs text-muted-foreground">calorias por dia</p>
                      </div>
                      
                      <div>
                        <div className={`text-lg font-semibold ${isSelected ? 'text-foreground' : 'text-foreground'}`} data-testid={`text-weight-loss-${rec.category.toLowerCase()}`}>
                          ~{rec.weeklyWeightLoss} kg
                        </div>
                        <p className="text-xs text-muted-foreground">perda por semana</p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="text-center pt-2">
                        <div className="text-sm text-primary font-semibold">
                          ✓ Selecionado
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Botão Gerar Cardápio - só aparece quando uma categoria está selecionada */}
          {selectedCategory && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleGenerateMenu}
                className="bg-primary hover:bg-primary/90 text-lg font-semibold px-8 py-3"
                size="lg"
                data-testid="button-generate-menu"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Gerar Cardápio - {selectedCategory.category.charAt(0).toUpperCase() + selectedCategory.category.slice(1)}
              </Button>
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="bg-background/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-left">
                <p className="text-sm text-muted-foreground">
                  <strong>Percentual de Gordura:</strong> Calculado pelo método oficial da Marinha dos EUA
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Gasto Energético:</strong> Calculado pela fórmula Mifflin-St Jeor, considerando seu nível de atividade física
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Recomendações:</strong> Baseadas em déficits calóricos seguros. Consulte um profissional antes de iniciar qualquer dieta restritiva.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGoToDashboard}
            variant="outline"
            className="flex-1 py-3 text-lg font-semibold"
            size="lg"
            data-testid="button-dashboard"
          >
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Button>
          <Button
            onClick={onRecalculate}
            className="flex-1 py-3 text-lg font-semibold"
            size="lg"
            data-testid="button-recalculate"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Refazer cálculo
          </Button>
        </div>
      </div>
    </div>
  );
}