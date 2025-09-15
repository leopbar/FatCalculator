import { useLocation } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import Results from "@/components/Results";

interface CalculationData {
  bodyFatPercent: number;
  category: string;
  bmr: number;
  tdee: number;
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch calculation data from server
  const { data: calculation, isLoading, error } = useQuery<CalculationData>({
    queryKey: ['/api/calculation'],
    enabled: !!user,
  });

  // Redirect to calculator if no calculation data or user not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isLoading && (!calculation || error)) {
      toast({
        title: "Nenhum cálculo encontrado",
        description: "Realize o cálculo primeiro. Redirecionando...",
        variant: "destructive",
      });
      navigate('/calculator');
    }
  }, [calculation, isLoading, error, user, navigate, toast]);

  const handleRecalculate = () => {
    // Invalidate cache and redirect to calculator
    queryClient.invalidateQueries({ queryKey: ['/api/calculation'] });
    queryClient.invalidateQueries({ queryKey: ['/api/body-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['/api/me/summary'] });
    navigate('/calculator');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando seus resultados...</p>
      </div>
    );
  }

  if (!calculation || error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    );
  }

  // Map category to color based on the original logic
  let categoryColor: 'success' | 'warning' | 'destructive';
  const bodyFatPercentage = calculation.bodyFatPercent;
  
  if (calculation.category === "Essencial") {
    categoryColor = "warning";
  } else if (calculation.category === "Atlético" || calculation.category === "Fitness") {
    categoryColor = "success";
  } else if (calculation.category === "Aceitável") {
    categoryColor = "warning";
  } else {
    categoryColor = "destructive";
  }

  return (
    <Results
      bodyFatPercentage={calculation.bodyFatPercent}
      tmb={calculation.bmr}
      category={calculation.category}
      categoryColor={categoryColor}
      onRecalculate={handleRecalculate}
    />
  );
}