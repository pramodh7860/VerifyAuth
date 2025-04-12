import LoginForm from "@/components/auth/login-form";
import Background3D from "@/components/3d-background";

export default function Login() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 -z-10">
        <Background3D />
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
}