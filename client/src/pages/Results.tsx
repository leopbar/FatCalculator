import { useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Results from "@/components/Results";

interface ResultData {
  bodyFatPercentage: number;
  tmb: number;
  category: string;
  categoryColor: 'success' | 'warning' | 'destructive';
}

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Get result data from localStorage
  const resultData = localStorage.getItem('bodyFatResult');
  let parsedResult: ResultData | null = null;
  
  try {
    parsedResult = resultData ? JSON.parse(resultData) : null;
    
    // Validate the parsed result
    if (parsedResult && (
      typeof parsedResult.bodyFatPercentage !== 'number' ||
      !isFinite(parsedResult.bodyFatPercentage) ||
      isNaN(parsedResult.bodyFatPercentage) ||
      typeof parsedResult.tmb !== 'number' ||
      !isFinite(parsedResult.tmb) ||
      isNaN(parsedResult.tmb) ||
      !parsedResult.category ||
      !parsedResult.categoryColor
    )) {
      parsedResult = null;
    }
  } catch (error) {
    parsedResult = null;
  }

  // Redirect to home if no valid result data
  useEffect(() => {
    if (!parsedResult) {
      toast({
        title: "Erro nos dados",
        description: "Dados de resultado inválidos. Redirecionando para o formulário.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [parsedResult, navigate, toast]);

  const handleRecalculate = () => {
    // Clear all stored data and redirect to home
    localStorage.removeItem('bodyFatResult');
    localStorage.removeItem('formData');
    navigate('/');
  };

  if (!parsedResult) {
    return null; // Will redirect to home
  }

  return (
    <Results
      bodyFatPercentage={parsedResult.bodyFatPercentage}
      tmb={parsedResult.tmb}
      category={parsedResult.category}
      categoryColor={parsedResult.categoryColor}
      onRecalculate={handleRecalculate}
    />
  );
}