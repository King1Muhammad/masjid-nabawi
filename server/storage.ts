import { 
  users, type User, type InsertUser,
  donations, type Donation, type InsertDonation,
  enrollments, type Enrollment, type InsertEnrollment,
  messages, type Message, type InsertMessage,
  campaigns, type Campaign, type InsertCampaign,
  subscribers, type Subscriber, type InsertSubscriber
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private donations: Map<number, Donation>;
  private enrollments: Map<number, Enrollment>;
  private messages: Map<number, Message>;
  private campaigns: Map<number, Campaign>;
  private subscribers: Map<number, Subscriber>;
  
  private currentUserId: number;
  private currentDonationId: number;
  private currentEnrollmentId: number;
  private currentMessageId: number;
  private currentCampaignId: number;
  private currentSubscriberId: number;
  
  constructor() {
    this.users = new Map();
    this.donations = new Map();
    this.enrollments = new Map();
    this.messages = new Map();
    this.campaigns = new Map();
    this.subscribers = new Map();
    
    this.currentUserId = 1;
    this.currentDonationId = 1;
    this.currentEnrollmentId = 1;
    this.currentMessageId = 1;
    this.currentCampaignId = 1;
    this.currentSubscriberId = 1;
    
    // Add demo campaigns
    this.initializeCampaigns();
  }
  
  private initializeCampaigns() {
    const campaigns: InsertCampaign[] = [
      {
        name: "Masjid Expansion Project",
        description: "Help us expand our prayer hall to accommodate our growing community.",
        goal: 1000000,
        raised: 650000,
        active: true,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
      },
      {
        name: "Madrasa Scholarship Fund",
        description: "Support students who cannot afford tuition for our Islamic education programs.",
        goal: 50000,
        raised: 40000,
        active: true,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
      },
      {
        name: "Ramadan Food Distribution",
        description: "Help provide iftar meals and food packages to needy families during Ramadan.",
        goal: 20000,
        raised: 7000,
        active: true,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
      }
    ];
    
    campaigns.forEach(campaign => this.createCampaign(campaign));
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, role: "user", createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Donation methods
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentDonationId++;
    const now = new Date();
    const donation: Donation = { ...insertDonation, id, createdAt: now };
    this.donations.set(id, donation);
    
    // Update campaign raised amount
    if (donation.campaign) {
      const campaign = Array.from(this.campaigns.values()).find(
        camp => camp.name.toLowerCase() === donation.campaign.toLowerCase()
      );
      
      if (campaign) {
        await this.updateCampaignRaised(campaign.id, Number(donation.amount));
      }
    }
    
    return donation;
  }
  
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }
  
  async getDonationsByUserId(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      donation => donation.userId === userId
    );
  }
  
  async getDonationsByCampaign(campaign: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      donation => donation.campaign.toLowerCase() === campaign.toLowerCase()
    );
  }
  
  // Enrollment methods
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const now = new Date();
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      status: "pending", 
      createdAt: now 
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }
  
  async getEnrollments(): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values());
  }
  
  async getEnrollmentById(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }
  
  async updateEnrollmentStatus(id: number, status: string): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (enrollment) {
      const updatedEnrollment: Enrollment = { ...enrollment, status };
      this.enrollments.set(id, updatedEnrollment);
      return updatedEnrollment;
    }
    return undefined;
  }
  
  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      status: "unread", 
      createdAt: now 
    };
    this.messages.set(id, message);
    return message;
  }
  
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }
  
  async updateMessageStatus(id: number, status: string): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (message) {
      const updatedMessage: Message = { ...message, status };
      this.messages.set(id, updatedMessage);
      return updatedMessage;
    }
    return undefined;
  }
  
  // Campaign methods
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const campaign: Campaign = { 
      ...insertCampaign, 
      id, 
      raised: insertCampaign.raised || 0
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }
  
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }
  
  async getCampaignById(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }
  
  async updateCampaignRaised(id: number, amount: number): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (campaign) {
      const currentRaised = typeof campaign.raised === 'number' ? campaign.raised : Number(campaign.raised);
      const updatedCampaign: Campaign = { 
        ...campaign, 
        raised: currentRaised + amount
      };
      this.campaigns.set(id, updatedCampaign);
      return updatedCampaign;
    }
    return undefined;
  }
  
  // Subscriber methods
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentSubscriberId++;
    const now = new Date();
    const subscriber: Subscriber = { ...insertSubscriber, id, createdAt: now };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  async getSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }
}

export const storage = new MemStorage();
