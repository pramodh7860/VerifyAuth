import { users, identities, type User, type InsertUser, type Identity, type InsertIdentity } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Identity operations
  getIdentity(id: number): Promise<Identity | undefined>;
  getIdentityByWalletAddress(walletAddress: string): Promise<Identity | undefined>;
  createIdentity(identity: InsertIdentity): Promise<Identity>;
  updateIdentity(walletAddress: string, ipfsCid: string): Promise<Identity | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Identity operations
  async getIdentity(id: number): Promise<Identity | undefined> {
    const [identity] = await db.select().from(identities).where(eq(identities.id, id));
    return identity;
  }
  
  async getIdentityByWalletAddress(walletAddress: string): Promise<Identity | undefined> {
    const [identity] = await db.select().from(identities).where(eq(identities.walletAddress, walletAddress));
    return identity;
  }
  
  async createIdentity(identity: InsertIdentity): Promise<Identity> {
    const [newIdentity] = await db
      .insert(identities)
      .values(identity)
      .returning();
    return newIdentity;
  }
  
  async updateIdentity(walletAddress: string, ipfsCid: string): Promise<Identity | undefined> {
    const [updatedIdentity] = await db
      .update(identities)
      .set({ ipfsCid, updatedAt: new Date() })
      .where(eq(identities.walletAddress, walletAddress))
      .returning();
    return updatedIdentity;
  }
}

export const storage = new DatabaseStorage();
