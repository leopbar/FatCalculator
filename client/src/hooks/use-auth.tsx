
// Based on javascript_auth_all_persistance blueprint
import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  name?: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Login mutation starting...");
      const res = await apiRequest("POST", "/api/login", credentials);
      const userData = await res.json();
      console.log("Login successful, user data:", userData);
      return userData;
    },
    onSuccess: (userData: SelectUser) => {
      console.log("Login successful, redirecting...");
      // Atualizar el estado inmediatamente
      queryClient.setQueryData(["/api/user"], userData);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao aplicativo!",
      });
      
      // Redirigir inmediatamente después del login exitoso
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      console.log("Registration mutation starting...");
      const res = await apiRequest("POST", "/api/register", credentials);
      const userData = await res.json();
      console.log("Registration successful, user data:", userData);
      return userData;
    },
    onSuccess: (userData: SelectUser) => {
      console.log("Registration successful, redirecting...");
      // Atualizar el estado inmediatamente
      queryClient.setQueryData(["/api/user"], userData);
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao aplicativo!",
      });
      
      // Redirigir inmediatamente después del registro exitoso
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "Erro no registro",
        description: "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Logout mutation starting...");
      await apiRequest("POST", "/api/logout");
      console.log("Logout successful");
    },
    onSuccess: () => {
      console.log("Logout successful, redirecting...");
      // Limpiar el estado inmediatamente
      queryClient.setQueryData(["/api/user"], null);
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      
      // Redirigir inmediatamente después del logout exitoso
      navigate("/auth");
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
