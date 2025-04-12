import { useWeb3 } from "@/contexts/web3-context";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function WalletConnect() {
  // Use try-catch to safely access the Web3Context
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Check if MetaMask is available
    setIsMetaMaskAvailable(typeof window !== "undefined" && !!window.ethereum);
  }, []);

  // Only use the Web3 context if it's available
  const web3Context = useWeb3();
  const { isConnected, address, connectWallet, disconnectWallet } = web3Context;

  const handleConnect = async () => {
    if (connectWallet) {
      await connectWallet();
    }
  };

  const handleDisconnect = () => {
    if (disconnectWallet) {
      disconnectWallet();
    }
  };

  if (!isMetaMaskAvailable) {
    return (
      <div id="wallet-status" className="flex items-center">
        <Button 
          disabled
          className="inline-flex items-center bg-surface-700 text-surface-300"
        >
          <i className="fa-solid fa-wallet mr-2"></i>
          MetaMask Not Found
        </Button>
      </div>
    );
  }

  return (
    <div id="wallet-status" className="flex items-center">
      {!isConnected ? (
        <Button 
          onClick={handleConnect} 
          className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white"
        >
          <i className="fa-solid fa-wallet mr-2"></i>
          Connect Wallet
        </Button>
      ) : (
        <div className="wallet-connected">
          <div className="flex items-center bg-surface-700 rounded-md px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-success-500 mr-2"></div>
            <span className="font-mono text-xs truncate max-w-[120px]">
              {address && `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
            </span>
            <button 
              onClick={handleDisconnect}
              className="ml-3 text-surface-400 hover:text-surface-300 transition-colors"
            >
              <i className="fa-solid fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
