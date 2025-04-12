import { useState } from "react";
import { useWeb3 } from "@/contexts/web3-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { identityDataSchema, type IdentityData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { uploadToIPFS } from "@/lib/ipfs";
import { registerIdentity } from "@/lib/web3";

type TransactionStatus = "idle" | "pending" | "success" | "error";

export default function RegistrationForm() {
  const { isConnected, address, signer } = useWeb3();
  const { toast } = useToast();
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  const form = useForm<IdentityData>({
    resolver: zodResolver(identityDataSchema),
    defaultValues: {
      fullName: "",
      age: undefined,
      collegeId: "",
      additionalInfo: "",
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const onSubmit = async (data: IdentityData) => {
    if (!isConnected || !signer || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first to register your identity.",
        variant: "destructive",
      });
      return;
    }

    try {
      setTxStatus("pending");
      
      // Upload to IPFS
      const cid = await uploadToIPFS(data);
      
      // Register on blockchain
      const receipt = await registerIdentity(signer, cid);
      
      // Save to backend for redundancy
      await apiRequest("POST", "/api/identities", {
        walletAddress: address,
        ipfsCid: cid,
      });
      
      // Update UI
      setTxHash(receipt.hash);
      setTxStatus("success");
      
      toast({
        title: "Registration Successful",
        description: "Your identity has been registered on the blockchain.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      setTxStatus("error");
      
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
        {!isConnected ? (
          <div className="wallet-not-connected text-center py-8">
            <div className="text-6xl text-surface-500 mb-4">
              <i className="fas fa-wallet"></i>
            </div>
            <h3 className="text-xl font-medium mb-3">Connect Your Wallet to Register</h3>
            <p className="text-surface-400 mb-6">
              You need to connect your MetaMask wallet first to register your identity on the blockchain
            </p>
          </div>
        ) : (
          <div className="wallet-connected space-y-6">
            <div className="bg-surface-700 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-circle-info text-primary-400"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Connected with MetaMask</h3>
                  <div className="mt-2 text-sm text-surface-300">
                    <p>Your identity data will be linked to your Ethereum address:</p>
                    <code className="block mt-1 bg-surface-800 p-2 rounded text-xs font-mono">
                      {address}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="bg-surface-700 border-surface-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        placeholder="25"
                        className="bg-surface-700 border-surface-600 text-white"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="collegeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="COLLEGE-12345"
                      className="bg-surface-700 border-surface-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about yourself"
                      className="bg-surface-700 border-surface-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                className="border-surface-500 text-surface-200 hover:bg-surface-700"
                onClick={resetForm}
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-700"
                disabled={txStatus === "pending"}
              >
                <i className="fas fa-upload mr-2"></i>
                Register on Blockchain
              </Button>
            </div>

            {/* Transaction Status */}
            {txStatus !== "idle" && (
              <div id="tx-status" className="mt-4 p-4 rounded-md bg-surface-700">
                {txStatus === "pending" && (
                  <div className="flex items-center">
                    <div className="animate-spin mr-3 text-primary-500">
                      <i className="fas fa-circle-notch"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Transaction in Progress</h4>
                      <p className="text-sm text-surface-300">
                        Your identity is being registered on the blockchain. Please wait...
                      </p>
                    </div>
                  </div>
                )}
                
                {txStatus === "success" && (
                  <div className="flex items-center">
                    <div className="text-success-500 mr-3">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Registration Successful</h4>
                      <p className="text-sm text-surface-300">
                        Your identity has been successfully registered!
                      </p>
                      {txHash && (
                        <div className="mt-2">
                          <a 
                            href={`https://etherscan.io/tx/${txHash}`} 
                            className="text-primary-400 hover:text-primary-300 text-sm flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>View on Etherscan</span>
                            <i className="fas fa-external-link text-xs ml-1"></i>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {txStatus === "error" && (
                  <div className="flex items-center">
                    <div className="text-error-500 mr-3">
                      <i className="fas fa-times-circle"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Transaction Failed</h4>
                      <p className="text-sm text-surface-300">
                        There was an error registering your identity. Please try again.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
