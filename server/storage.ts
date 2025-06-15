import { 
  users, type User, type InsertUser,
  donations, type Donation, type InsertDonation,
  enrollments, type Enrollment, type InsertEnrollment,
  schemaMessages, type Message, type InsertMessage,
  campaigns, type Campaign, type InsertCampaign,
  subscribers, type Subscriber, type InsertSubscriber,
  society, type Society, type InsertSociety,
  societyBlocks, type SocietyBlock, type InsertSocietyBlock,
  societyMembers, type SocietyMember, type InsertSocietyMember,
  discussions, type Discussion, type InsertDiscussion,
  discussionComments, type DiscussionComment, type InsertDiscussionComment,
  proposals, type Proposal, type InsertProposal,
  votes, type Vote, type InsertVote,
  societyExpenses, type SocietyExpense, type InsertSocietyExpense,
  societyContributions, type SocietyContribution, type InsertSocietyContribution
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import * as schema from '@shared/schema';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Donation methods
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonationsByUserId(userId: number): Promise<Donation[]>;
  getDonationsByCampaign(campaign: string): Promise<Donation[]>;
  
  // Enrollment methods
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollments(): Promise<Enrollment[]>;
  getEnrollmentById(id: number): Promise<Enrollment | undefined>;
  updateEnrollmentStatus(id: number, status: string): Promise<Enrollment | undefined>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  updateMessageStatus(id: number, status: string): Promise<Message | undefined>;
  
  // Campaign methods
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  updateCampaignRaised(id: number, amount: number): Promise<Campaign | undefined>;
  
  // Subscriber methods
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscribers(): Promise<Subscriber[]>;
  
  // Society methods
  createSociety(societyData: InsertSociety): Promise<Society>;
  getSocietyById(id: number): Promise<Society | undefined>;
  updateSociety(id: number, data: Partial<InsertSociety>): Promise<Society | undefined>;
  
  // Society Block methods
  createSocietyBlock(blockData: InsertSocietyBlock): Promise<SocietyBlock>;
  getSocietyBlocks(societyId: number): Promise<SocietyBlock[]>;
  getSocietyBlockById(id: number): Promise<SocietyBlock | undefined>;
  
  // Society Member methods
  createSocietyMember(memberData: InsertSocietyMember): Promise<SocietyMember>;
  getSocietyMembers(societyId: number): Promise<SocietyMember[]>;
  getSocietyMemberById(id: number): Promise<SocietyMember | undefined>;
  getSocietyMemberByUserId(userId: number): Promise<SocietyMember | undefined>;
  updateSocietyMember(id: number, data: Partial<InsertSocietyMember>): Promise<SocietyMember | undefined>;
  
  // Discussion methods
  createDiscussion(discussionData: InsertDiscussion): Promise<Discussion>;
  getDiscussions(societyId: number): Promise<Discussion[]>;
  getDiscussionById(id: number): Promise<Discussion | undefined>;
  updateDiscussionStatus(id: number, status: string): Promise<Discussion | undefined>;
  
  // Discussion Comment methods
  createDiscussionComment(commentData: InsertDiscussionComment): Promise<DiscussionComment>;
  getDiscussionComments(discussionId: number): Promise<DiscussionComment[]>;
  
  // Proposal methods
  createProposal(proposalData: InsertProposal): Promise<Proposal>;
  getProposals(societyId: number): Promise<Proposal[]>;
  getProposalById(id: number): Promise<Proposal | undefined>;
  updateProposalStatus(id: number, status: string): Promise<Proposal | undefined>;
  
  // Vote methods
  createVote(voteData: InsertVote): Promise<Vote>;
  getVotesByProposal(proposalId: number): Promise<Vote[]>;
  getUserVoteOnProposal(userId: number, proposalId: number): Promise<Vote | undefined>;
  
  // Society Expense methods
  createSocietyExpense(expenseData: InsertSocietyExpense): Promise<SocietyExpense>;
  getSocietyExpenses(societyId: number): Promise<SocietyExpense[]>;
  getSocietyExpenseById(id: number): Promise<SocietyExpense | undefined>;
  
  // Society Contribution methods
  createSocietyContribution(contributionData: InsertSocietyContribution): Promise<SocietyContribution>;
  getSocietyContributions(societyId: number): Promise<SocietyContribution[]>;
  getSocietyContributionsByMember(memberId: number): Promise<SocietyContribution[]>;
  getSocietyContributionById(id: number): Promise<SocietyContribution | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      role: "user",
      createdAt: new Date()
    }).returning();
    return user;
  }
  
  // Donation methods
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values({
      ...insertDonation,
      amount: typeof insertDonation.amount === 'number' ? insertDonation.amount.toString() : insertDonation.amount,
      createdAt: new Date()
    }).returning();
    
    // Update campaign raised amount if necessary
    if (donation.campaign) {
      const [campaign] = await db.select().from(campaigns)
        .where(sql`LOWER(${campaigns.name}) = LOWER(${donation.campaign})`);
      
      if (campaign) {
        await this.updateCampaignRaised(campaign.id, parseFloat(donation.amount));
      }
    }
    
    return donation;
  }
  
  async getDonations(): Promise<Donation[]> {
    return db.select().from(donations).orderBy(desc(donations.createdAt));
  }
  
  async getDonationsByUserId(userId: number): Promise<Donation[]> {
    return db.select().from(donations)
      .where(eq(donations.userId, userId))
      .orderBy(desc(donations.createdAt));
  }
  
  async getDonationsByCampaign(campaign: string): Promise<Donation[]> {
    return db.select().from(donations)
      .where(sql`LOWER(${donations.campaign}) = LOWER(${campaign})`)
      .orderBy(desc(donations.createdAt));
  }
  
  // Enrollment methods
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(schema.enrollments).values({
      ...insertEnrollment,
      age: Number(insertEnrollment.age), // Ensure age is a number
      status: "pending",
      createdAt: new Date()
    }).returning();
    return enrollment;
  }
  
  async getEnrollments(): Promise<Enrollment[]> {
    return db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  }
  
  async getEnrollmentById(id: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return enrollment;
  }
  
  async updateEnrollmentStatus(id: number, status: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.update(enrollments)
      .set({ status })
      .where(eq(enrollments.id, id))
      .returning();
    return enrollment;
  }
  
  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(schema.messages).values({
      ...insertMessage,
      status: "unread",
      createdAt: new Date()
    }).returning();
    return message;
  }
  
  async getMessages(): Promise<Message[]> {
    return db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt));
  }
  
  async updateMessageStatus(id: number, status: string): Promise<Message | undefined> {
    const [message] = await db.update(schema.messages)
      .set({ status })
      .where(eq(schema.messages.id, id))
      .returning();
    return message;
  }
  
  // Campaign methods
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db.insert(campaigns).values(insertCampaign).returning();
    return campaign;
  }
  
  async getCampaigns(): Promise<Campaign[]> {
    return db.select().from(campaigns).orderBy(desc(campaigns.startDate));
  }
  
  async getCampaignById(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }
  
  async updateCampaignRaised(id: number, amount: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    
    if (campaign) {
      const currentRaised = parseFloat(campaign.raised || "0");
      const newRaised = (currentRaised + amount).toString();
      
      const [updatedCampaign] = await db.update(campaigns)
        .set({ raised: newRaised })
        .where(eq(campaigns.id, id))
        .returning();
        
      return updatedCampaign;
    }
    
    return undefined;
  }
  
  // Subscriber methods
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(insertSubscriber).returning();
    return subscriber;
  }
  
  async getSubscribers(): Promise<Subscriber[]> {
    return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }
  
  // Society methods
  async createSociety(societyData: InsertSociety): Promise<Society> {
    const [newSociety] = await db.insert(society).values(societyData).returning();
    return newSociety;
  }
  
  async getSocietyById(id: number): Promise<Society | undefined> {
    const [societyData] = await db.select().from(society).where(eq(society.id, id));
    return societyData;
  }
  
  async updateSociety(id: number, data: Partial<InsertSociety>): Promise<Society | undefined> {
    const [updatedSociety] = await db.update(society)
      .set(data)
      .where(eq(society.id, id))
      .returning();
    return updatedSociety;
  }
  
  // Society Block methods
  async createSocietyBlock(blockData: InsertSocietyBlock): Promise<SocietyBlock> {
    const [newBlock] = await db.insert(societyBlocks).values(blockData).returning();
    return newBlock;
  }
  
  async getSocietyBlocks(societyId: number): Promise<SocietyBlock[]> {
    return db.select().from(societyBlocks)
      .where(eq(societyBlocks.societyId, societyId))
      .orderBy(asc(societyBlocks.blockName));
  }
  
  async getSocietyBlockById(id: number): Promise<SocietyBlock | undefined> {
    const [block] = await db.select().from(societyBlocks).where(eq(societyBlocks.id, id));
    return block;
  }
  
  // Society Member methods
  async createSocietyMember(memberData: InsertSocietyMember): Promise<SocietyMember> {
    const [newMember] = await db.insert(societyMembers).values(memberData).returning();
    return newMember;
  }
  
  async getSocietyMembers(societyId: number): Promise<SocietyMember[]> {
    const result = await db.select({
        member: societyMembers
      })
      .from(societyMembers)
      .innerJoin(societyBlocks, eq(societyMembers.blockId, societyBlocks.id))
      .where(eq(societyBlocks.societyId, societyId))
      .orderBy(asc(societyMembers.flatNumber));
      
    return result.map(r => r.member);
  }
  
  async getSocietyMemberById(id: number): Promise<SocietyMember | undefined> {
    const [member] = await db.select().from(societyMembers).where(eq(societyMembers.id, id));
    return member;
  }
  
  async getSocietyMemberByUserId(userId: number): Promise<SocietyMember | undefined> {
    const [member] = await db.select().from(societyMembers).where(eq(societyMembers.userId, userId));
    return member;
  }
  
  async updateSocietyMember(id: number, data: Partial<InsertSocietyMember>): Promise<SocietyMember | undefined> {
    const [updatedMember] = await db.update(societyMembers)
      .set(data)
      .where(eq(societyMembers.id, id))
      .returning();
    return updatedMember;
  }
  
  // Discussion methods
  async createDiscussion(discussionData: InsertDiscussion): Promise<Discussion> {
    // Set a default open status
    const [newDiscussion] = await db.insert(discussions).values(discussionData).returning();
    return newDiscussion;
  }
  
  async getDiscussions(societyId: number): Promise<Discussion[]> {
    return db.select().from(discussions)
      .where(eq(discussions.societyId, societyId))
      .orderBy(desc(discussions.createdAt));
  }
  
  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));
    return discussion;
  }
  
  async updateDiscussionStatus(id: number, status: string): Promise<Discussion | undefined> {
    // Valid statuses should be one of: 'open', 'closed', 'resolved'
    if (!['open', 'closed', 'resolved'].includes(status)) {
      throw new Error(`Invalid discussion status: ${status}. Must be one of: open, closed, resolved`);
    }
    
    const [updatedDiscussion] = await db.update(discussions)
      .set({ status: status as any })
      .where(eq(discussions.id, id))
      .returning();
    return updatedDiscussion;
  }
  
  // Discussion Comment methods
  async createDiscussionComment(commentData: InsertDiscussionComment): Promise<DiscussionComment> {
    const [newComment] = await db.insert(discussionComments).values(commentData).returning();
    return newComment;
  }
  
  async getDiscussionComments(discussionId: number): Promise<DiscussionComment[]> {
    return db.select().from(discussionComments)
      .where(eq(discussionComments.discussionId, discussionId))
      .orderBy(asc(discussionComments.createdAt));
  }
  
  // Proposal methods
  async createProposal(proposalData: InsertProposal): Promise<Proposal> {
    // Default status will be set by the database
    const [newProposal] = await db.insert(proposals).values(proposalData).returning();
    return newProposal;
  }
  
  async getProposals(societyId: number): Promise<Proposal[]> {
    return db.select().from(proposals)
      .where(eq(proposals.societyId, societyId))
      .orderBy(desc(proposals.createdAt));
  }
  
  async getProposalById(id: number): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }
  
  async updateProposalStatus(id: number, status: string): Promise<Proposal | undefined> {
    // Valid statuses should be one of: 'draft', 'voting', 'approved', 'rejected', 'implemented'
    if (!['draft', 'voting', 'approved', 'rejected', 'implemented'].includes(status)) {
      throw new Error(`Invalid proposal status: ${status}. Must be one of: draft, voting, approved, rejected, implemented`);
    }
    
    const [updatedProposal] = await db.update(proposals)
      .set({ status: status as any })
      .where(eq(proposals.id, id))
      .returning();
    return updatedProposal;
  }
  
  // Vote methods
  async createVote(voteData: InsertVote): Promise<Vote> {
    const [newVote] = await db.insert(votes).values(voteData).returning();
    return newVote;
  }
  
  async getVotesByProposal(proposalId: number): Promise<Vote[]> {
    return db.select().from(votes)
      .where(eq(votes.proposalId, proposalId))
      .orderBy(desc(votes.createdAt));
  }
  
  async getUserVoteOnProposal(userId: number, proposalId: number): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(
      and(
        eq(votes.userId, userId),
        eq(votes.proposalId, proposalId)
      )
    );
    return vote;
  }
  
  // Society Expense methods
  async createSocietyExpense(expenseData: InsertSocietyExpense): Promise<SocietyExpense> {
    const [newExpense] = await db.insert(societyExpenses).values(expenseData).returning();
    return newExpense;
  }
  
  async getSocietyExpenses(societyId: number): Promise<SocietyExpense[]> {
    return db.select().from(societyExpenses)
      .where(eq(societyExpenses.societyId, societyId))
      .orderBy(desc(societyExpenses.createdAt));
  }
  
  async getSocietyExpenseById(id: number): Promise<SocietyExpense | undefined> {
    const [expense] = await db.select().from(societyExpenses).where(eq(societyExpenses.id, id));
    return expense;
  }
  
  // Society Contribution methods
  async createSocietyContribution(contributionData: InsertSocietyContribution): Promise<SocietyContribution> {
    const [newContribution] = await db.insert(societyContributions).values(contributionData).returning();
    return newContribution;
  }
  
  async getSocietyContributions(societyId: number): Promise<SocietyContribution[]> {
    return db.select().from(societyContributions)
      .where(eq(societyContributions.societyId, societyId))
      .orderBy(desc(societyContributions.createdAt));
  }
  
  async getSocietyContributionsByMember(memberId: number): Promise<SocietyContribution[]> {
    return db.select().from(societyContributions)
      .where(eq(societyContributions.memberId, memberId))
      .orderBy(desc(societyContributions.createdAt));
  }
  
  async getSocietyContributionById(id: number): Promise<SocietyContribution | undefined> {
    const [contribution] = await db.select().from(societyContributions)
      .where(eq(societyContributions.id, id));
    return contribution;
  }
}

export const storage = new DatabaseStorage();
