import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonationSchema, insertEnrollmentSchema, insertMessageSchema, insertSubscriberSchema } from "@shared/schema";
import axios from "axios";
import Stripe from "stripe";
import { generateImage, generateMultipleImages } from "./image-generation";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY. Stripe payments will not be processed.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

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
      
      const donation = await storage.createDonation(validationResult.data);
      res.status(201).json(donation);
    } catch (error) {
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

  const httpServer = createServer(app);
  return httpServer;
}
