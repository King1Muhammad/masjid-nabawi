import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Donation schema
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: numeric("amount").notNull(),
  donationType: text("donation_type").notNull(), // one-time, monthly, zakat, sadaqah
  campaign: text("campaign").notNull(), // general, expansion, scholarship, ramadan
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  message: text("message"),
  anonymous: boolean("anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Madrasa enrollment schema
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  courseId: text("course_id").notNull(),
  studentName: text("student_name").notNull(),
  guardianName: text("guardian_name"),
  age: integer("age").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  status: text("status").default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread"), // unread, read, replied
  createdAt: timestamp("created_at").defaultNow(),
});

// Campaigns schema
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  goal: numeric("goal").notNull(),
  raised: numeric("raised").default("0"),
  active: boolean("active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
});

// Schema for newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  raised: true,
  createdAt: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
