import { create } from 'ipfs-http-client';
import { IdentityData } from '@shared/schema';

// If we have an IPFS API key, we'll use it
const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID || '';
const projectSecret = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET || '';

const auth = projectId && projectSecret 
  ? 'Basic ' + btoa(projectId + ':' + projectSecret) 
  : '';

// Create IPFS client with Infura or use public gateway
const ipfsClient = projectId && projectSecret 
  ? create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    })
  : create({
      host: 'ipfs.io',
      port: 443,
      protocol: 'https'
    });

// Upload data to IPFS
export async function uploadToIPFS(data: IdentityData): Promise<string> {
  try {
    const jsonData = JSON.stringify(data);
    const { cid } = await ipfsClient.add(jsonData);
    return cid.toString();
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload data to IPFS');
  }
}

// Get data from IPFS
export async function getFromIPFS(cid: string): Promise<IdentityData> {
  try {
    // First try to get it from the backend
    const response = await fetch(`/api/ipfs/${cid}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    // If that fails, try a public gateway
    const chunks = [];
    for await (const chunk of ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks).toString();
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting data from IPFS:', error);
    throw new Error('Failed to retrieve data from IPFS');
  }
}

// Get IPFS gateway URL for a CID
export function getIPFSUrl(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`;
}
