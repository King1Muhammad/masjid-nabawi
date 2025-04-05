import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDonationSchema, 
  insertEnrollmentSchema, 
  insertMessageSchema, 
  insertSubscriberSchema,
  insertSocietySchema,
  insertSocietyBlockSchema,
  insertSocietyMemberSchema,
  insertSocietyContributionSchema,
  insertSocietyExpenseSchema,
  insertDiscussionSchema,
  insertDiscussionCommentSchema,
  insertProposalSchema,
  insertVoteSchema
} from "@shared/schema";
import axios from "axios";
import Stripe from "stripe";
import { generateImage, generateMultipleImages } from "./image-generation";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY. Stripe payments will not be processed.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

// Set up storage for payment receipts
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: uploadStorage });

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for prayer times - updated to use Hanafi method for Islamabad
  app.get("/api/prayer-times", async (req, res) => {
    try {
      const { city = "Islamabad", country = "Pakistan" } = req.query;
      
      // Using Hanafi method (1 = Karachi method or University of Islamic Sciences, Karachi)
      // This is more appropriate for Pakistan than ISNA method
      const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity`, {
        params: {
          city,
          country, 
          method: 1, // Karachi method - used for Hanafi followers in Pakistan
          school: 1   // 1 for Hanafi school calculation for Asr prayer time
        }
      });
      
      const data = response.data;
      if (data.code === 200 && data.status === "OK") {
        const timings = data.data.timings;
        
        // Use our fallback times in case of API failure
        if (!timings) {
          return res.json({
            Fajr: "04:15",
            Sunrise: "05:41", 
            Dhuhr: "12:00",
            Asr: "15:30",
            Maghrib: "18:20",
            Isha: "19:50",
            Juma: "13:30"
          });
        }
        
        // Add Juma time since the API doesn't provide it
        timings.Juma = "13:30";
        
        res.json(timings);
      } else {
        // Use our accurate local times as fallback
        res.json({
          Fajr: "04:15",
          Sunrise: "05:41", 
          Dhuhr: "12:00",
          Asr: "15:30",
          Maghrib: "18:20",
          Isha: "19:50",
          Juma: "13:30"
        });
      }
    } catch (error) {
      // If API call fails, use our accurate local times
      res.json({
        Fajr: "04:15",
        Sunrise: "05:41", 
        Dhuhr: "12:00",
        Asr: "15:30",
        Maghrib: "18:20",
        Isha: "19:50",
        Juma: "13:30"
      });
    }
  });
  
  // API routes for campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });
  
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaignById(campaignId);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });
  
  // API routes for donations
  app.post("/api/donations", async (req, res) => {
    try {
      const validationResult = insertDonationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid donation data", 
          errors: validationResult.error.format() 
        });
      }
      
      // Handle crypto donation data
      const donationData = validationResult.data;
      if (donationData.paymentMethod === 'crypto_trc20' || donationData.paymentMethod === 'crypto_bnb') {
        if (!donationData.cryptoType || !donationData.cryptoAddress) {
          donationData.cryptoType = donationData.paymentMethod === 'crypto_trc20' ? 'trc20' : 'bnb';
          donationData.cryptoAddress = donationData.paymentMethod === 'crypto_trc20' 
            ? 'TAYc66GdUqufsWcAHXxS6qgXRW2w73179f' 
            : '0xd4f5912e37aa51402849acd7d9d4e7e9d94eb458';
        }
      }
      
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      console.error("Donation error:", error);
      res.status(500).json({ message: "Failed to process donation" });
    }
  });
  
  // API routes for enrollments
  app.post("/api/enrollments", async (req, res) => {
    try {
      const validationResult = insertEnrollmentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid enrollment data", 
          errors: validationResult.error.format() 
        });
      }
      
      const enrollment = await storage.createEnrollment(validationResult.data);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to process enrollment" });
    }
  });
  
  // API routes for contact messages
  app.post("/api/messages", async (req, res) => {
    try {
      const validationResult = insertMessageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid message data", 
          errors: validationResult.error.format() 
        });
      }
      
      const message = await storage.createMessage(validationResult.data);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // API routes for newsletter subscribers
  app.post("/api/subscribers", async (req, res) => {
    try {
      const validationResult = insertSubscriberSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid subscriber data", 
          errors: validationResult.error.format() 
        });
      }
      
      const subscriber = await storage.createSubscriber(validationResult.data);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(500).json({ message: "Failed to add subscriber" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment service unavailable. Please try again later or contact the administrator." 
        });
      }

      const { amount, campaign } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid donation amount" });
      }

      // Create a PaymentIntent with the specified amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          campaign: campaign || "general",
          donation_type: "one-time"
        }
      });

      // Return client secret to the client
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent", 
        error: error.message 
      });
    }
  });

  // API routes for image generation
  app.post("/api/generate-image", async (req: Request, res: Response) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "Image generation service unavailable. Please try again later or contact the administrator." 
        });
      }

      const { prompt, filename } = req.body;
      
      if (!prompt || !filename) {
        return res.status(400).json({ message: "Prompt and filename are required" });
      }

      const imagePath = await generateImage(prompt, filename);
      res.json({ path: imagePath });
    } catch (error: any) {
      console.error("Error generating image:", error);
      res.status(500).json({ 
        message: "Error generating image", 
        error: error.message 
      });
    }
  });

  // API route for generating multiple images
  app.post("/api/generate-multiple-images", async (req: Request, res: Response) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "Image generation service unavailable. Please try again later or contact the administrator." 
        });
      }

      const { promptsWithFilenames } = req.body;
      
      if (!promptsWithFilenames || !Array.isArray(promptsWithFilenames) || promptsWithFilenames.length === 0) {
        return res.status(400).json({ message: "Valid promptsWithFilenames array is required" });
      }

      const imagePaths = await generateMultipleImages(promptsWithFilenames);
      res.json({ paths: imagePaths });
    } catch (error: any) {
      console.error("Error generating multiple images:", error);
      res.status(500).json({ 
        message: "Error generating multiple images", 
        error: error.message 
      });
    }
  });

  // API route to generate themed images for the site
  app.post("/api/generate-themed-images", async (req: Request, res: Response) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "Image generation service unavailable. Please try again later or contact the administrator." 
        });
      }

      // Predefined set of themed images for the masjid website
      const themedPrompts = [
        {
          prompt: "A beautiful, realistic architectural rendering of a modern Islamic mosque in Islamabad, Pakistan, with traditional Islamic architecture elements including minarets and dome, set against a clear blue sky. The mosque should incorporate green and gold colors in its design. Ultra detailed, photorealistic style.",
          filename: "masjid-exterior.jpg"
        },
        {
          prompt: "Interior of a mosque prayer hall with ornate Islamic geometric patterns, beautiful chandeliers, Arabic calligraphy on the walls, and prayer rugs in neat rows. Soft natural light streaming through stained glass windows. Photorealistic style.",
          filename: "prayer-hall.jpg"
        },
        {
          prompt: "Islamic education class in a modern madrasa setting with students of various ages studying the Quran with a teacher. The classroom has Islamic art on walls and modern educational technology. Warm lighting, photorealistic style.",
          filename: "madrasa-class.jpg"
        },
        {
          prompt: "A digital transparency board showing mosque donations and expenses with clear financial charts, graphs and Islamic design elements. People can see exactly where donations are allocated. Modern, clean design with Islamic green and gold accents.",
          filename: "donation-transparency.jpg"
        },
        {
          prompt: "Muslim community gathering for Iftar during Ramadan at a mosque, with people from different backgrounds sharing food and conversation. Tables arranged with dates, fruits, and traditional Pakistani dishes. Warm evening lighting, photorealistic style.",
          filename: "community-gathering.jpg"
        }
      ];

      const imagePaths = await generateMultipleImages(themedPrompts);
      res.json({ paths: imagePaths });
    } catch (error: any) {
      console.error("Error generating themed images:", error);
      res.status(500).json({ 
        message: "Error generating themed images", 
        error: error.message 
      });
    }
  });
  
  // API route to generate historical Islamic images
  app.post("/api/generate-history-images", async (req: Request, res: Response) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "Image generation service unavailable. Please try again later or contact the administrator." 
        });
      }

      // Predefined set of historical Islamic images
      const historicalPrompts = [
        {
          prompt: "A detailed illustration of pre-Islamic Arabia showing a desert landscape with tents, camel caravans, trading posts, and the Kaaba in Mecca with idols. Warm colors, realistic artistic style with historical accuracy.",
          filename: "pre-islamic-arabia.jpg"
        },
        {
          prompt: "A respectful and dignified illustration representing the era of Prophet Muhammad (peace be upon him) showing Madinah's landscape with date palms, early Muslims engaged in daily activities, and the first simple mosque structure. No depiction of holy figures, focus on the environment and architecture. Historical accuracy, detailed artistic style.",
          filename: "early-madinah.jpg"
        },
        {
          prompt: "The original Masjid-e-Nabawi (Prophet's Mosque) in Madinah as it would have appeared in 622 CE - a simple structure with date palm trunks as pillars, a roof of palm leaves, and an open courtyard. Include historically accurate details of the surrounding environment. No depiction of holy figures, only architecture and landscape.",
          filename: "original-masjid-nabawi.jpg"
        },
        {
          prompt: "A panoramic view of Baghdad during the Islamic Golden Age (9th century) showing the House of Wisdom, scholars exchanging knowledge, astronomical observatories, libraries, and architectural marvels. Include various people from different backgrounds representing the cosmopolitan nature of Islamic civilization. Detailed, historically accurate illustration.",
          filename: "islamic-golden-age.jpg"
        },
        {
          prompt: "An illustration showing the scientific contributions of Islamic civilization - astronomers with astrolabes, physicians with medical instruments, mathematicians with geometric designs, chemists with laboratory equipment, and architects with building plans. Historical accuracy in clothing and tools, detailed artistic style.",
          filename: "islamic-scientific-contributions.jpg"
        },
        {
          prompt: "An intricate illustration showcasing Islamic art and architecture through the ages - featuring geometric patterns, arabesque designs, calligraphy, miniature paintings, and architectural elements like arches, domes, and minarets from different Islamic periods and regions. Rich in detail and color.",
          filename: "islamic-art-architecture.jpg"
        }
      ];

      const imagePaths = await generateMultipleImages(historicalPrompts);
      res.json({ paths: imagePaths });
    } catch (error: any) {
      console.error("Error generating historical images:", error);
      res.status(500).json({ 
        message: "Error generating historical images", 
        error: error.message 
      });
    }
  });

  // ============== SOCIETY API ROUTES ==============
  
  // Create or initialize society
  app.post("/api/society", async (req, res) => {
    try {
      const validationResult = insertSocietySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid society data", 
          errors: validationResult.error.format() 
        });
      }
      
      const society = await storage.createSociety(validationResult.data);
      res.status(201).json(society);
    } catch (error) {
      res.status(500).json({ message: "Failed to create society" });
    }
  });
  
  // Get society by ID
  app.get("/api/society/:id", async (req, res) => {
    try {
      const societyId = parseInt(req.params.id);
      const society = await storage.getSocietyById(societyId);
      
      if (!society) {
        return res.status(404).json({ message: "Society not found" });
      }
      
      res.json(society);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society" });
    }
  });
  
  // Update society
  app.patch("/api/society/:id", async (req, res) => {
    try {
      const societyId = parseInt(req.params.id);
      const society = await storage.getSocietyById(societyId);
      
      if (!society) {
        return res.status(404).json({ message: "Society not found" });
      }
      
      const updatedSociety = await storage.updateSociety(societyId, req.body);
      res.json(updatedSociety);
    } catch (error) {
      res.status(500).json({ message: "Failed to update society" });
    }
  });
  
  // Create society block
  app.post("/api/society-blocks", async (req, res) => {
    try {
      const validationResult = insertSocietyBlockSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid society block data", 
          errors: validationResult.error.format() 
        });
      }
      
      const block = await storage.createSocietyBlock(validationResult.data);
      res.status(201).json(block);
    } catch (error) {
      res.status(500).json({ message: "Failed to create society block" });
    }
  });
  
  // Get society blocks by society ID
  app.get("/api/society/:societyId/blocks", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      const blocks = await storage.getSocietyBlocks(societyId);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society blocks" });
    }
  });
  
  // Get society block by ID
  app.get("/api/society-blocks/:id", async (req, res) => {
    try {
      const blockId = parseInt(req.params.id);
      const block = await storage.getSocietyBlockById(blockId);
      
      if (!block) {
        return res.status(404).json({ message: "Society block not found" });
      }
      
      res.json(block);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society block" });
    }
  });
  
  // Create society member
  app.post("/api/society-members", async (req, res) => {
    try {
      const validationResult = insertSocietyMemberSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid society member data", 
          errors: validationResult.error.format() 
        });
      }
      
      const member = await storage.createSocietyMember(validationResult.data);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to create society member" });
    }
  });
  
  // Get society members by society ID
  app.get("/api/society/:societyId/members", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      const members = await storage.getSocietyMembers(societyId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society members" });
    }
  });
  
  // Get society member by ID
  app.get("/api/society-members/:id", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const member = await storage.getSocietyMemberById(memberId);
      
      if (!member) {
        return res.status(404).json({ message: "Society member not found" });
      }
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society member" });
    }
  });
  
  // Get society member by user ID
  app.get("/api/society-members/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const member = await storage.getSocietyMemberByUserId(userId);
      
      if (!member) {
        return res.status(404).json({ message: "Society member not found" });
      }
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society member" });
    }
  });
  
  // Update society member
  app.patch("/api/society-members/:id", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const member = await storage.getSocietyMemberById(memberId);
      
      if (!member) {
        return res.status(404).json({ message: "Society member not found" });
      }
      
      const updatedMember = await storage.updateSocietyMember(memberId, req.body);
      res.json(updatedMember);
    } catch (error) {
      res.status(500).json({ message: "Failed to update society member" });
    }
  });
  
  // Create society contribution/payment
  app.post("/api/society-contributions", async (req, res) => {
    try {
      const validationResult = insertSocietyContributionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid society contribution data", 
          errors: validationResult.error.format() 
        });
      }
      
      const contribution = await storage.createSocietyContribution(validationResult.data);
      res.status(201).json(contribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to create society contribution" });
    }
  });
  
  // Get society contributions by society ID
  app.get("/api/society/:societyId/contributions", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      const contributions = await storage.getSocietyContributions(societyId);
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society contributions" });
    }
  });
  
  // Get society contributions by member ID
  app.get("/api/society-members/:memberId/contributions", async (req, res) => {
    try {
      const memberId = parseInt(req.params.memberId);
      const contributions = await storage.getSocietyContributionsByMember(memberId);
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member contributions" });
    }
  });
  
  // Get society contribution by ID
  app.get("/api/society-contributions/:id", async (req, res) => {
    try {
      const contributionId = parseInt(req.params.id);
      const contribution = await storage.getSocietyContributionById(contributionId);
      
      if (!contribution) {
        return res.status(404).json({ message: "Society contribution not found" });
      }
      
      res.json(contribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society contribution" });
    }
  });
  
  // Create society expense
  app.post("/api/society-expenses", async (req, res) => {
    try {
      const validationResult = insertSocietyExpenseSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid society expense data", 
          errors: validationResult.error.format() 
        });
      }
      
      const expense = await storage.createSocietyExpense(validationResult.data);
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to create society expense" });
    }
  });
  
  // Get society expenses by society ID
  app.get("/api/society/:societyId/expenses", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      const expenses = await storage.getSocietyExpenses(societyId);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society expenses" });
    }
  });
  
  // Get society expense by ID
  app.get("/api/society-expenses/:id", async (req, res) => {
    try {
      const expenseId = parseInt(req.params.id);
      const expense = await storage.getSocietyExpenseById(expenseId);
      
      if (!expense) {
        return res.status(404).json({ message: "Society expense not found" });
      }
      
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch society expense" });
    }
  });
  
  // Create discussion
  app.post("/api/discussions", async (req, res) => {
    try {
      const validationResult = insertDiscussionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid discussion data", 
          errors: validationResult.error.format() 
        });
      }
      
      const discussion = await storage.createDiscussion(validationResult.data);
      res.status(201).json(discussion);
    } catch (error) {
      res.status(500).json({ message: "Failed to create discussion" });
    }
  });
  
  // Get discussions by society ID
  app.get("/api/society/:societyId/discussions", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      const discussions = await storage.getDiscussions(societyId);
      res.json(discussions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch discussions" });
    }
  });
  
  // Get discussion by ID
  app.get("/api/discussions/:id", async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const discussion = await storage.getDiscussionById(discussionId);
      
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      
      res.json(discussion);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch discussion" });
    }
  });
  
  // Update discussion status
  app.patch("/api/discussions/:id/status", async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['open', 'closed', 'resolved'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const discussion = await storage.updateDiscussionStatus(discussionId, status);
      
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      
      res.json(discussion);
    } catch (error) {
      res.status(500).json({ message: "Failed to update discussion status" });
    }
  });
  
  // Create discussion comment
  app.post("/api/discussion-comments", async (req, res) => {
    try {
      const validationResult = insertDiscussionCommentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid discussion comment data", 
          errors: validationResult.error.format() 
        });
      }
      
      const comment = await storage.createDiscussionComment(validationResult.data);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create discussion comment" });
    }
  });
  
  // Get discussion comments by discussion ID
  app.get("/api/discussions/:discussionId/comments", async (req, res) => {
    try {
      const discussionId = parseInt(req.params.discussionId);
      const comments = await storage.getDiscussionComments(discussionId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch discussion comments" });
    }
  });
  
  // Create proposal
  app.post("/api/proposals", async (req, res) => {
    try {
      const validationResult = insertProposalSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid proposal data", 
          errors: validationResult.error.format() 
        });
      }
      
      const proposal = await storage.createProposal(validationResult.data);
      res.status(201).json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });
  
  // Get proposals by society ID
  app.get("/api/society/:societyId/proposals", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      const proposals = await storage.getProposals(societyId);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  
  // Get proposal by ID
  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getProposalById(proposalId);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });
  
  // Update proposal status
  app.patch("/api/proposals/:id/status", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['draft', 'voting', 'approved', 'rejected', 'implemented'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const proposal = await storage.updateProposalStatus(proposalId, status);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update proposal status" });
    }
  });
  
  // Create vote
  app.post("/api/votes", async (req, res) => {
    try {
      const validationResult = insertVoteSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid vote data", 
          errors: validationResult.error.format() 
        });
      }
      
      // Check if user has already voted on this proposal
      const userId = validationResult.data.userId;
      const proposalId = validationResult.data.proposalId;
      
      if (typeof userId !== 'number' || typeof proposalId !== 'number') {
        return res.status(400).json({ message: "Invalid userId or proposalId" });
      }
      
      const existingVote = await storage.getUserVoteOnProposal(userId, proposalId);
      
      if (existingVote) {
        return res.status(400).json({ message: "User has already voted on this proposal" });
      }
      
      const vote = await storage.createVote(validationResult.data);
      res.status(201).json(vote);
    } catch (error) {
      res.status(500).json({ message: "Failed to create vote" });
    }
  });
  
  // Get votes by proposal ID
  app.get("/api/proposals/:proposalId/votes", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.proposalId);
      const votes = await storage.getVotesByProposal(proposalId);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposal votes" });
    }
  });
  
  // Get user vote on specific proposal
  app.get("/api/proposals/:proposalId/votes/:userId", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.proposalId);
      const userId = parseInt(req.params.userId);
      
      const vote = await storage.getUserVoteOnProposal(userId, proposalId);
      
      if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
      }
      
      res.json(vote);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user vote" });
    }
  });
  
  // API to summarize monthly contributions and expenses for a society
  app.get("/api/society/:societyId/financial-summary", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      
      // Get all contributions for this society
      const contributions = await storage.getSocietyContributions(societyId);
      
      // Get all expenses for this society
      const expenses = await storage.getSocietyExpenses(societyId);
      
      // Calculate total contributions amount
      const totalContributions = contributions.reduce((sum, contribution) => {
        return sum + Number(contribution.amount);
      }, 0);
      
      // Calculate total expenses amount
      const totalExpenses = expenses.reduce((sum, expense) => {
        return sum + Number(expense.amount);
      }, 0);
      
      // Calculate current balance
      const currentBalance = totalContributions - totalExpenses;
      
      // Group contributions by month
      const contributionsByMonth: Record<string, number> = {};
      contributions.forEach(contribution => {
        if (contribution.monthYear) {
          contributionsByMonth[contribution.monthYear] = 
            (contributionsByMonth[contribution.monthYear] || 0) + Number(contribution.amount);
        }
      });
      
      // Group expenses by category
      const expensesByCategory: Record<string, number> = {};
      expenses.forEach(expense => {
        expensesByCategory[expense.category] = 
          (expensesByCategory[expense.category] || 0) + Number(expense.amount);
      });
      
      // Get collection status for current month
      const currentDate = new Date();
      const currentMonthYear = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
      
      // Get society to determine expected monthly total
      const society = await storage.getSocietyById(societyId);
      
      if (!society) {
        return res.status(404).json({ message: "Society not found" });
      }
      
      const expectedMonthlyTotal = Number(society.monthlyContribution) * society.totalFlats;
      const actualMonthlyCollection = contributionsByMonth[currentMonthYear] || 0;
      const collectionRate = expectedMonthlyTotal > 0 
        ? (actualMonthlyCollection / expectedMonthlyTotal) * 100 
        : 0;
      
      // Return the summary
      res.json({
        societyId,
        totalContributions,
        totalExpenses,
        currentBalance,
        contributionsByMonth,
        expensesByCategory,
        currentMonth: {
          monthYear: currentMonthYear,
          expectedTotal: expectedMonthlyTotal,
          actualCollection: actualMonthlyCollection,
          collectionRate: Math.round(collectionRate),
          pendingAmount: expectedMonthlyTotal - actualMonthlyCollection
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial summary" });
    }
  });
  
  // API to get pending contributions for each flat in the current month
  app.get("/api/society/:societyId/pending-contributions", async (req, res) => {
    try {
      const societyId = parseInt(req.params.societyId);
      
      // Get society to determine expected monthly contribution
      const society = await storage.getSocietyById(societyId);
      
      if (!society) {
        return res.status(404).json({ message: "Society not found" });
      }
      
      // Get all blocks in this society
      const blocks = await storage.getSocietyBlocks(societyId);
      
      // Get all members in this society
      const members = await storage.getSocietyMembers(societyId);
      
      // Get all contributions for this society
      const contributions = await storage.getSocietyContributions(societyId);
      
      // Current month and year
      const currentDate = new Date();
      const currentMonthYear = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
      
      // Filter contributions for the current month
      const currentMonthContributions = contributions.filter(
        contribution => contribution.monthYear === currentMonthYear
      );
      
      // Create a map of block ID to block name
      const blockMap: Record<number, string> = {};
      blocks.forEach(block => {
        blockMap[block.id] = block.blockName;
      });
      
      // Prepare the list of all flats and their payment status
      const flatStatuses = members.map(member => {
        // Find contribution for this member in the current month
        const memberContribution = currentMonthContributions.find(
          contribution => contribution.memberId === member.id
        );
        
        const blockName = member.blockId && blockMap[member.blockId] ? blockMap[member.blockId] : 'Unknown';
        
        return {
          memberId: member.id,
          userId: member.userId,
          blockName,
          flatNumber: member.flatNumber,
          fullAddress: `${blockName}-${member.flatNumber}`,
          expectedAmount: Number(society.monthlyContribution),
          paidAmount: memberContribution ? Number(memberContribution.amount) : 0,
          status: memberContribution ? 'paid' : 'pending',
          pendingAmount: memberContribution 
            ? 0 
            : Number(society.monthlyContribution),
          phoneNumber: member.phoneNumber || 'Not provided'
        };
      });
      
      // Return the pending contributions data
      res.json({
        societyId,
        societyName: society.name,
        monthYear: currentMonthYear,
        monthlyContribution: Number(society.monthlyContribution),
        flats: flatStatuses
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending contributions" });
    }
  });

  // Initialize Society with Blocks API for Masjid Society
  app.post("/api/initialize-masjid-society", async (req, res) => {
    try {
      // 1. Create the society
      const societyData = {
        name: "FGEHF D Blocks",
        description: "Housing society for Jamia Masjid Nabvi Qureshi Hashmi",
        monthlyContribution: "1500",
        totalBlocks: 22,
        totalFlats: 176,
      };
      
      const society = await storage.createSociety(societyData);
      
      // 2. Create all 22 blocks (D-1 to D-22)
      const blocks = [];
      for (let i = 1; i <= 22; i++) {
        const blockData = {
          societyId: society.id,
          blockName: `D-${i}`,
          flatsCount: 8, // 8 flats per block
        };
        
        const block = await storage.createSocietyBlock(blockData);
        blocks.push(block);
      }
      
      res.status(201).json({
        message: "Masjid society initialized successfully",
        society,
        blocks
      });
    } catch (error) {
      console.error("Error initializing masjid society:", error);
      res.status(500).json({ message: "Failed to initialize masjid society" });
    }
  });
  
  // Handle payment submissions for both community and madrasa fees
  app.post("/api/payments/submit", upload.single("receipt"), async (req, res) => {
    try {
      // Extract data from request
      const { reference, date, amount, type, notes } = req.body;
      const receipt = req.file;
      
      if (!receipt) {
        return res.status(400).json({ message: "Receipt file is required" });
      }
      
      if (!reference || !date || !amount) {
        return res.status(400).json({ message: "Reference, date, and amount are required fields" });
      }
      
      // Create a record for the payment
      const paymentData = {
        reference,
        date: new Date(date),
        amount: parseFloat(amount),
        paymentType: type,
        receiptPath: receipt.path,
        notes: notes || "",
        status: "pending", // Starts as pending until admin verification
        createdAt: new Date()
      };
      
      // For demo/prototype, we'll log the payment data
      console.log("Payment submitted:", paymentData);
      
      // In a real implementation, you would save this to the database
      // For example:
      // const payment = await storage.createPayment(paymentData);
      
      // Return success response
      res.status(201).json({ 
        message: "Payment submitted successfully", 
        receiptFilename: receipt.filename 
      });
      
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
