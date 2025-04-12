import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { identityDataSchema, insertIdentitySchema } from "@shared/schema";
import { uploadToIPFS, getFromIPFS } from "./lib/ipfs";
import { getIdentityCID, hasIdentity } from "./lib/ethereum";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for identity management
  app.post("/api/identities", async (req, res) => {
    try {
      const parsedData = insertIdentitySchema.parse(req.body);
      
      // Store identity reference in database
      const identity = await storage.createIdentity(parsedData);
      
      res.status(201).json(identity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid identity data", errors: error.errors });
      } else {
        console.error("Error creating identity:", error);
        res.status(500).json({ message: "Failed to create identity" });
      }
    }
  });

  // Get identity by wallet address
  app.get("/api/identities/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      // First check if identity exists
      const exists = await hasIdentity(address);
      
      if (!exists) {
        return res.status(404).json({ message: "Identity not found" });
      }
      
      // Get CID from blockchain
      const cid = await getIdentityCID(address);
      
      if (!cid) {
        return res.status(404).json({ message: "Identity CID not found" });
      }
      
      // Get identity from database if available
      const storedIdentity = await storage.getIdentityByWalletAddress(address);
      
      res.json({
        walletAddress: address,
        ipfsCid: cid,
        ...(storedIdentity ? { id: storedIdentity.id } : {}),
      });
    } catch (error) {
      console.error("Error fetching identity:", error);
      res.status(500).json({ message: "Failed to fetch identity" });
    }
  });

  // Get identity data from IPFS
  app.get("/api/ipfs/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      
      // Get data from IPFS
      const data = await getFromIPFS(cid);
      
      // Validate data format
      const parsedData = identityDataSchema.parse(data);
      
      res.json(parsedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid identity data format", errors: error.errors });
      } else {
        console.error("Error fetching IPFS data:", error);
        res.status(500).json({ message: "Failed to fetch data from IPFS" });
      }
    }
  });

  // Upload data to IPFS
  app.post("/api/ipfs", async (req, res) => {
    try {
      // Validate data format
      const parsedData = identityDataSchema.parse(req.body);
      
      // Upload to IPFS
      const cid = await uploadToIPFS(parsedData);
      
      res.status(201).json({ cid });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid identity data format", errors: error.errors });
      } else {
        console.error("Error uploading to IPFS:", error);
        res.status(500).json({ message: "Failed to upload data to IPFS" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
