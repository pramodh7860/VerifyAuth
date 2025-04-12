import LoginForm from "@/components/auth/login-form";
import Background3D from "@/components/3d-background";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Helmet>
        <title>Login - DID System</title>
        <meta name="description" content="Login to the decentralized identity management system" />
      </Helmet>
      
      <div className="absolute inset-0 -z-10">
        <Background3D />
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto bg-gray-900/70 backdrop-blur-sm rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <FontAwesomeIcon icon={faSignInAlt} className="text-cyan-400 text-3xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Login</h1>
            <p className="mt-2 text-gray-300">
              Access your decentralized identity management account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}