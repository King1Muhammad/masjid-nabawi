import { pgTable, serial, text, numeric, boolean, timestamp, foreignKey, integer, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const discussionStatus = pgEnum("discussion_status", ['open', 'closed', 'resolved'])
export const proposalStatus = pgEnum("proposal_status", ['draft', 'voting', 'approved', 'rejected', 'implemented'])
export const voteType = pgEnum("vote_type", ['yes', 'no', 'abstain'])


export const campaigns = pgTable("campaigns", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	goal: numeric().notNull(),
	raised: numeric().default('0'),
	active: boolean().default(true),
	startDate: timestamp("start_date", { mode: 'string' }).defaultNow(),
	endDate: timestamp("end_date", { mode: 'string' }),
});

export const discussions = pgTable("discussions", {
	id: serial().primaryKey().notNull(),
	societyId: integer("society_id"),
	creatorId: integer("creator_id"),
	title: text().notNull(),
	description: text().notNull(),
	status: discussionStatus().default('open'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	closedAt: timestamp("closed_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.societyId],
			foreignColumns: [society.id],
			name: "discussions_society_id_society_id_fk"
		}),
	foreignKey({
			columns: [table.creatorId],
			foreignColumns: [users.id],
			name: "discussions_creator_id_users_id_fk"
		}),
]);

export const enrollments = pgTable("enrollments", {
	id: serial().primaryKey().notNull(),
	courseId: text("course_id").notNull(),
	studentName: text("student_name").notNull(),
	guardianName: text("guardian_name"),
	age: integer().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	address: text(),
	status: text().default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const messages = pgTable("messages", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	subject: text().notNull(),
	message: text().notNull(),
	status: text().default('unread'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const societyBlocks = pgTable("society_blocks", {
	id: serial().primaryKey().notNull(),
	societyId: integer("society_id"),
	blockName: text("block_name").notNull(),
	flatsCount: integer("flats_count").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.societyId],
			foreignColumns: [society.id],
			name: "society_blocks_society_id_society_id_fk"
		}),
]);

export const donations = pgTable("donations", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	amount: numeric().notNull(),
	donationType: text("donation_type").notNull(),
	campaign: text().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	message: text(),
	anonymous: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "donations_user_id_users_id_fk"
		}),
]);

export const societyContributions = pgTable("society_contributions", {
	id: serial().primaryKey().notNull(),
	societyId: integer("society_id"),
	memberId: integer("member_id"),
	proposalId: integer("proposal_id"),
	amount: numeric().notNull(),
	paymentDate: timestamp("payment_date", { mode: 'string' }).defaultNow(),
	paymentMethod: text("payment_method").notNull(),
	paymentReference: text("payment_reference"),
	monthYear: text("month_year"),
	purpose: text().default('monthly'),
	status: text().default('completed'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.societyId],
			foreignColumns: [society.id],
			name: "society_contributions_society_id_society_id_fk"
		}),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [societyMembers.id],
			name: "society_contributions_member_id_society_members_id_fk"
		}),
	foreignKey({
			columns: [table.proposalId],
			foreignColumns: [proposals.id],
			name: "society_contributions_proposal_id_proposals_id_fk"
		}),
]);

export const societyMembers = pgTable("society_members", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	blockId: integer("block_id"),
	flatNumber: text("flat_number").notNull(),
	isOwner: boolean("is_owner").default(true),
	joinDate: timestamp("join_date", { mode: 'string' }).defaultNow(),
	status: text().default('active'),
	phoneNumber: text("phone_number"),
	isCommitteeMember: boolean("is_committee_member").default(false),
	role: text().default('member'),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "society_members_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.blockId],
			foreignColumns: [societyBlocks.id],
			name: "society_members_block_id_society_blocks_id_fk"
		}),
]);

export const societyExpenses = pgTable("society_expenses", {
	id: serial().primaryKey().notNull(),
	societyId: integer("society_id"),
	proposalId: integer("proposal_id"),
	title: text().notNull(),
	description: text(),
	amount: numeric().notNull(),
	expenseDate: timestamp("expense_date", { mode: 'string' }).notNull(),
	category: text().notNull(),
	receipt: text(),
	status: text().default('pending'),
	approvedBy: integer("approved_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.societyId],
			foreignColumns: [society.id],
			name: "society_expenses_society_id_society_id_fk"
		}),
	foreignKey({
			columns: [table.proposalId],
			foreignColumns: [proposals.id],
			name: "society_expenses_proposal_id_proposals_id_fk"
		}),
	foreignKey({
			columns: [table.approvedBy],
			foreignColumns: [users.id],
			name: "society_expenses_approved_by_users_id_fk"
		}),
]);

export const society = pgTable("society", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	monthlyContribution: numeric("monthly_contribution").notNull(),
	totalBlocks: integer("total_blocks").notNull(),
	totalFlats: integer("total_flats").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const proposals = pgTable("proposals", {
	id: serial().primaryKey().notNull(),
	societyId: integer("society_id"),
	discussionId: integer("discussion_id"),
	creatorId: integer("creator_id"),
	title: text().notNull(),
	description: text().notNull(),
	estimatedCost: numeric("estimated_cost"),
	fundingNeeded: boolean("funding_needed").default(false),
	status: proposalStatus().default('draft'),
	votingStartDate: timestamp("voting_start_date", { mode: 'string' }),
	votingEndDate: timestamp("voting_end_date", { mode: 'string' }),
	implementationDate: timestamp("implementation_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.societyId],
			foreignColumns: [society.id],
			name: "proposals_society_id_society_id_fk"
		}),
	foreignKey({
			columns: [table.discussionId],
			foreignColumns: [discussions.id],
			name: "proposals_discussion_id_discussions_id_fk"
		}),
	foreignKey({
			columns: [table.creatorId],
			foreignColumns: [users.id],
			name: "proposals_creator_id_users_id_fk"
		}),
]);

export const subscribers = pgTable("subscribers", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("subscribers_email_unique").on(table.email),
]);

export const discussionComments = pgTable("discussion_comments", {
	id: serial().primaryKey().notNull(),
	discussionId: integer("discussion_id"),
	userId: integer("user_id"),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.discussionId],
			foreignColumns: [discussions.id],
			name: "discussion_comments_discussion_id_discussions_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "discussion_comments_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	email: text().notNull(),
	name: text(),
	role: text().default('user'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_username_unique").on(table.username),
]);

export const votes = pgTable("votes", {
	id: serial().primaryKey().notNull(),
	proposalId: integer("proposal_id"),
	userId: integer("user_id"),
	voteType: voteType("vote_type").notNull(),
	comment: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.proposalId],
			foreignColumns: [proposals.id],
			name: "votes_proposal_id_proposals_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "votes_user_id_users_id_fk"
		}),
]);
