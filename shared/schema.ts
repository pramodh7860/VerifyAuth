import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const identities = pgTable("identities", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  ipfsCid: text("ipfs_cid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIdentitySchema = createInsertSchema(identities).pick({
  walletAddress: true,
  ipfsCid: true,
});

export const identityDataSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  age: z.number().int().min(1, "Age must be at least 1"),
  collegeId: z.string().min(1, "College ID is required"),
  additionalInfo: z.string().optional(),
});

export type InsertIdentity = z.infer<typeof insertIdentitySchema>;
export type Identity = typeof identities.$inferSelect;
export type IdentityData = z.infer<typeof identityDataSchema>;
