-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."discussion_status" AS ENUM('open', 'closed', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."proposal_status" AS ENUM('draft', 'voting', 'approved', 'rejected', 'implemented');--> statement-breakpoint
CREATE TYPE "public"."vote_type" AS ENUM('yes', 'no', 'abstain');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"goal" numeric NOT NULL,
	"raised" numeric DEFAULT '0',
	"active" boolean DEFAULT true,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "discussions" (
	"id" serial PRIMARY KEY NOT NULL,
	"society_id" integer,
	"creator_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "discussion_status" DEFAULT 'open',
	"created_at" timestamp DEFAULT now(),
	"closed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"student_name" text NOT NULL,
	"guardian_name" text,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'unread',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "society_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"society_id" integer,
	"block_name" text NOT NULL,
	"flats_count" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"amount" numeric NOT NULL,
	"donation_type" text NOT NULL,
	"campaign" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"message" text,
	"anonymous" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "society_contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"society_id" integer,
	"member_id" integer,
	"proposal_id" integer,
	"amount" numeric NOT NULL,
	"payment_date" timestamp DEFAULT now(),
	"payment_method" text NOT NULL,
	"payment_reference" text,
	"month_year" text,
	"purpose" text DEFAULT 'monthly',
	"status" text DEFAULT 'completed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "society_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"block_id" integer,
	"flat_number" text NOT NULL,
	"is_owner" boolean DEFAULT true,
	"join_date" timestamp DEFAULT now(),
	"status" text DEFAULT 'active',
	"phone_number" text,
	"is_committee_member" boolean DEFAULT false,
	"role" text DEFAULT 'member'
);
--> statement-breakpoint
CREATE TABLE "society_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"society_id" integer,
	"proposal_id" integer,
	"title" text NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"expense_date" timestamp NOT NULL,
	"category" text NOT NULL,
	"receipt" text,
	"status" text DEFAULT 'pending',
	"approved_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "society" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"monthly_contribution" numeric NOT NULL,
	"total_blocks" integer NOT NULL,
	"total_flats" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" serial PRIMARY KEY NOT NULL,
	"society_id" integer,
	"discussion_id" integer,
	"creator_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"estimated_cost" numeric,
	"funding_needed" boolean DEFAULT false,
	"status" "proposal_status" DEFAULT 'draft',
	"voting_start_date" timestamp,
	"voting_end_date" timestamp,
	"implementation_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "discussion_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"discussion_id" integer,
	"user_id" integer,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"proposal_id" integer,
	"user_id" integer,
	"vote_type" "vote_type" NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_blocks" ADD CONSTRAINT "society_blocks_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_contributions" ADD CONSTRAINT "society_contributions_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_contributions" ADD CONSTRAINT "society_contributions_member_id_society_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."society_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_contributions" ADD CONSTRAINT "society_contributions_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_members" ADD CONSTRAINT "society_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_members" ADD CONSTRAINT "society_members_block_id_society_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."society_blocks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_expenses" ADD CONSTRAINT "society_expenses_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_expenses" ADD CONSTRAINT "society_expenses_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_expenses" ADD CONSTRAINT "society_expenses_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_comments" ADD CONSTRAINT "discussion_comments_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_comments" ADD CONSTRAINT "discussion_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
*/