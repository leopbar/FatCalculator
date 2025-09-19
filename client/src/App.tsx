
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/lib/protected-route";

// Pages
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import Menu from "@/pages/Menu";
import MindStrengthening from "@/pages/MindStrengthening";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppRoutes() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" nest>
        <ProtectedRoute>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/calculator" component={Home} />
            <Route path="/results" component={Results} />
            <Route path="/menu" component={Menu} />
            <Route path="/mind-strengthening" component={MindStrengthening} />
            <Route component={NotFound} />
          </Switch>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <AppRoutes />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
