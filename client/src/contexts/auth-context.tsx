import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define types for user state
interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Login and Register form data types
interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  passwordHash: string; // This will be the password before it's hashed on the server
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => false,
  logout: async () => false,
  register: async () => false,
});

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Query to get the current user
  const { data, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["/api/users/me"],
    queryFn: async () => {
      try {
        const userData = await apiRequest<User>("/api/users/me", {
          method: "GET",
        });
        return userData;
      } catch (error) {
        // If not authenticated, return null
        if ((error as any)?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false, // Don't retry if the user is not authenticated
  });

  // Update user state when data changes
  useEffect(() => {
    setUser(data || null);
  }, [data]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (formData: LoginFormData) => {
      return await apiRequest<{ message: string; user: User }>("/api/users/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest<{ message: string }>("/api/users/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      return await apiRequest<User>("/api/users/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Username may already exist",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const login = async (formData: LoginFormData): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync(formData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await logoutMutation.mutateAsync();
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (formData: RegisterFormData): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync(formData);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Provide the auth context
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}