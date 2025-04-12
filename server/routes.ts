import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { identityDataSchema, insertIdentitySchema, insertUserSchema } from "@shared/schema";
import { uploadToIPFS, getFromIPFS } from "./lib/ipfs";
import { getIdentityCID, hasIdentity } from "./lib/ethereum";
import { z } from "zod";
import crypto from "crypto";

// Create a type-safe validation middleware
const validate = <T extends z.ZodType>(schema: T) => (
  req: Request,
  res: Response,
  next: () => void
) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ====== User Authentication Routes ======
  
  // Register a new user
  app.post("/api/users/register", validate(insertUserSchema), async (req, res) => {
    try {
      const { username, email } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Hash the password
      const passwordHash = crypto
        .createHash("sha256")
        .update(req.body.passwordHash)
        .digest("hex");
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        passwordHash
      });
      
      // Don't return the password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Login user
  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      
      if (user.passwordHash !== hashedPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session data
      if (req.session) {
        req.session.userId = user.id;
        req.session.username = user.username;
      }
      
      // Don't return the password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      res.json({
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Logout user
  app.post("/api/users/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err: Error | null) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ message: "Logout successful" });
      });
    } else {
      res.json({ message: "No active session" });
    }
  });
  
  // Get current user
  app.get("/api/users/me", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });
  
  // ====== Identity Management Routes ======
  
  // Create a new identity
  app.post("/api/identities", validate(insertIdentitySchema), async (req, res) => {
    try {
      // Check if user is authenticated
      const userId = req.session?.userId;
      
      // Validate request data
      const parsedData = insertIdentitySchema.parse(req.body);
      
      // Verify that the wallet address doesn't already exist
      const existingIdentity = await storage.getIdentityByWalletAddress(parsedData.walletAddress);
      if (existingIdentity) {
        return res.status(409).json({ message: "Wallet address already registered" });
      }
      
      // Add user ID if available
      const identityData = userId 
        ? { ...parsedData, userId } 
        : parsedData;
      
      // Store identity reference in database
      const identity = await storage.createIdentity(identityData);
      
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

  // Update an existing identity
  app.put("/api/identities/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const { ipfsCid } = req.body;
      
      if (!ipfsCid) {
        return res.status(400).json({ message: "IPFS CID is required" });
      }
      
      // Check if identity exists
      const identity = await storage.getIdentityByWalletAddress(address);
      
      if (!identity) {
        return res.status(404).json({ message: "Identity not found" });
      }
      
      // Update the identity
      const updatedIdentity = await storage.updateIdentity(address, ipfsCid);
      
      if (!updatedIdentity) {
        return res.status(500).json({ message: "Failed to update identity" });
      }
      
      res.json(updatedIdentity);
    } catch (error) {
      console.error("Error updating identity:", error);
      res.status(500).json({ message: "Failed to update identity" });
    }
  });

  // Get identity by wallet address
  app.get("/api/identities/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      // First check if identity exists on blockchain
      const exists = await hasIdentity(address);
      
      if (!exists) {
        return res.status(404).json({ message: "Identity not found on blockchain" });
      }
      
      // Get CID from blockchain
      const cid = await getIdentityCID(address);
      
      if (!cid) {
        return res.status(404).json({ message: "Identity CID not found" });
      }
      
      // Get identity from database if available
      const storedIdentity = await storage.getIdentityByWalletAddress(address);
      
      // Return combined data
      res.json({
        walletAddress: address,
        ipfsCid: cid,
        ...(storedIdentity || {}),
      });
    } catch (error) {
      console.error("Error fetching identity:", error);
      res.status(500).json({ message: "Failed to fetch identity" });
    }
  });

  // ====== IPFS Routes ======
  
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
