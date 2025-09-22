import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import { Shield, Calculator } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Always call all hooks first before any conditional logic
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const onRegister = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
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
                <h1 className="text-3xl font-bold text-foreground">SRC - Sistema de Reequilibrio Corporal</h1>
                <p className="text-muted-foreground mt-2">
                  Ingrese sus credenciales para acceder al sistema
                </p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-testid="tab-login">Iniciar sesión</TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle>Iniciar Sesión</CardTitle>
                      <CardDescription>
                        Ingrese sus credenciales para acceder a su cuenta
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Ingrese su email"
                                    data-testid="input-email-login"
                                    autoComplete="email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    data-testid="input-password-login"
                                    autoComplete="current-password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                            data-testid="button-login"
                          >
                            {loginMutation.isPending ? "Ingresando..." : "Ingresar"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle>Crear Cuenta</CardTitle>
                      <CardDescription>
                        Cree una nueva cuenta para acceder a la calculadora
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                    placeholder="Ingrese su nombre completo"
                                    data-testid="input-name-register"
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
                                    placeholder="Ingrese su email"
                                    data-testid="input-email-register"
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
                                    data-testid="input-password-register"
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
                                    data-testid="input-confirm-password"
                                    autoComplete="new-password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                            data-testid="button-register"
                          >
                            {registerMutation.isPending ? "Creando cuenta..." : "Crear Cuenta"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
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
                SRC - Sistema de Reequilibrio Corporal
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