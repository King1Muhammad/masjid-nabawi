import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonationSchema, insertEnrollmentSchema, insertMessageSchema, insertSubscriberSchema } from "@shared/schema";
import axios from "axios";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY. Stripe payments will not be processed.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for prayer times
  app.get("/api/prayer-times", async (req, res) => {
    try {
      const { city = "Islamabad", country = "Pakistan" } = req.query;
      const response = await axios.get(`http://api.aladhan.com/v1/timingsByCity`, {
        params: {
          city,
          country,
          method: 2 // Islamic Society of North America calculation method
        }
      });
      
      const data = response.data;
      if (data.code === 200 && data.status === "OK") {
        res.json(data.data.timings);
      } else {
        res.status(500).json({ message: "Failed to fetch prayer times" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prayer times" });
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

  const httpServer = createServer(app);
  return httpServer;
}
