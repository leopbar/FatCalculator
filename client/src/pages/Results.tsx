import { useLocation } from "wouter";
import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
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

  // Mutation to clear all user data
  const clearDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/clear-data', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to clear data');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache after clearing data
      queryClient.invalidateQueries({ queryKey: ['/api/calculation'] });
      queryClient.invalidateQueries({ queryKey: ['/api/body-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/me/summary'] });
      
      toast({
        title: "Datos borrados con éxito!",
        description: "",
      });
      
      navigate('/calculator');
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao limpar dados",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  });

  const handleRecalculate = () => {
    clearDataMutation.mutate();
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
      tmb={calculation.tdee}
      category={calculation.category}
      categoryColor={categoryColor}
      onRecalculate={handleRecalculate}
    />
  );
}