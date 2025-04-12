import { pgTable, text, serial, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    usernameIdx: uniqueIndex("username_idx").on(table.username),
    emailIdx: uniqueIndex("email_idx").on(table.email),
  };
});

// Identities table
export const identities = pgTable("identities", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  ipfsCid: text("ipfs_cid").notNull(),
  userId: serial("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    addressIdx: uniqueIndex("address_idx").on(table.walletAddress),
  };
});

// Establish relationships between tables
export const usersRelations = relations(users, ({ many }) => ({
  identities: many(identities),
}));

export const identitiesRelations = relations(identities, ({ one }) => ({
  user: one(users, {
    fields: [identities.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIdentitySchema = createInsertSchema(identities).pick({
  walletAddress: true,
  ipfsCid: true,
  userId: true,
});

// Data validation schemas
export const identityDataSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  age: z.number().int().min(1, "Age must be at least 1"),
  collegeId: z.string().min(1, "College ID is required"),
  additionalInfo: z.string().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Identity = typeof identities.$inferSelect;
export type InsertIdentity = z.infer<typeof insertIdentitySchema>;

export type IdentityData = z.infer<typeof identityDataSchema>;
