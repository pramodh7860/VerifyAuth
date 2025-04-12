import { useState } from "react";
import { useWeb3 } from "@/contexts/web3-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { getIdentityCID } from "@/lib/web3";
import { getFromIPFS, getIPFSUrl } from "@/lib/ipfs";
import { IdentityData } from "@shared/schema";

const verificationSchema = z.object({
  address: z.string()
    .min(1, "Ethereum address is required")
    .refine(
      (val) => ethers.isAddress(val),
      { message: "Invalid Ethereum address format" }
    ),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

type VerificationStatus = "idle" | "loading" | "success" | "error";

export default function VerificationForm() {
  const { provider } = useWeb3();
  const { toast } = useToast();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);
  const [cid, setCid] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      address: "",
    },
  });

  const resetVerification = () => {
    setStatus("idle");
    setIdentityData(null);
    setCid(null);
    setErrorMessage(null);
  };

  const onSubmit = async ({ address }: VerificationFormValues) => {
    if (!provider) {
      toast({
        title: "Provider Not Available",
        description: "Web3 provider is not available. Please ensure MetaMask is installed.",
        variant: "destructive",
      });
      return;
    }

    try {
      setStatus("loading");
      setIdentityData(null);
      setCid(null);
      setErrorMessage(null);

      // Get CID from smart contract
      const cid = await getIdentityCID(provider, address);
      
      if (!cid) {
        setStatus("error");
        setErrorMessage("No identity found for this address");
        return;
      }
      
      // Get identity data from IPFS
      const data = await getFromIPFS(cid);
      
      setCid(cid);
      setIdentityData(data);
      setStatus("success");
    } catch (error: any) {
      console.error("Verification error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to verify identity");
      
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred during verification.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-surface-300">
          Enter an Ethereum wallet address to verify the identity associated with it. 
          The system will retrieve the identity data from IPFS using the CID stored in the smart contract.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ethereum Address</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      className="bg-surface-700 border-surface-600 text-white font-mono text-sm flex-1"
                      {...field}
                    />
                  </FormControl>
                  <Button 
                    type="submit" 
                    className="ml-3 bg-primary-600 hover:bg-primary-700"
                    disabled={status === "loading"}
                  >
                    <i className="fas fa-search mr-2"></i>
                    Verify
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Loading State */}
      {status === "loading" && (
        <div className="mt-8 text-center py-12">
          <div className="animate-spin text-3xl text-primary-500 mb-4">
            <i className="fas fa-circle-notch"></i>
          </div>
          <p className="text-surface-300">
            Retrieving identity data from the blockchain and IPFS...
          </p>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="mt-8 bg-surface-700 rounded-md p-4 border border-error-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-error-500"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error-500">Verification Failed</h3>
              <div className="mt-2 text-sm text-surface-300">
                <p>{errorMessage || "No identity found for this address or there was an error retrieving the data."}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {status === "success" && identityData && (
        <div className="mt-8">
          <div className="bg-surface-700 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <i className="fas fa-check-circle text-success-500"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Verified Identity Found</h3>
                <div className="mt-2 text-sm text-surface-300">
                  <p>This identity is stored on IPFS and verified through Ethereum smart contracts</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-700 rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-surface-600 text-sm font-medium text-white">
              Identity Information
            </div>
            <div className="p-4 border-t border-surface-600">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-surface-400">Full Name</dt>
                  <dd className="mt-1 text-sm text-white">{identityData.fullName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-surface-400">Age</dt>
                  <dd className="mt-1 text-sm text-white">{identityData.age}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-surface-400">College ID</dt>
                  <dd className="mt-1 text-sm text-white">{identityData.collegeId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-surface-400">Additional Information</dt>
                  <dd className="mt-1 text-sm text-white">{identityData.additionalInfo || "None provided"}</dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-3 bg-surface-600 border-t border-surface-700 text-sm">
              <div className="flex justify-between items-center flex-wrap">
                <div className="mr-2 mb-1">
                  <span className="font-medium text-surface-300">IPFS CID:</span>
                  <code className="ml-2 font-mono text-xs text-surface-200 break-all">{cid}</code>
                </div>
                <a 
                  href={cid ? getIPFSUrl(cid) : "#"} 
                  className="text-primary-400 hover:text-primary-300 flex items-center text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View on IPFS</span>
                  <i className="fas fa-external-link text-xs ml-1"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              className="border-surface-500 text-surface-200 bg-transparent hover:bg-surface-700"
              onClick={resetVerification}
            >
              Verify Another Address
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
