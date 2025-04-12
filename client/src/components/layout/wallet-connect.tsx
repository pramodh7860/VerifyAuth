import { useWeb3 } from "@/contexts/web3-context";
import { Button } from "@/components/ui/button";

export default function WalletConnect() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWeb3();

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

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
