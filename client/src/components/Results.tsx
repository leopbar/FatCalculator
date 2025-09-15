import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RotateCcw, Info, Flame, Target } from "lucide-react";

interface ResultsProps {
  bodyFatPercentage: number;
  tmb: number;
  category: string;
  categoryColor: 'success' | 'warning' | 'destructive';
  onRecalculate: () => void;
}

export default function Results({ bodyFatPercentage, tmb, category, categoryColor, onRecalculate }: ResultsProps) {
  const getCategoryVariant = (color: string) => {
    switch (color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'destructive': return 'destructive';
      default: return 'default';
    }
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
          
          <div className="grid gap-4 md:grid-cols-3">
            {weightLossRecommendations.map((rec, index) => (
              <Card key={rec.category} className="border-primary/20 bg-accent/30" data-testid={`card-weight-loss-${rec.category.toLowerCase()}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="text-center">
                    <Badge 
                      variant={rec.intensity === 'low' ? 'default' : rec.intensity === 'medium' ? 'secondary' : 'outline'}
                      className="text-sm px-3 py-1"
                    >
                      {rec.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary" data-testid={`text-calories-${rec.category.toLowerCase()}`}>
                        {rec.dailyCalories.toLocaleString('pt-BR')}
                      </div>
                      <p className="text-xs text-muted-foreground">calorias por dia</p>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-foreground" data-testid={`text-weight-loss-${rec.category.toLowerCase()}`}>
                        ~{rec.weeklyWeightLoss} kg
                      </div>
                      <p className="text-xs text-muted-foreground">perda por semana</p>
                    </div>
                  </div>
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

        {/* Recalculate Button */}
        <Button
          onClick={onRecalculate}
          className="w-full py-3 text-lg font-semibold"
          size="lg"
          data-testid="button-recalculate"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Refazer cálculo
        </Button>
      </div>
    </div>
  );
}