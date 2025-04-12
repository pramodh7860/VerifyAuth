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
import { UserPlus } from "lucide-react";

// Define form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const success = await register({
        username: data.username,
        email: data.email,
        passwordHash: data.password, // Server will hash it
      });

      if (success) {
        setLocation("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm bg-background/80">
      <CardHeader className="space-y-1 flex flex-row items-center gap-3">
        <div className="w-12 h-12">
          <FloatingIcon icon={<UserPlus size={24} />} color="text-cyan-500" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Register to access the DID system</CardDescription>
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
                      placeholder="Choose a username" 
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
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
                      placeholder="Create a password" 
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Confirm your password" 
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
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <Separator className="my-2 bg-cyan-500/20" />

      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a 
            href="/login" 
            className="text-cyan-500 hover:text-cyan-400"
            onClick={(e) => {
              e.preventDefault();
              setLocation("/login");
            }}
          >
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}