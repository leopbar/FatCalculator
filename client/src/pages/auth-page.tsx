
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Calculator } from "lucide-react";
import { LoginForm } from "@/components/ui/LoginForm";
import { RegisterForm } from "@/components/ui/RegisterForm";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirecionamento reativo quando o usuário for autenticado
  useEffect(() => {
    if (user && !loginMutation.isPending && !registerMutation.isPending) {
      console.log("User authenticated, redirecting to dashboard...");
      navigate("/dashboard");
    }
  }, [user, navigate, loginMutation.isPending, registerMutation.isPending]);

  // Se o usuário já está autenticado, mostrar estado de carregamento
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  const onLogin = (data: { email: string; password: string }) => {
    console.log("Initiating login...");
    loginMutation.mutate(data);
  };

  const onRegister = (data: { email: string; name?: string; password: string }) => {
    console.log("Initiating registration...");
    registerMutation.mutate(data);
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

          {/* Calculator Preview */}
          <div className="flex items-center justify-center bg-muted/30 rounded-lg p-8">
            <div className="text-center">
              <Calculator className="h-24 w-24 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Calculadora de Grasa Corporal
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Herramienta precisa para calcular tu porcentaje de grasa corporal,
                tasa metabólica basal (TMB) y gasto energético total (TDEE).
                Obtén resultados personalizados y recomendaciones nutricionales.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-primary">95%</div>
                  <div className="text-muted-foreground">Precisión</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">7</div>
                  <div className="text-muted-foreground">Medidas</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">30s</div>
                  <div className="text-muted-foreground">Tiempo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
