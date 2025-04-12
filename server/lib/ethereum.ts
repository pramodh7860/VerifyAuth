import { ethers } from "ethers";

// Contract ABI for the Identity Registry
export const IDENTITY_REGISTRY_ABI = [
  "function registerIdentity(string memory ipfsCid) external",
  "function getIdentityCID(address user) external view returns (string memory)",
  "function updateIdentity(string memory newIpfsCid) external",
  "function hasIdentity(address user) external view returns (bool)",
];

// Get contract address from environment variables with fallback
export const IDENTITY_REGISTRY_ADDRESS = 
  process.env.IDENTITY_REGISTRY_ADDRESS || 
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local hardhat default

// Get Ethereum provider
export function getProvider() {
  const providerUrl = process.env.ETHEREUM_RPC_URL || "http://localhost:8545";
  return new ethers.JsonRpcProvider(providerUrl);
}

// Get contract instance
export function getIdentityRegistryContract(provider: ethers.Provider) {
  return new ethers.Contract(
    IDENTITY_REGISTRY_ADDRESS,
    IDENTITY_REGISTRY_ABI,
    provider
  );
}

// Get identity CID from the smart contract
export async function getIdentityCID(address: string): Promise<string | null> {
  try {
    const provider = getProvider();
    const contract = getIdentityRegistryContract(provider);
    return await contract.getIdentityCID(address);
  } catch (error) {
    console.error("Error getting identity CID:", error);
    return null;
  }
}

// Check if an address has registered an identity
export async function hasIdentity(address: string): Promise<boolean> {
  try {
    const provider = getProvider();
    const contract = getIdentityRegistryContract(provider);
    return await contract.hasIdentity(address);
  } catch (error) {
    console.error("Error checking identity existence:", error);
    return false;
  }
}
