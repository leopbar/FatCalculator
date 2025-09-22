
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import MacroDistribution from "@/components/MacroDistribution";

interface MacroDistributionData {
  dailyCalories: number;
  categoryName: string;
}

export default function MacroDistributionPage() {
  const [, navigate] = useLocation();
  const [macroData, setMacroData] = useState<MacroDistributionData | null>(null);

  useEffect(() => {
    // Get macro distribution data from localStorage
    const storedData = localStorage.getItem('selectedDietCategory');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMacroData({
        dailyCalories: parsedData.dailyCalories,
        categoryName: parsedData.categoryName
      });
    } else {
      // If no data, redirect back to results
      navigate('/results');
    }
  }, [navigate]);

  const handleBack = () => {
    // Go back to results page
    navigate('/results');
  };

  if (!macroData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando distribución de macronutrientes...</p>
      </div>
    );
  }

  return (
    <MacroDistribution
      dailyCalories={macroData.dailyCalories}
      categoryName={macroData.categoryName}
      onBack={handleBack}
    />
  );
}
