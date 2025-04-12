import RegisterForm from "@/components/auth/register-form";
import Background3D from "@/components/3d-background";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Helmet>
        <title>Register - DID System</title>
        <meta name="description" content="Register for the decentralized identity management system" />
      </Helmet>
      
      <div className="absolute inset-0 -z-10">
        <Background3D />
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto bg-gray-900/70 backdrop-blur-sm rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4 border border-blue-500/30 shadow-lg shadow-blue-500/20">
              <FontAwesomeIcon icon={faUserPlus} className="text-blue-400 text-3xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Register</h1>
            <p className="mt-2 text-gray-300">
              Create your account to manage your decentralized identity
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}