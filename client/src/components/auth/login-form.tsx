import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FloatingIcon from "../floating-icon";
import { KeyRound } from "lucide-react";

// Define form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await login({
        username: data.username,
        password: data.password,
      });

      if (success) {
        setLocation("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm bg-background/80">
      <CardHeader className="space-y-1 flex flex-row items-center gap-3">
        <div className="w-12 h-12">
          <FloatingIcon icon={<KeyRound size={24} />} color="text-cyan-500" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your username" 
                      {...field} 
                      className="border-cyan-700/30 focus:border-cyan-500 bg-background/50" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                      className="border-cyan-700/30 focus:border-cyan-500 bg-background/50" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full glow-effect bg-cyan-700 hover:bg-cyan-600"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <Separator className="my-2 bg-cyan-500/20" />

      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a 
            href="/register" 
            className="text-cyan-500 hover:text-cyan-400"
            onClick={(e) => {
              e.preventDefault();
              setLocation("/register");
            }}
          >
            Register
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}