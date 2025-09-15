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

const loginSchema = insertUserSchema;
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already authenticated using useEffect to avoid side effects during render
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Show loading state while redirecting
  if (user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>;
  }

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

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
                <h1 className="text-3xl font-bold text-foreground">Acesso Autorizado</h1>
                <p className="text-muted-foreground mt-2">
                  Entre com suas credenciais para acessar a calculadora
                </p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register">Registrar</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fazer Login</CardTitle>
                      <CardDescription>
                        Digite suas credenciais para acessar sua conta
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Usuário</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Digite seu usuário"
                                    data-testid="input-username-login"
                                    autoComplete="username"
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
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Digite sua senha"
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
                            {loginMutation.isPending ? "Entrando..." : "Entrar"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle>Criar Conta</CardTitle>
                      <CardDescription>
                        Crie uma nova conta para acessar a calculadora
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Usuário</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Escolha um nome de usuário"
                                    data-testid="input-username-register"
                                    autoComplete="username"
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
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Crie uma senha segura"
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
                                <FormLabel>Confirmar Senha</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Confirme sua senha"
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
                            {registerMutation.isPending ? "Criando conta..." : "Criar Conta"}
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
                Calculadora de Gordura Corporal
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Sistema completo para cálculo de gordura corporal usando o método oficial da 
                Marinha dos EUA, com recomendações personalizadas de cardápios baseadas em 
                padrões internacionais de nutrição.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Cálculo preciso de percentual de gordura corporal</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Taxa metabólica basal (TDEE) personalizada</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Cardápios com 5 refeições balanceadas</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Baseado em dados nutricionais USDA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}