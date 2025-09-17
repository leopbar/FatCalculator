import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Calculator, TrendingUp, UtensilsCrossed, User, Play, Utensils, Target, BookOpen, Pill, Brain } from "lucide-react";

interface UserSummary {
  hasMetrics: boolean;
  hasCalculation: boolean;
  hasMenu: boolean;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Fetch user summary to determine navigation
  const { data: summary, isLoading } = useQuery<UserSummary>({
    queryKey: ['/api/me/summary'],
    enabled: !!user,
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleCalculatorClick = () => {
    if (summary?.hasCalculation) {
      navigate("/results");
    } else {
      navigate("/calculator");
    }
  };

  const handleResultsClick = () => {
    if (summary?.hasCalculation) {
      navigate("/results");
    } else {
      navigate("/calculator");
    }
  };

  const handleMenuClick = () => {
    if (summary?.hasMenu) {
      navigate("/menu");
    } else {
      navigate("/calculator");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Olá, {user.username}!
              </h1>
              <p className="text-muted-foreground">
                Bem-vindo à sua calculadora de gordura corporal
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            data-testid="button-logout"
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Recursos Adicionais */}
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Comece Aqui */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <Play className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Comece Aqui</CardTitle>
                <CardDescription>
                  Guia completo para iniciar sua jornada de transformação corporal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Em Breve
                </Button>
              </CardContent>
            </Card>

            {/* Orientação Alimentar */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Orientação Alimentar</CardTitle>
                <CardDescription>
                  Fundamentos de uma alimentação saudável e equilibrada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Em Breve
                </Button>
              </CardContent>
            </Card>

            {/* Estratégias Alimentares */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Estratégias Alimentares</CardTitle>
                <CardDescription>
                  Técnicas avançadas para otimizar sua dieta e resultados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Em Breve
                </Button>
              </CardContent>
            </Card>

            {/* Ebook de Receitas */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Ebook de Receitas</CardTitle>
                <CardDescription>
                  Receitas saborosas e nutritivas para todos os momentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Em Breve
                </Button>
              </CardContent>
            </Card>

            {/* Suplementação sem Segredo */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <Pill className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Suplementação sem Segredo</CardTitle>
                <CardDescription>
                  Guia completo sobre suplementos: o que funciona de verdade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Em Breve
                </Button>
              </CardContent>
            </Card>

            {/* Blindando sua Mente */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Blindando sua Mente</CardTitle>
                <CardDescription>
                  Estratégias psicológicas para manter a motivação e disciplina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Em Breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Ferramentas */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Ferramentas</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Calculadora de Gordura */}
            <Card className="hover-elevate cursor-pointer" onClick={handleCalculatorClick}>
              <CardHeader className="text-center">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle data-testid="card-title-calculator">
                  Calculadora de Gordura
                </CardTitle>
                <CardDescription>
                  {summary?.hasMetrics
                    ? "Refazer cálculo das medidas corporais"
                    : "Calcular percentual de gordura corporal"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant={summary?.hasMetrics ? "secondary" : "default"}
                  data-testid="button-calculator"
                >
                  {summary?.hasMetrics ? "Recalcular" : "Começar"}
                </Button>
              </CardContent>
            </Card>

            {/* Resultados TMB/TDEE */}
            <Card className="hover-elevate cursor-pointer" onClick={handleResultsClick}>
              <CardHeader className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle data-testid="card-title-results">
                  Taxa Metabólica
                </CardTitle>
                <CardDescription>
                  {summary?.hasCalculation
                    ? "Ver seus resultados de TMB e TDEE"
                    : "Ainda não há cálculos disponíveis"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  variant={summary?.hasCalculation ? "default" : "outline"}
                  disabled={!summary?.hasCalculation && !isLoading}
                  data-testid="button-results"
                >
                  {summary?.hasCalculation ? "Ver Resultados" : "Calcular Primeiro"}
                </Button>
              </CardContent>
            </Card>

            {/* Cardápio Personalizado */}
            <Card className="hover-elevate cursor-pointer" onClick={handleMenuClick}>
              <CardHeader className="text-center">
                <UtensilsCrossed className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle data-testid="card-title-menu">
                  Cardápio Personalizado
                </CardTitle>
                <CardDescription>
                  {summary?.hasMenu
                    ? "Ver seu cardápio personalizado"
                    : "Cardápio baseado nos seus objetivos"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  variant={summary?.hasMenu ? "default" : "outline"}
                  disabled={!summary?.hasMenu && !isLoading}
                  data-testid="button-menu"
                >
                  {summary?.hasMenu ? "Ver Cardápio" : "Calcular Primeiro"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Status Summary */}
        {!isLoading && summary && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2" data-testid="text-status-title">
              Status dos seus dados:
            </h3>
            <div className="flex gap-4 text-sm">
              <span className={`${summary.hasMetrics ? 'text-green-600' : 'text-muted-foreground'}`}>
                ✓ Medidas corporais: {summary.hasMetrics ? 'Salvas' : 'Pendente'}
              </span>
              <span className={`${summary.hasCalculation ? 'text-green-600' : 'text-muted-foreground'}`}>
                ✓ Cálculos: {summary.hasCalculation ? 'Concluído' : 'Pendente'}
              </span>
              <span className={`${summary.hasMenu ? 'text-green-600' : 'text-muted-foreground'}`}>
                ✓ Cardápio: {summary.hasMenu ? 'Gerado' : 'Pendente'}
              </span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">Carregando seus dados...</p>
          </div>
        )}
      </main>
    </div>
  );
}