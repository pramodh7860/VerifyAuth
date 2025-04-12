import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from "@/contexts/web3-context";
import { AuthProvider } from "@/contexts/auth-context";

// Pages
import Home from "@/pages/home";
import Register from "@/pages/register";
import Verify from "@/pages/verify";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/verify" component={Verify} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;