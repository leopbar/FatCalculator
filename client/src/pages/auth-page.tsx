import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Calculator } from "lucide-react";
import { LoginForm } from "@/components/ui/LoginForm";
import { RegisterForm } from "@/components/ui/RegisterForm";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already authenticated using useEffect to avoid side effects during render
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Show loading state while redirecting - but AFTER all hooks are called
  if (user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Redirigiendo...</p>
    </div>;
  }

  const onLogin = (data: { email: string; password: string }) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const onRegister = (data: { email: string; name?: string; password: string }) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Login/Register Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Acceso Autorizado</h1>
                <p className="text-muted-foreground mt-2">
                  Ingrese sus credenciales para acceder a la calculadora
                </p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-testid="tab-login">Iniciar sesión</TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm
                    onSubmit={onLogin}
                    isLoading={loginMutation.isPending}
                  />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterForm
                    onSubmit={onRegister}
                    isLoading={registerMutation.isPending}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Hero Section */}
          <div className="flex items-center justify-center lg:border-l lg:pl-8">
            <div className="text-center lg:text-left max-w-lg">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <Calculator className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Calculadora de Grasa Corporal
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Sistema completo para cálculo de grasa corporal usando el método oficial de la
                Marina de los EE.UU., con recomendaciones personalizadas de menús basadas en
                estándares internacionales de nutrición.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Cálculo preciso de porcentaje de grasa corporal</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Tasa metabólica basal (TDEE) personalizada</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Menús con 5 comidas balanceadas</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Basado en datos nutricionales USDA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}