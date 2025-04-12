import VerificationForm from "@/components/verification-form";
import { Helmet } from "react-helmet";

export default function Verify() {
  return (
    <>
      <Helmet>
        <title>Verify Identity - DID System</title>
        <meta name="description" content="Verify decentralized identities using Ethereum addresses" />
      </Helmet>
      <div className="mb-16">
        <div className="max-w-3xl mx-auto bg-surface-800 rounded-lg shadow-lg border border-surface-700 overflow-hidden">
          <div className="px-6 py-4 bg-surface-700 border-b border-surface-600">
            <h2 className="text-2xl font-bold flex items-center">
              <i className="fas fa-search text-primary-500 mr-3"></i>
              Verify an Identity
            </h2>
          </div>
          <VerificationForm />
        </div>
      </div>
    </>
  );
}
