
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, User, Menu, Brain, BarChart3, Utensils, LogOut, Loader2 } from "lucide-react";

interface UserSummary {
  hasMetrics: boolean;
  hasCalculation: boolean;
  hasMenu: boolean;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, logoutMutation, isLoading } = useAuth();

  // Fetch user summary to determine navigation
  const { data: summary, isLoading: summaryLoading } = useQuery<UserSummary>({
    queryKey: ['/api/me/summary'],
    enabled: !!user,
  });

  // Redirecionamento reativo se não autenticado
  useEffect(() => {
    console.log("Dashboard useEffect triggered", { user, isLoading });
    
    if (!isLoading && !user) {
      console.log("User is not authenticated, navigating to auth...");
      navigate("/auth", { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário autenticado, mostrar estado de redirecionamento
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Redirigiendo a la página de login...</p>
        </div>
      </div>
    );
  }

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

  const handleLogout = () => {
    console.log("Logout button clicked");
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                ¡Hola, {user.name || user.email}!
              </h1>
              <p className="text-muted-foreground">
                Bienvenido a tu calculadora de grasa corporal
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
            className="flex items-center gap-2"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {logoutMutation.isPending ? "Cerrando..." : "Cerrar sesión"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Calculadora Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCalculatorClick}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Calculator className="h-8 w-8 text-primary" />
                {summary?.hasCalculation && <Badge variant="secondary">Completado</Badge>}
              </div>
              <CardTitle className="text-lg">Calculadora</CardTitle>
              <CardDescription>
                {summary?.hasCalculation ? "Ver último cálculo" : "Calcular grasa corporal"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {summary?.hasCalculation
                  ? "Revisa tus resultados o realiza un nuevo cálculo"
                  : "Ingresa tus medidas corporales para obtener tu porcentaje de grasa"
                }
              </p>
            </CardContent>
          </Card>

          {/* Resultados Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleResultsClick}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-8 w-8 text-primary" />
                {summary?.hasCalculation && <Badge variant="secondary">Disponible</Badge>}
              </div>
              <CardTitle className="text-lg">Mis Resultados</CardTitle>
              <CardDescription>
                {summary?.hasCalculation ? "Ver análisis completo" : "Calcula primero"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {summary?.hasCalculation
                  ? "Análisis detallado de tu composición corporal y recomendaciones"
                  : "Primero debes realizar el cálculo para ver tus resultados"
                }
              </p>
            </CardContent>
          </Card>

          {/* Menú Nutricional Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleMenuClick}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Utensils className="h-8 w-8 text-primary" />
                {summary?.hasMenu && <Badge variant="secondary">Generado</Badge>}
              </div>
              <CardTitle className="text-lg">Menú Nutricional</CardTitle>
              <CardDescription>
                {summary?.hasMenu ? "Ver menú personalizado" : "Generar menú"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {summary?.hasMenu
                  ? "Menú personalizado basado en tus objetivos nutricionales"
                  : "Obtén un menú personalizado basado en tu cálculo de grasa corporal"
                }
              </p>
            </CardContent>
          </Card>

          {/* Fortalecimiento Mental Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/mind-strengthening")}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Brain className="h-8 w-8 text-primary" />
                <Badge variant="outline">Nuevo</Badge>
              </div>
              <CardTitle className="text-lg">Fortalecimiento Mental</CardTitle>
              <CardDescription>
                Ejercicios de mindfulness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Técnicas de respiración, meditación y ejercicios mentales para complementar tu bienestar físico
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        {!summaryLoading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {summary?.hasCalculation ? "✓" : "○"}
                  </p>
                  <p className="text-sm text-muted-foreground">Cálculo Realizado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {summary?.hasMenu ? "✓" : "○"}
                  </p>
                  <p className="text-sm text-muted-foreground">Menú Generado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-sm text-muted-foreground">Perfil Completo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
