import { relations } from "drizzle-orm/relations";
import { society, discussions, users, societyBlocks, donations, societyContributions, societyMembers, proposals, societyExpenses, discussionComments, votes } from "./schema";

export const discussionsRelations = relations(discussions, ({one, many}) => ({
	society: one(society, {
		fields: [discussions.societyId],
		references: [society.id]
	}),
	user: one(users, {
		fields: [discussions.creatorId],
		references: [users.id]
	}),
	proposals: many(proposals),
	discussionComments: many(discussionComments),
}));

export const societyRelations = relations(society, ({many}) => ({
	discussions: many(discussions),
	societyBlocks: many(societyBlocks),
	societyContributions: many(societyContributions),
	societyExpenses: many(societyExpenses),
	proposals: many(proposals),
}));

export const usersRelations = relations(users, ({many}) => ({
	discussions: many(discussions),
	donations: many(donations),
	societyMembers: many(societyMembers),
	societyExpenses: many(societyExpenses),
	proposals: many(proposals),
	discussionComments: many(discussionComments),
	votes: many(votes),
}));

export const societyBlocksRelations = relations(societyBlocks, ({one, many}) => ({
	society: one(society, {
		fields: [societyBlocks.societyId],
		references: [society.id]
	}),
	societyMembers: many(societyMembers),
}));

export const donationsRelations = relations(donations, ({one}) => ({
	user: one(users, {
		fields: [donations.userId],
		references: [users.id]
	}),
}));

export const societyContributionsRelations = relations(societyContributions, ({one}) => ({
	society: one(society, {
		fields: [societyContributions.societyId],
		references: [society.id]
	}),
	societyMember: one(societyMembers, {
		fields: [societyContributions.memberId],
		references: [societyMembers.id]
	}),
	proposal: one(proposals, {
		fields: [societyContributions.proposalId],
		references: [proposals.id]
	}),
}));

export const societyMembersRelations = relations(societyMembers, ({one, many}) => ({
	societyContributions: many(societyContributions),
	user: one(users, {
		fields: [societyMembers.userId],
		references: [users.id]
	}),
	societyBlock: one(societyBlocks, {
		fields: [societyMembers.blockId],
		references: [societyBlocks.id]
	}),
}));

export const proposalsRelations = relations(proposals, ({one, many}) => ({
	societyContributions: many(societyContributions),
	societyExpenses: many(societyExpenses),
	society: one(society, {
		fields: [proposals.societyId],
		references: [society.id]
	}),
	discussion: one(discussions, {
		fields: [proposals.discussionId],
		references: [discussions.id]
	}),
	user: one(users, {
		fields: [proposals.creatorId],
		references: [users.id]
	}),
	votes: many(votes),
}));

export const societyExpensesRelations = relations(societyExpenses, ({one}) => ({
	society: one(society, {
		fields: [societyExpenses.societyId],
		references: [society.id]
	}),
	proposal: one(proposals, {
		fields: [societyExpenses.proposalId],
		references: [proposals.id]
	}),
	user: one(users, {
		fields: [societyExpenses.approvedBy],
		references: [users.id]
	}),
}));

export const discussionCommentsRelations = relations(discussionComments, ({one}) => ({
	discussion: one(discussions, {
		fields: [discussionComments.discussionId],
		references: [discussions.id]
	}),
	user: one(users, {
		fields: [discussionComments.userId],
		references: [users.id]
	}),
}));

export const votesRelations = relations(votes, ({one}) => ({
	proposal: one(proposals, {
		fields: [votes.proposalId],
		references: [proposals.id]
	}),
	user: one(users, {
		fields: [votes.userId],
		references: [users.id]
	}),
}));