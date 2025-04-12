import RegistrationForm from "@/components/registration-form";
import { Helmet } from "react-helmet";

export default function Register() {
  return (
    <>
      <Helmet>
        <title>Register Your Identity - DID System</title>
        <meta name="description" content="Register your decentralized identity with MetaMask and IPFS" />
      </Helmet>
      <div className="mb-16">
        <div className="max-w-3xl mx-auto bg-surface-800 rounded-lg shadow-lg border border-surface-700 overflow-hidden">
          <div className="px-6 py-4 bg-surface-700 border-b border-surface-600">
            <h2 className="text-2xl font-bold flex items-center">
              <i className="fas fa-id-card text-primary-500 mr-3"></i>
              Register Your Identity
            </h2>
          </div>
          <RegistrationForm />
        </div>
      </div>
    </>
  );
}
