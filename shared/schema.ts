import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core";
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
  paymentMethod: text("payment_method").default("bank_transfer"), // bank_transfer, easypaisa, jazzcash, nayapay, crypto_trc20, crypto_bnb
  transactionId: text("transaction_id"), // Reference number or transaction ID
  paymentProofUrl: text("payment_proof_url"), // URL to uploaded payment proof
  cryptoType: text("crypto_type"), // trc20, bnb 
  cryptoAddress: text("crypto_address"), // Wallet address used for payment
  paymentStatus: text("payment_status").default("pending"), // pending, completed, failed
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

// Status enums for discussions and proposals
export const discussionStatusEnum = pgEnum('discussion_status', ['open', 'closed', 'resolved']);
export const proposalStatusEnum = pgEnum('proposal_status', ['draft', 'voting', 'approved', 'rejected', 'implemented']);
export const voteTypeEnum = pgEnum('vote_type', ['yes', 'no', 'abstain']);

// Society schema for housing society
export const society = pgTable("society", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  monthlyContribution: numeric("monthly_contribution").notNull(),
  totalBlocks: integer("total_blocks").notNull(),
  totalFlats: integer("total_flats").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Society blocks schema
export const societyBlocks = pgTable("society_blocks", {
  id: serial("id").primaryKey(),
  societyId: integer("society_id").references(() => society.id),
  blockName: text("block_name").notNull(), // e.g., "D-1", "D-2"
  flatsCount: integer("flats_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Society residents/members schema
export const societyMembers = pgTable("society_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  blockId: integer("block_id").references(() => societyBlocks.id),
  flatNumber: text("flat_number").notNull(),
  isOwner: boolean("is_owner").default(true),
  joinDate: timestamp("join_date").defaultNow(),
  status: text("status").default("active"), // active, inactive
  phoneNumber: text("phone_number"),
  isCommitteeMember: boolean("is_committee_member").default(false),
  role: text("role").default("member"), // member, secretary, president, etc.
});

// Society discussion topics
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  societyId: integer("society_id").references(() => society.id),
  creatorId: integer("creator_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: discussionStatusEnum("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

// Comments on discussions
export const discussionComments = pgTable("discussion_comments", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").references(() => discussions.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Proposals for voting
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  societyId: integer("society_id").references(() => society.id),
  discussionId: integer("discussion_id").references(() => discussions.id),
  creatorId: integer("creator_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimatedCost: numeric("estimated_cost"),
  fundingNeeded: boolean("funding_needed").default(false),
  status: proposalStatusEnum("status").default("draft"),
  votingStartDate: timestamp("voting_start_date"),
  votingEndDate: timestamp("voting_end_date"),
  implementationDate: timestamp("implementation_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Votes on proposals
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").references(() => proposals.id),
  userId: integer("user_id").references(() => users.id),
  voteType: voteTypeEnum("vote_type").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Society expenses
export const societyExpenses = pgTable("society_expenses", {
  id: serial("id").primaryKey(),
  societyId: integer("society_id").references(() => society.id),
  proposalId: integer("proposal_id").references(() => proposals.id),
  title: text("title").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  expenseDate: timestamp("expense_date").notNull(),
  category: text("category").notNull(), // maintenance, security, utility, etc.
  receipt: text("receipt"), // URL to uploaded receipt
  status: text("status").default("pending"), // pending, approved, completed
  approvedBy: integer("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Society contributions/payments
export const societyContributions = pgTable("society_contributions", {
  id: serial("id").primaryKey(),
  societyId: integer("society_id").references(() => society.id),
  memberId: integer("member_id").references(() => societyMembers.id),
  proposalId: integer("proposal_id").references(() => proposals.id),
  amount: numeric("amount").notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentMethod: text("payment_method").notNull(), // online, cash, bank transfer
  paymentReference: text("payment_reference"),
  monthYear: text("month_year"), // Format: "MM-YYYY" for monthly contributions
  purpose: text("purpose").default("monthly"), // monthly, proposal, special
  status: text("status").default("completed"), // pending, completed
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
  raised: true as any,
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

// Society insert schemas
export const insertSocietySchema = createInsertSchema(society).omit({
  id: true,
  createdAt: true,
});

export const insertSocietyBlockSchema = createInsertSchema(societyBlocks).omit({
  id: true,
  createdAt: true,
});

export const insertSocietyMemberSchema = createInsertSchema(societyMembers).omit({
  id: true,
  joinDate: true,
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  status: true,
  createdAt: true,
  closedAt: true,
});

export const insertDiscussionCommentSchema = createInsertSchema(discussionComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertSocietyExpenseSchema = createInsertSchema(societyExpenses).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertSocietyContributionSchema = createInsertSchema(societyContributions).omit({
  id: true,
  paymentDate: true,
  status: true,
  createdAt: true,
});

// Society types
export type Society = typeof society.$inferSelect;
export type InsertSociety = z.infer<typeof insertSocietySchema>;

export type SocietyBlock = typeof societyBlocks.$inferSelect;
export type InsertSocietyBlock = z.infer<typeof insertSocietyBlockSchema>;

export type SocietyMember = typeof societyMembers.$inferSelect;
export type InsertSocietyMember = z.infer<typeof insertSocietyMemberSchema>;

export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;

export type DiscussionComment = typeof discussionComments.$inferSelect;
export type InsertDiscussionComment = z.infer<typeof insertDiscussionCommentSchema>;

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type SocietyExpense = typeof societyExpenses.$inferSelect;
export type InsertSocietyExpense = z.infer<typeof insertSocietyExpenseSchema>;

export type SocietyContribution = typeof societyContributions.$inferSelect;
export type InsertSocietyContribution = z.infer<typeof insertSocietyContributionSchema>;
