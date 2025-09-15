import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Info } from "lucide-react";

interface ResultDisplayProps {
  bodyFatPercentage: number;
  category: string;
  categoryColor: 'success' | 'warning' | 'destructive';
}

export default function ResultDisplay({ bodyFatPercentage, category, categoryColor }: ResultDisplayProps) {
  const getCategoryVariant = (color: string) => {
    switch (color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'destructive': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Card className="border-primary/20 bg-accent/30" data-testid="card-result">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Resultado</h3>
        </div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-percentage">
            {bodyFatPercentage.toFixed(1)}%
          </div>
          <Badge variant={getCategoryVariant(categoryColor)} data-testid="badge-category">
            {category}
          </Badge>
        </div>

        <div className="bg-background/50 rounded-lg p-4 space-y-2">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground text-left">
              Este resultado foi calculado usando o método oficial da Marinha dos EUA, 
              amplamente reconhecido por sua precisão e confiabilidade.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}