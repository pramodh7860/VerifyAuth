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
  import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS || 
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local hardhat default

// Get contract instance
export function getIdentityRegistryContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    IDENTITY_REGISTRY_ADDRESS,
    IDENTITY_REGISTRY_ABI,
    signerOrProvider
  );
}

// Register identity with the smart contract
export async function registerIdentity(signer: ethers.JsonRpcSigner, ipfsCid: string) {
  try {
    const contract = getIdentityRegistryContract(signer);
    const tx = await contract.registerIdentity(ipfsCid);
    return await tx.wait();
  } catch (error) {
    console.error("Error registering identity:", error);
    throw error;
  }
}

// Get identity CID from the smart contract
export async function getIdentityCID(provider: ethers.Provider, address: string) {
  try {
    const contract = getIdentityRegistryContract(provider);
    return await contract.getIdentityCID(address);
  } catch (error) {
    console.error("Error getting identity CID:", error);
    throw error;
  }
}

// Check if an address has registered an identity
export async function hasIdentity(provider: ethers.Provider, address: string) {
  try {
    const contract = getIdentityRegistryContract(provider);
    return await contract.hasIdentity(address);
  } catch (error) {
    console.error("Error checking identity existence:", error);
    throw error;
  }
}

// Update identity in the smart contract
export async function updateIdentity(signer: ethers.JsonRpcSigner, ipfsCid: string) {
  try {
    const contract = getIdentityRegistryContract(signer);
    const tx = await contract.updateIdentity(ipfsCid);
    return await tx.wait();
  } catch (error) {
    console.error("Error updating identity:", error);
    throw error;
  }
}
