import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Calculator, TrendingUp, Utensils, User, Play, Target, BookOpen, Pill, Brain, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface UserSummary {
  hasMetrics: boolean;
  hasCalculation: boolean;
  hasMenu: boolean;
}

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Ofuscated admin verification
const checkSpecialAccess = (email: string | undefined): boolean => {
  if (!email) return false;
  const encoded = btoa(email.toLowerCase().trim());
  return encoded === "bGJhcnJldHRpQGdtYWlsLmNvbQ==";
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, logoutMutation, registerMutation } = useAuth();
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const onRegister = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        registerForm.reset();
        setShowRegisterForm(false);
      },
    });
  };

  const isSpecialUser = user ? checkSpecialAccess(user.email) : false;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirigiendo...</p>
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
                ¡Hola, {user.username}!
              </h1>
              <p className="text-muted-foreground">
                Bienvenido al SRC - Sistema de Reequilibrio Corporal
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            data-testid="button-logout"
          >
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Recursos Adicionales */}
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Comience Aquí */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <Play className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Comience Aquí</CardTitle>
                <CardDescription>
                  Guía completa para iniciar su transformación corporal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            {/* Orientación Alimentaria */}
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="text-center">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Orientación Alimentaria</CardTitle>
                <CardDescription>
                  Fundamentos de una alimentación saludable y equilibrada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            {/* Estrategias Alimentarias */}
            <Card 
              className="hover-elevate cursor-pointer" 
              onClick={() => navigate("/food-strategies")}
            >
              <CardHeader className="text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Estrategias Alimentarias</CardTitle>
                <CardDescription>
                  Técnicas avanzadas para optimizar su dieta y resultados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="default">
                  Iniciar Guía Alimentaria
                </Button>
              </CardContent>
            </Card>

            {/* Libro de Recetas */}
            <Card 
              className="hover-elevate cursor-pointer" 
              onClick={() => navigate("/recipe-book")}
            >
              <CardHeader className="text-center">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>De regalo – Libro de recetas</CardTitle>
                <CardDescription>
                  Recetas sabrosas y nutritivas para todos los momentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="default">
                  Ver Recetas
                </Button>
              </CardContent>
            </Card>

            {/* Suplementación sin Secretos */}
            <Card 
              className="hover-elevate cursor-pointer" 
              onClick={() => navigate("/supplementation")}
            >
              <CardHeader className="text-center">
                <Pill className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Suplementación sin Secretos</CardTitle>
                <CardDescription>
                  Guía completa sobre suplementos: lo que realmente funciona
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="default">
                  Ver Guía de Suplementos
                </Button>
              </CardContent>
            </Card>

            {/* Fortaleciendo su Mente */}
            <Card 
              className="hover-elevate cursor-pointer" 
              onClick={() => navigate("/mind-strengthening")}
            >
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Fortaleciendo su Mente</CardTitle>
                <CardDescription>
                  Estrategias psicológicas para mantener la motivación y disciplina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="default">
                  Iniciar Guía Mental
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Admin Tools - Only visible to special user */}
        {isSpecialUser && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Configuración del Sistema</h2>
            <div className="grid gap-6 md:grid-cols-1 max-w-md">
              <Card className="hover-elevate cursor-pointer">
                <CardHeader className="text-center">
                  <Settings className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>
                    Crear nuevas cuentas de usuario para el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showRegisterForm ? (
                    <Button 
                      className="w-full" 
                      onClick={() => setShowRegisterForm(true)}
                    >
                      Crear Nuevo Usuario
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Ingrese nombre completo"
                                    autoComplete="name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Ingrese email"
                                    autoComplete="email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Cree una contraseña segura"
                                    autoComplete="new-password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar Contraseña</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Confirme su contraseña"
                                    autoComplete="new-password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              className="flex-1"
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? "Creando..." : "Crear Usuario"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setShowRegisterForm(false);
                                registerForm.reset();
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Herramientas */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Herramientas</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Calculadora de Grasa */}
            <Card className="hover-elevate cursor-pointer" onClick={handleCalculatorClick}>
              <CardHeader className="text-center">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle data-testid="card-title-calculator">
                  Calculadora de Grasa
                </CardTitle>
                <CardDescription>
                  {summary?.hasMetrics
                    ? "Recalcular las medidas corporales"
                    : "Calcular porcentaje de grasa corporal"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant={summary?.hasMetrics ? "secondary" : "default"}
                  data-testid="button-calculator"
                >
                  {summary?.hasMetrics ? "Recalcular" : "Comenzar"}
                </Button>
              </CardContent>
            </Card>

            {/* Resultados TMB/TDEE */}
            <Card className="hover-elevate cursor-pointer" onClick={handleResultsClick}>
              <CardHeader className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle data-testid="card-title-results">
                  Tasa Metabólica
                </CardTitle>
                <CardDescription>
                  {summary?.hasCalculation
                    ? "Ver sus resultados de TMB y TDEE"
                    : "Aún no hay cálculos disponibles"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  variant={summary?.hasCalculation ? "default" : "outline"}
                  disabled={!summary?.hasCalculation && !isLoading}
                  data-testid="button-results"
                >
                  {summary?.hasCalculation ? "Ver Resultados" : "Calcular Primero"}
                </Button>
              </CardContent>
            </Card>

            {/* Mi Menú */}
            <Card className="hover-elevate cursor-pointer" onClick={() => {
              if (summary?.hasMenu) {
                navigate("/macro-distribution");
              }
            }}>
              <CardHeader className="text-center">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle data-testid="card-title-menu">
                  Mi Menú
                </CardTitle>
                <CardDescription>
                  {summary?.hasMenu
                    ? "Acceder a su menú personalizado"
                    : "Genere primero su menú personalizado"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  variant={summary?.hasMenu ? "default" : "outline"}
                  disabled={!summary?.hasMenu && !isLoading}
                  data-testid="button-menu"
                >
                  {summary?.hasMenu ? "Ver Mi Menú" : "Generar Primero"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Status Summary */}
        {!isLoading && summary && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2" data-testid="text-status-title">
              Estado de sus datos:
            </h3>
            <div className="flex gap-4 text-sm">
              <span className={`${summary.hasMetrics ? 'text-green-600' : 'text-muted-foreground'}`}>
                ✓ Medidas corporales: {summary.hasMetrics ? 'Guardadas' : 'Pendiente'}
              </span>
              <span className={`${summary.hasCalculation ? 'text-green-600' : 'text-muted-foreground'}`}>
                ✓ Cálculos: {summary.hasCalculation ? 'Completado' : 'Pendiente'}
              </span>
              <span className={`${summary.hasMenu ? 'text-green-600' : 'text-muted-foreground'}`}>
                ✓ Menú: {summary.hasMenu ? 'Generado' : 'Pendiente'}
              </span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">Cargando sus datos...</p>
          </div>
        )}
      </main>
    </div>
  );
}