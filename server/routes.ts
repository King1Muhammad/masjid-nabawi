import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { eq, sql, and } from "drizzle-orm";
import { format } from "date-fns";
import * as schema from "@shared/schema";
import { recreateAdminHierarchy } from "./seed-admins";
import 'express-session';
import { Session, SessionData } from 'express-session';

// Use the User type from schema
type AdminUser = schema.User;

declare module 'express-session' {
  interface SessionData {
    adminUser?: AdminUser;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<SessionData>;
    }
  }
}

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
  insertVoteSchema,
  insertUserSchema
} from "@shared/schema";
import axios from "axios";
import Stripe from "stripe";
import { generateImage, generateMultipleImages } from "./image-generation";
import { sendEnrollmentNotification, sendContactMessageNotification } from "./email-service";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { or } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

// Hash passwords for security
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Verify passwords
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

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

import { donations, Donation } from "@shared/schema";

// Nodemailer setup for sending emails
import nodemailer from 'nodemailer';

// Configure email transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'jamiamasjidnabviqureshihashmi@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Function to send donation receipt email
const sendDonationReceipt = async (donation: Donation) => {
  try {
    const transporter = createTransporter();
    
    // Format the donation amount
    const formattedAmount = parseFloat(donation.amount.toString()).toLocaleString();
    
    // Get payment method display name
    let paymentMethodDisplay = 'Bank Transfer';
    if (donation.paymentMethod === 'easypaisa') paymentMethodDisplay = 'EasyPaisa';
    if (donation.paymentMethod === 'jazzcash') paymentMethodDisplay = 'JazzCash';
    if (donation.paymentMethod === 'nayapay') paymentMethodDisplay = 'JS Bank Zindagi';
    if (donation.paymentMethod === 'crypto_trc20') paymentMethodDisplay = 'TRC20 Crypto';
    if (donation.paymentMethod === 'crypto_bnb') paymentMethodDisplay = 'BNB Crypto';
    
    // Format date
    const donationDate = new Date(donation.createdAt || new Date()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Donation Receipt</h1>
          <h2 style="margin: 5px 0 0 0;">Jamia Masjid Nabvi Qureshi Hashmi</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Assalamu Alaikum ${donation.firstName} ${donation.lastName},</p>
          
          <p>JazakAllah Khair for your generous contribution. Your donation will help us build and maintain Masjid-e-Nabawi's model in Islamabad.</p>
          
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #0C6E4E; margin-top: 0;">Donation Details:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Receipt Number:</td>
                <td>${donation.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                <td>PKR ${formattedAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td>${donationDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Donation Type:</td>
                <td>${donation.donationType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Campaign:</td>
                <td>${donation.campaign}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Payment Method:</td>
                <td>${paymentMethodDisplay}</td>
              </tr>
              ${donation.transactionId ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Transaction ID:</td>
                <td>${donation.transactionId}</td>
              </tr>
              ` : ''}
              ${donation.paymentProofUrl ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Payment Proof:</td>
                <td><a href="${process.env.BASE_URL || 'https://masjidenabawismodel.com'}${donation.paymentProofUrl}" target="_blank" style="color: #0C6E4E;">View Receipt</a></td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <p>This donation receipt is for your records. May Allah accept your contribution and reward you abundantly in this world and the hereafter.</p>
          
          <p style="margin-top: 30px;">Sincerely,<br>Administration<br>Jamia Masjid Nabvi Qureshi Hashmi<br>Islamabad, Pakistan</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
            <p>For any inquiries, please contact us at:<br>
            Email: ${process.env.EMAIL_ADMIN || 'admin@masjidenabawismodel.com'}<br>
            Phone: +92 3339214600</p>
            
            <p>Jamia Masjid Nabvi Qureshi Hashmi<br>
            Opposite D-13 Block, FGEHF G-11/4, Islamabad, Pakistan</p>
          </div>
        </div>
      </div>
    `;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Masjid-e-Nabawi Islamabad" <jamiamasjidnabviqureshihashmi@gmail.com>',
      to: donation.email,
      subject: 'Thank You for Your Donation - Receipt',
      html: htmlContent,
    });
    
    // Also send a copy to masjid admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Masjid-e-Nabawi Islamabad" <jamiamasjidnabviqureshihashmi@gmail.com>',
      to: process.env.EMAIL_ADMIN || 'jamiamasjidnabviqureshihashmi@gmail.com',
      subject: `New Donation Received: ${donation.firstName} ${donation.lastName} - PKR ${formattedAmount}`,
      html: htmlContent,
    });
    
    // Update receipt sent status in database
    await db.update(donations)
      .set({ receiptSent: true })
      .where(eq(donations.id, donation.id));
      
    console.log(`Donation receipt sent to ${donation.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send donation receipt:', error);
    return false;
  }
};

// Function to send thank you notification
const sendThankYouNotification = async (donation: Donation) => {
  try {
    const transporter = createTransporter();
    
    // Email template for thank you message
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">JazakAllah Khair</h1>
          <h2 style="margin: 5px 0 0 0;">Jamia Masjid Nabvi Qureshi Hashmi</h2>
        </div>
        
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 18px;">Assalamu Alaikum ${donation.firstName} ${donation.lastName},</p>
          
          <p style="font-size: 16px;">We are deeply grateful for your generous contribution of <strong>PKR ${parseFloat(donation.amount.toString()).toLocaleString()}</strong> to our ${donation.campaign}
          
          <div style="margin: 30px 0;">
            <p style="font-style: italic; font-size: 20px; color: #0C6E4E;">
              "The likeness of those who spend their wealth in the way of Allah is as the likeness of a grain that sprouts seven spikes. In every spike there are 100 grains. And Allah multiplies for whom He wills."
            </p>
            <p style="text-align: right; margin-top: 10px;">— Surah Al-Baqarah 2:261</p>
          </div>
          
          <p>Your contribution helps us continue our mission to establish a model of Masjid-e-Nabawi in Islamabad, providing a place of worship, education, and community support.</p>
          
          <p style="margin-top: 30px;">May Allah accept your donation and reward you with goodness in this world and the hereafter.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666;">
            <p>For any inquiries, please contact us at:<br>
            Email: ${process.env.EMAIL_ADMIN || 'admin@masjidenabawismodel.com'}<br>
            Phone: +92 3339214600</p>
          </div>
        </div>
      </div>
    `;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Masjid-e-Nabawi Islamabad" <jamiamasjidnabviqureshihashmi@gmail.com>',
      to: donation.email,
      subject: 'JazakAllah Khair for Your Donation',
      html: htmlContent,
    });
    
    // Update donor thanked status in database
    await db.update(donations)
      .set({ donorThanked: true })
      .where(eq(donations.id, donation.id));
      
    console.log(`Thank you notification sent to ${donation.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send thank you notification:', error);
    return false;
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin Hierarchy Reset Route
  app.post('/api/admin/reset-hierarchy', async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated as an admin
      if (!req.session.adminUser) {
        return res.status(401).json({ message: 'Unauthorized. You must be logged in as an admin.' });
      }
      
      // Only process the request if there's an admin session
      const result = await recreateAdminHierarchy();
      
      if (result.success) {
        res.status(200).json({ 
          message: 'Admin hierarchy reset successfully. Created United Nations global admin and full hierarchy.'
        });
      } else {
        res.status(500).json({ message: result.message });
      }
    } catch (error) {
      console.error('Error resetting admin hierarchy:', error);
      res.status(500).json({ message: 'Failed to reset admin hierarchy' });
    }
  });

  // For testing purposes, allow unauthenticated reset during development
  app.post('/api/admin/reset-hierarchy-dev', async (req: Request, res: Response) => {
    try {
      const result = await recreateAdminHierarchy();
      
      if (result.success) {
        res.status(200).json({ 
          message: 'Admin hierarchy reset successfully. Created United Nations global admin and full hierarchy.'
        });
      } else {
        res.status(500).json({ message: result.message });
      }
    } catch (error) {
      console.error('Error resetting admin hierarchy:', error);
      res.status(500).json({ message: 'Failed to reset admin hierarchy' });
    }
  });

  // Admin API Routes
  app.get('/api/admins', async (req: Request, res: Response) => {
    try {
      const { level } = req.query;
      
      // Fetch admin users based on role/level if specified
      let adminUsers;
      if (level) {
        // Convert front-end level to role format
        let roleQuery = `${level}_admin`;
        
        // Support for legacy format where role might be passed as the full role name
        if (level === 'global_admin' || level === 'country_admin' || 
            level === 'city_admin' || level === 'community_admin' || 
            level === 'society_admin') {
          roleQuery = level as string;
        }
        
        adminUsers = await db.query.users.findMany({
          where: eq(schema.users.role, roleQuery)
        });
      } else {
        // Fetch all users with admin roles
        adminUsers = await db.query.users.findMany({
          where: or(
            eq(schema.users.role, 'global_admin'),
            eq(schema.users.role, 'country_admin'),
            eq(schema.users.role, 'city_admin'),
            eq(schema.users.role, 'community_admin'),
            eq(schema.users.role, 'society_admin')
          )
        });
      }
      
      // Map to safe admin objects (exclude password, etc.)
      const safeAdmins = adminUsers.map(admin => ({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
        location: admin.location,
        approvedById: admin.approvedById,
        latitude: admin.latitude,
        longitude: admin.longitude,
        cnic: admin.cnic,
        phoneNumber: admin.phoneNumber
      }));
      
      res.json(safeAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      res.status(500).json({ message: 'Failed to fetch admin users' });
    }
  });
  
  app.post('/api/admins', async (req: Request, res: Response) => {
    try {
      const { name, username, email, password, role, createdBy } = req.body;
      
      // Validate input
      if (!name || !username || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if username or email already exists
      const existingUser = await db.query.users.findFirst({
        where: or(
          eq(schema.users.username, username),
          eq(schema.users.email, email)
        )
      });
      
      if (existingUser) {
        return res.status(409).json({ 
          message: 'Username or email already exists' 
        });
      }
      
      // Create admin user
      const hashedPassword = await hashPassword(password);
      
      const [newAdmin] = await db.insert(schema.users)
        .values({
          name,
          username,
          email,
          password: hashedPassword,
          role,
          // is_admin field is no longer used, we check role instead
          status: 'pending', // New admins start as pending
          createdAt: new Date(),
          createdBy: createdBy || null
        })
        .returning();
      
      // Send email notification to administrator
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: '"Society Management System" <jamiamasjidnabviqureshihashmi@gmail.com>',
          to: 'jamiamasjidnabviqureshihashmi@gmail.com', // Send to main admin email
          subject: 'New Admin Registration',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">New Admin Registration</h1>
                <h2 style="margin: 5px 0 0 0;">Society Management System</h2>
              </div>
              
              <div style="padding: 20px;">
                <p>A new admin account registration has been submitted:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Username:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${username}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Role:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${role}</td>
                  </tr>
                </table>
                
                <p>Please review and approve this admin account from the admin dashboard.</p>
                
                <p style="margin-top: 30px;">Regards,<br>Society Management System</p>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error sending admin registration notification:', emailError);
        // Continue even if email fails
      }
      
      // Return safe admin object (exclude password)
      const safeAdmin = {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        status: newAdmin.status,
        createdAt: newAdmin.createdAt
      };
      
      res.status(201).json(safeAdmin);
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ message: 'Failed to create admin user' });
    }
  });
  
  // Admin registration and authentication routes
  app.post('/api/admin/register', async (req: Request, res: Response) => {
    try {
      const { name, username, email, password, role } = req.body;
      
      // Validate input
      if (!name || !username || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if username or email already exists
      const existingUser = await db.query.users.findFirst({
        where: or(
          eq(schema.users.username, username),
          eq(schema.users.email, email)
        )
      });
      
      if (existingUser) {
        return res.status(409).json({ 
          message: 'Username or email already exists' 
        });
      }
      
      // Create admin user with pending status
      const hashedPassword = await hashPassword(password);
      
      const [newAdmin] = await db.insert(schema.users)
        .values({
          name,
          username,
          email,
          password: hashedPassword,
          role,
          // is_admin field is no longer used, we check role instead
          status: 'pending', // New admins start as pending
          createdAt: new Date()
        })
        .returning();
      
      // Return safe admin object (exclude password)
      const safeAdmin = {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        status: newAdmin.status,
        createdAt: newAdmin.createdAt
      };
      
      res.status(201).json(safeAdmin);
    } catch (error) {
      console.error('Error registering admin:', error);
      res.status(500).json({ message: 'Failed to register admin account' });
    }
  });
  
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Find the admin user with admin role
      const admin = await db.query.users.findFirst({
        where: and(
          eq(schema.users.username, username),
          or(
            eq(schema.users.role, 'global_admin'),
            eq(schema.users.role, 'country_admin'),
            eq(schema.users.role, 'city_admin'),
            eq(schema.users.role, 'community_admin'),
            eq(schema.users.role, 'society_admin')
          )
        )
      });
      
      if (!admin) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Check if account is not active
      if (admin.status !== 'active') {
        return res.status(403).json({ 
          message: admin.status === 'pending' 
            ? 'Your admin account is pending approval' 
            : 'Your admin account is suspended' 
        });
      }
      
      // Verify password
      const isPasswordValid = await comparePasswords(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Update last login timestamp
      await db.update(schema.users)
        .set({ 
          lastLogin: new Date()
        })
        .where(eq(schema.users.id, admin.id));
      
      // Return safe admin object (exclude password)
      const safeAdmin = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        status: admin.status,
        lastLogin: new Date().toISOString(),
        managedEntities: admin.managedEntities || []
      };
      
      // Set session data
      if (req.session) {
        req.session.adminUser = safeAdmin;
      }
      
      res.status(200).json(safeAdmin);
    } catch (error) {
      console.error('Error logging in admin:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  
  app.get('/api/admin/current', async (req: Request, res: Response) => {
    try {
      // Check if user is logged in via session
      if (req.session?.adminUser) {
        // Get fresh data from database to ensure it's up to date
        const admin = await db.query.users.findFirst({
          where: eq(schema.users.id, req.session.adminUser.id)
        });
        
        // Check if user exists, has an admin role, and is active
        const isAdminRole = admin?.role && ['global_admin', 'country_admin', 'city_admin', 'community_admin', 'society_admin'].includes(admin.role);
        if (!admin || !isAdminRole || admin.status !== 'active') {
          // Admin no longer exists or is not active
          if (req.session) {
            req.session.adminUser = undefined;
          }
          return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Return safe admin object
        const safeAdmin = {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          status: admin.status,
          lastLogin: admin.lastLogin,
          managedEntities: admin.managedEntities || []
        };
        
        return res.status(200).json(safeAdmin);
      }
      
      res.status(401).json({ message: 'No active admin session' });
    } catch (error) {
      console.error('Error fetching current admin:', error);
      res.status(500).json({ message: 'Failed to fetch current admin' });
    }
  });
  
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    if (req.session) {
      req.session.adminUser = undefined;
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
  
  app.patch('/api/admins/:id/status', async (req: Request, res: Response) => {
    try {
      const adminId = parseInt(req.params.id);
      const { status } = req.body;
      
      // Validate status
      if (!['active', 'pending', 'suspended'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      // Update admin status
      const [updatedAdmin] = await db.update(schema.users)
        .set({ 
          status,
          // If activating, set lastStatusChange
          ...(status === 'active' ? { lastStatusChange: new Date() } : {})
        })
        .where(
          and(
            eq(schema.users.id, adminId),
            or(
              eq(schema.users.role, 'global_admin'),
              eq(schema.users.role, 'country_admin'),
              eq(schema.users.role, 'city_admin'),
              eq(schema.users.role, 'community_admin'),
              eq(schema.users.role, 'society_admin')
            )
          )
        )
        .returning();
      
      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      // Return safe admin object
      const safeAdmin = {
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        role: updatedAdmin.role,
        status: updatedAdmin.status
      };
      
      res.json(safeAdmin);
    } catch (error) {
      console.error('Error updating admin status:', error);
      res.status(500).json({ message: 'Failed to update admin status' });
    }
  });
  
  // Enhanced admin approval with hierarchical validation
  app.post('/api/admins/:id/approve', async (req: Request, res: Response) => {
    try {
      // Authentication check
      if (!req.session.adminUser) {
        return res.status(401).json({ message: 'You must be logged in as an admin to approve other admins' });
      }
      
      const approverRole = req.session.adminUser.role;
      const approverId = req.session.adminUser.id;
      const adminId = parseInt(req.params.id);
      
      // Prevent self-approval
      if (approverId === adminId) {
        return res.status(400).json({ message: 'You cannot approve your own account' });
      }
      
      // Get admin to be approved
      const adminToApprove = await db.query.users.findFirst({
        where: and(
          eq(schema.users.id, adminId),
          or(
            eq(schema.users.role, 'global_admin'),
            eq(schema.users.role, 'country_admin'),
            eq(schema.users.role, 'city_admin'),
            eq(schema.users.role, 'community_admin'),
            eq(schema.users.role, 'society_admin')
          )
        )
      });
      
      if (!adminToApprove) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      // Role level hierarchy for validation
      const roleHierarchy: Record<string, { level: number; parent: string | null }> = {
        global_admin: { level: 1, parent: null },
        global: { level: 2, parent: 'global_admin' },
        country_admin: { level: 3, parent: 'global' },
        country: { level: 4, parent: 'country_admin' },
        city_admin: { level: 5, parent: 'country' },
        city: { level: 6, parent: 'city_admin' },
        community_admin: { level: 7, parent: 'city' },
        community: { level: 8, parent: 'community_admin' },
        society_admin: { level: 9, parent: 'community' },
        society: { level: 10, parent: 'society_admin' }
      };
      
      // Check if approver has high enough role to approve this admin
      const approverLevel = roleHierarchy[approverRole]?.level || 0;
      const targetLevel = roleHierarchy[adminToApprove.role]?.level || 0;
      
      if (approverLevel <= targetLevel) {
        return res.status(403).json({ 
          message: 'You do not have permission to approve an admin at this level. Only higher-level admins can approve.' 
        });
      }
      
      // Check geographical hierarchy using managed_entities
      const managedEntities = adminToApprove.managedEntities ? 
        (typeof adminToApprove.managedEntities === 'string' ? 
          JSON.parse(adminToApprove.managedEntities) : adminToApprove.managedEntities) : {};
      
      const approverEntities = req.session.adminUser.managedEntities ?
        (typeof req.session.adminUser.managedEntities === 'string' ? 
          JSON.parse(req.session.adminUser.managedEntities) : req.session.adminUser.managedEntities) : {};
          
      // Determine if the admin to be approved is within the approver's jurisdiction
      let isWithinJurisdiction = false;
      
      // Global admins can approve anyone
      if (approverRole === 'global_admin' || approverRole === 'global') {
        isWithinJurisdiction = true;
      } 
      // Country admins can approve admins whose country they manage
      else if ((approverRole === 'country_admin' || approverRole === 'country') && managedEntities.country) {
        isWithinJurisdiction = managedEntities.country === req.session.adminUser.username;
      }
      // City admins can approve admins in their city
      else if ((approverRole === 'city_admin' || approverRole === 'city') && managedEntities.city) {
        isWithinJurisdiction = managedEntities.city === req.session.adminUser.username;
      }
      // Community admins can approve admins in their community
      else if ((approverRole === 'community_admin' || approverRole === 'community') && managedEntities.community) {
        isWithinJurisdiction = managedEntities.community === req.session.adminUser.username;
      }
      
      if (!isWithinJurisdiction) {
        return res.status(403).json({ 
          message: 'You do not have jurisdiction to approve this admin. Admins must be in your geographical area of authority.' 
        });
      }

      // All checks passed, update admin status to active
      const [updatedAdmin] = await db.update(schema.users)
        .set({ 
          status: 'active',
          lastStatusChange: new Date()
        })
        .where(
          and(
            eq(schema.users.id, adminId),
            or(
              eq(schema.users.role, 'global_admin'),
              eq(schema.users.role, 'country_admin'),
              eq(schema.users.role, 'city_admin'),
              eq(schema.users.role, 'community_admin'),
              eq(schema.users.role, 'society_admin')
            )
          )
        )
        .returning();
      
      // Send notification email if we have user email
      if (updatedAdmin.email) {
        try {
          const transporter = createTransporter();
          
          // Determine admin level color for email template
          let adminColor = '#0C6E4E'; // Default green for society level
          if (updatedAdmin.role.includes('community')) adminColor = '#2563EB';  // Blue
          if (updatedAdmin.role.includes('city')) adminColor = '#9333EA';       // Purple
          if (updatedAdmin.role.includes('country')) adminColor = '#E11D48';    // Red
          if (updatedAdmin.role.includes('global')) adminColor = '#18181B';     // Black
          
          await transporter.sendMail({
            from: '"Society Management Admin" <jamiamasjidnabviqureshihashmi@gmail.com>',
            to: updatedAdmin.email,
            subject: 'Admin Account Approved',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid ${adminColor}; border-radius: 8px; overflow: hidden;">
                <div style="background-color: ${adminColor}; color: white; padding: 20px; text-align: center;">
                  <h1 style="margin: 0;">Admin Account Approved</h1>
                  <h2 style="margin: 5px 0 0 0;">Masjid Management System</h2>
                </div>
                
                <div style="padding: 20px;">
                  <p>Dear ${updatedAdmin.name},</p>
                  
                  <p>Your admin account has been approved by ${req.session.adminUser.name} (${req.session.adminUser.role}). You can now login to the admin panel with your credentials.</p>
                  
                  <p>Username: <strong>${updatedAdmin.username}</strong></p>
                  <p>Role: <strong>${updatedAdmin.role}</strong></p>
                  
                  <p>Thank you for being part of our global Islamic community governance system!</p>
                  
                  <p style="margin-top: 30px;">Regards,<br>Admin Management</p>
                </div>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
          // Continue even if email fails
        }
      }
      
      res.json({ 
        message: 'Admin approved successfully',
        admin: {
          id: updatedAdmin.id,
          username: updatedAdmin.username,
          email: updatedAdmin.email,
          name: updatedAdmin.name,
          role: updatedAdmin.role,
          status: updatedAdmin.status
        }
      });
    } catch (error) {
      console.error('Error approving admin:', error);
      res.status(500).json({ message: 'Failed to approve admin', error: error.message });
    }
  });
  
  // Society API Routes
  app.get('/api/society/:id', async (req: Request, res: Response) => {
    try {
      const societyId = parseInt(req.params.id);
      const society = await db.query.society.findFirst({
        where: eq(schema.society.id, societyId),
      });
      
      if (!society) {
        return res.status(404).json({ message: 'Society not found' });
      }
      
      res.json(society);
    } catch (error) {
      console.error('Error fetching society:', error);
      res.status(500).json({ message: 'Failed to fetch society' });
    }
  });
  
  app.get('/api/society/:id/blocks', async (req: Request, res: Response) => {
    try {
      const societyId = parseInt(req.params.id);
      const blocks = await db.query.societyBlocks.findMany({
        where: eq(schema.societyBlocks.societyId, societyId),
      });
      
      res.json(blocks);
    } catch (error) {
      console.error('Error fetching blocks:', error);
      res.status(500).json({ message: 'Failed to fetch blocks' });
    }
  });
  
  // Add a new society block
  app.post('/api/society-blocks', async (req: Request, res: Response) => {
    try {
      const { societyId, blockName, flatsCount } = req.body;
      
      // Validate input
      if (!societyId || !blockName || !flatsCount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if society exists
      const society = await db.query.society.findFirst({
        where: eq(schema.society.id, societyId),
      });
      
      if (!society) {
        return res.status(404).json({ message: 'Society not found' });
      }
      
      // Check if block already exists
      const existingBlock = await db.query.societyBlocks.findFirst({
        where: and(
          eq(schema.societyBlocks.societyId, societyId),
          eq(schema.societyBlocks.blockName, blockName)
        ),
      });
      
      if (existingBlock) {
        return res.status(409).json({ message: 'Block already exists' });
      }
      
      // Create the block
      const [newBlock] = await db.insert(schema.societyBlocks)
        .values({
          societyId,
          blockName,
          flatsCount,
        })
        .returning();
      
      res.status(201).json(newBlock);
    } catch (error) {
      console.error('Error creating society block:', error);
      res.status(500).json({ message: 'Failed to create society block' });
    }
  });
  
  // Get all blocks (for admin purposes)
  app.get('/api/society-blocks', async (req: Request, res: Response) => {
    try {
      const blocks = await db.query.societyBlocks.findMany();
      res.json(blocks);
    } catch (error) {
      console.error('Error fetching all blocks:', error);
      res.status(500).json({ message: 'Failed to fetch blocks' });
    }
  });
  
  // Update a society block
  app.patch('/api/society-blocks/:id', async (req: Request, res: Response) => {
    try {
      const blockId = parseInt(req.params.id);
      const { blockName, flatsCount } = req.body;
      
      // Ensure at least one field to update
      if (!blockName && flatsCount === undefined) {
        return res.status(400).json({ message: 'No fields to update' });
      }
      
      // Create update object based on provided fields
      const updateData: any = {};
      if (blockName) updateData.blockName = blockName;
      if (flatsCount !== undefined) updateData.flatsCount = flatsCount;
      
      // Update the block
      const [updatedBlock] = await db.update(schema.societyBlocks)
        .set(updateData)
        .where(eq(schema.societyBlocks.id, blockId))
        .returning();
      
      if (!updatedBlock) {
        return res.status(404).json({ message: 'Block not found' });
      }
      
      res.json(updatedBlock);
    } catch (error) {
      console.error('Error updating society block:', error);
      res.status(500).json({ message: 'Failed to update society block' });
    }
  });
  
  // Delete a society block
  app.delete('/api/society-blocks/:id', async (req: Request, res: Response) => {
    try {
      const blockId = parseInt(req.params.id);
      
      // Check if block exists
      const block = await db.query.societyBlocks.findFirst({
        where: eq(schema.societyBlocks.id, blockId),
      });
      
      if (!block) {
        return res.status(404).json({ message: 'Block not found' });
      }
      
      // Check if block has members
      const memberCount = await db.select({ count: sql`count(*)` })
        .from(schema.societyMembers)
        .where(eq(schema.societyMembers.blockId, blockId));
      
      if (memberCount[0].count > 0) {
        return res.status(409).json({ 
          message: 'Cannot delete block with members. Remove members first.' 
        });
      }
      
      // Delete the block
      await db.delete(schema.societyBlocks)
        .where(eq(schema.societyBlocks.id, blockId));
      
      res.status(200).json({ message: 'Block deleted successfully' });
    } catch (error) {
      console.error('Error deleting society block:', error);
      res.status(500).json({ message: 'Failed to delete society block' });
    }
  });
  
  app.get('/api/society/:id/financial-summary', async (req: Request, res: Response) => {
    try {
      const societyId = parseInt(req.params.id);
      const currentMonth = format(new Date(), 'yyyy-MM');
      
      // Get society details
      const society = await db.query.society.findFirst({
        where: eq(schema.society.id, societyId)
      });
      
      if (!society) {
        return res.status(404).json({ message: 'Society not found' });
      }
      
      // Get total contributions
      const contributionsResult = await db.select({
        total: sql`sum(${schema.societyContributions.amount})`
      })
      .from(schema.societyContributions)
      .where(eq(schema.societyContributions.societyId, societyId));
      
      const totalContributions = Number(contributionsResult[0]?.total || 0);
      
      // Get total expenses
      const expensesResult = await db.select({
        total: sql`sum(${schema.societyExpenses.amount})`
      })
      .from(schema.societyExpenses)
      .where(eq(schema.societyExpenses.societyId, societyId));
      
      const totalExpenses = Number(expensesResult[0]?.total || 0);
      
      // Calculate current balance
      const currentBalance = totalContributions - totalExpenses;
      
      // Get contributions for current month
      const currentMonthContributions = await db.select({
        total: sql`sum(${schema.societyContributions.amount})`
      })
      .from(schema.societyContributions)
      .where(
        and(
          eq(schema.societyContributions.societyId, societyId),
          eq(schema.societyContributions.monthYear, currentMonth)
        )
      );
      
      const currentMonthTotal = Number(currentMonthContributions[0]?.total || 0);
      
      // Get member count for expected contribution calculation
      const membersCount = await db.select({
        count: sql`count(${schema.societyMembers.id})`
      })
      .from(schema.societyMembers)
      .innerJoin(
        schema.societyBlocks,
        eq(schema.societyMembers.blockId, schema.societyBlocks.id)
      )
      .where(
        and(
          eq(schema.societyBlocks.societyId, societyId),
          eq(schema.societyMembers.status, 'active')
        )
      );
      
      const activeMembers = Number(membersCount[0]?.count || 0);
      const expectedMonthlyTotal = activeMembers * society.monthlyContribution;
      
      // Calculate collection rate
      const collectionRate = expectedMonthlyTotal > 0 
        ? Math.round((currentMonthTotal / expectedMonthlyTotal) * 100)
        : 0;
      
      // Calculate previous month data
      const prevDate = new Date();
      prevDate.setMonth(prevDate.getMonth() - 1);
      const prevMonth = format(prevDate, 'yyyy-MM');
      
      const prevMonthContributions = await db.select({
        total: sql`sum(${schema.societyContributions.amount})`
      })
      .from(schema.societyContributions)
      .where(
        and(
          eq(schema.societyContributions.societyId, societyId),
          eq(schema.societyContributions.monthYear, prevMonth)
        )
      );
      
      const prevMonthTotal = Number(prevMonthContributions[0]?.total || 0);
      
      // Get expenses by category
      const expensesByCategory = await db.select({
        category: schema.societyExpenses.category,
        total: sql`sum(${schema.societyExpenses.amount})`
      })
      .from(schema.societyExpenses)
      .where(eq(schema.societyExpenses.societyId, societyId))
      .groupBy(schema.societyExpenses.category);
      
      // Format expenses by category for easy frontend consumption
      const expensesByCategoryObj: Record<string, number> = {};
      expensesByCategory.forEach(item => {
        expensesByCategoryObj[item.category] = Number(item.total);
      });
      
      // Get contributions by month for chart
      const contributionsByMonth = await db.select({
        monthYear: schema.societyContributions.monthYear,
        total: sql`sum(${schema.societyContributions.amount})`
      })
      .from(schema.societyContributions)
      .where(eq(schema.societyContributions.societyId, societyId))
      .groupBy(schema.societyContributions.monthYear)
      .orderBy(schema.societyContributions.monthYear);
      
      // Format contributions by month for easy frontend consumption
      const contributionsByMonthObj: Record<string, number> = {};
      contributionsByMonth.forEach(item => {
        contributionsByMonthObj[item.monthYear] = Number(item.total);
      });
      
      // Calculate collection rate for previous month
      const prevMonthRate = expectedMonthlyTotal > 0 
        ? Math.round((prevMonthTotal / expectedMonthlyTotal) * 100)
        : 0;
      
      // Build the summary object
      const summary = {
        societyId,
        totalContributions,
        totalExpenses,
        currentBalance,
        contributionsByMonth: contributionsByMonthObj,
        expensesByCategory: expensesByCategoryObj,
        currentMonth: {
          monthYear: currentMonth,
          expectedTotal: expectedMonthlyTotal,
          actualCollection: currentMonthTotal,
          pendingAmount: expectedMonthlyTotal - currentMonthTotal,
          collectionRate
        },
        previousMonth: {
          monthYear: prevMonth,
          expectedTotal: expectedMonthlyTotal,
          actualCollection: prevMonthTotal,
          pendingAmount: expectedMonthlyTotal - prevMonthTotal,
          collectionRate: prevMonthRate
        }
      };
      
      res.json(summary);
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      res.status(500).json({ message: 'Failed to fetch financial summary' });
    }
  });
  
  app.get('/api/society/member', async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      
      // In production, this would query the database to retrieve the member's details
      // For now, return a mock user with consistent data
      const memberInfo = {
        id: 1,
        userId: userId,
        name: 'Muhammad Qureshi',
        blockName: 'D-8',
        flatNumber: '4',
        email: 'muhammad@example.com',
        phoneNumber: '+923339214600',
        isOwner: true,
        status: 'active',
        cnic: '12345-1234567-1',
        personalNumber: '101-D8-4'
      };
      
      res.json(memberInfo);
    } catch (error) {
      console.error('Error fetching member:', error);
      res.status(500).json({ message: 'Failed to fetch member information' });
    }
  });
  
  app.get('/api/society/member/contributions', async (req: Request, res: Response) => {
    try {
      // Mock contributions data - would be fetched from DB in real implementation
      const contributions = [
        {
          id: 1,
          month: 'April 2025',
          amount: 1500,
          paymentDate: '2025-04-05T00:00:00Z',
          paymentMethod: 'Bank Transfer',
          monthYear: '2025-04',
          status: 'completed',
          receiptNumber: 'SOC-25001'
        },
        {
          id: 2,
          month: 'March 2025',
          amount: 1500,
          paymentDate: '2025-03-03T00:00:00Z',
          paymentMethod: 'EasyPaisa',
          monthYear: '2025-03',
          status: 'completed',
          receiptNumber: 'SOC-24080'
        },
        {
          id: 3,
          month: 'February 2025',
          amount: 1500,
          paymentDate: '2025-02-05T00:00:00Z',
          paymentMethod: 'Cash',
          monthYear: '2025-02',
          status: 'completed',
          receiptNumber: 'SOC-24025'
        }
      ];
      
      res.json(contributions);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      res.status(500).json({ message: 'Failed to fetch contributions' });
    }
  });
  
  app.get('/api/society/member/notifications', async (req: Request, res: Response) => {
    try {
      // This would normally be fetched from a notifications table
      const notifications = [
        {
          id: 1,
          title: 'Monthly Contribution Due',
          message: 'Your monthly contribution of PKR 1,500 for May 2025 is due. Please make the payment before the 10th.',
          date: '2025-04-30T00:00:00Z',
          isRead: false,
          type: 'payment'
        },
        {
          id: 2,
          title: 'New Proposal Added',
          message: 'A new proposal for "Playground Renovation" has been added. Please review and cast your vote.',
          date: '2025-04-25T00:00:00Z',
          isRead: true,
          type: 'proposal'
        },
        {
          id: 3,
          title: 'Community Meeting',
          message: 'A community meeting is scheduled for Sunday, May 5th at 7:30 PM in the community hall.',
          date: '2025-04-20T00:00:00Z',
          isRead: true,
          type: 'event'
        }
      ];
      
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });
  
  // Society Member Registration and Authentication
  app.post('/api/society/register', async (req: Request, res: Response) => {
    try {
      const userValidation = insertUserSchema.safeParse(req.body);
      
      if (!userValidation.success) {
        return res.status(400).json({ 
          message: 'Invalid user data',
          errors: userValidation.error.format()
        });
      }
      
      const { username, password, email, name } = userValidation.data;
      
      // Check if username already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(schema.users.username, username)
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Create user record
      const [user] = await db.insert(schema.users)
        .values({
          username,
          password, // In production, this should be hashed
          email,
          name,
          role: 'society_member'
        })
        .returning();
      
      // Extract the member registration information
      const { blockName, flatNumber, phoneNumber, isOwner = true } = req.body;
      
      // Find the society block
      const block = await db.query.societyBlocks.findFirst({
        where: eq(schema.societyBlocks.blockName, blockName)
      });
      
      if (!block) {
        return res.status(400).json({ message: 'Invalid block name' });
      }
      
      // Create society member record
      const [member] = await db.insert(schema.societyMembers)
        .values({
          userId: user.id,
          blockId: block.id,
          flatNumber,
          isOwner,
          phoneNumber,
          status: 'pending', // Requires admin approval
        })
        .returning();
      
      // Return success response
      res.status(201).json({
        message: 'Registration successful. Your account is pending approval from society admin.',
        userId: user.id,
        memberId: member.id
      });
      
    } catch (error) {
      console.error('Error registering society member:', error);
      res.status(500).json({ message: 'Failed to register society member' });
    }
  });
  
  // Process society member login
  app.post('/api/society/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Find user by username
      const user = await db.query.users.findFirst({
        where: eq(schema.users.username, username)
      });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Check password using proper hash comparison
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Find associated society member record
      const societyMember = await db.query.societyMembers.findFirst({
        where: eq(schema.societyMembers.userId, user.id)
      });
      
      if (!societyMember) {
        return res.status(403).json({ message: 'No society membership found for this user' });
      }
      
      // Check if the member is approved
      if (societyMember.status !== 'active') {
        return res.status(403).json({ 
          message: 'Your society membership is pending approval',
          status: societyMember.status
        });
      }
      
      // Get the block information
      const block = await db.query.societyBlocks.findFirst({
        where: eq(schema.societyBlocks.id, societyMember.blockId)
      });
      
      // Return user information with society details
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        society: {
          memberId: societyMember.id,
          blockId: societyMember.blockId,
          blockName: block?.blockName,
          flatNumber: societyMember.flatNumber,
          isOwner: societyMember.isOwner,
          status: societyMember.status,
          phoneNumber: societyMember.phoneNumber,
          isCommitteeMember: societyMember.isCommitteeMember,
          memberRole: societyMember.role
        }
      });
      
    } catch (error) {
      console.error('Error logging in society member:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  
  // Admin endpoints for user registration approval
  app.get('/api/society/user-registrations', async (req: Request, res: Response) => {
    try {
      const status = req.query.status || 'pending';
      
      // Get pending society member registrations with user details
      const registrations = await db.select({
        id: schema.societyMembers.id,
        userId: schema.societyMembers.userId,
        blockId: schema.societyMembers.blockId,
        flatNumber: schema.societyMembers.flatNumber,
        isOwner: schema.societyMembers.isOwner,
        status: schema.societyMembers.status,
        phoneNumber: schema.societyMembers.phoneNumber,
        username: schema.users.username,
        email: schema.users.email,
        name: schema.users.name,
        blockName: schema.societyBlocks.blockName,
        registrationDate: schema.societyMembers.joinDate
      })
      .from(schema.societyMembers)
      .innerJoin(schema.users, eq(schema.societyMembers.userId, schema.users.id))
      .innerJoin(schema.societyBlocks, eq(schema.societyMembers.blockId, schema.societyBlocks.id))
      .where(eq(schema.societyMembers.status, status as string));
      
      res.json(registrations);
      
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      res.status(500).json({ message: 'Failed to fetch user registrations' });
    }
  });
  
  // Approve a user registration
  app.post('/api/society/user-registrations/:memberId/approve', async (req: Request, res: Response) => {
    try {
      const memberId = parseInt(req.params.memberId);
      
      // Update society member status to active
      const [updatedMember] = await db.update(schema.societyMembers)
        .set({ status: 'active' })
        .where(eq(schema.societyMembers.id, memberId))
        .returning();
      
      if (!updatedMember) {
        return res.status(404).json({ message: 'Member registration not found' });
      }
      
      // Send notification email
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, updatedMember.userId)
      });
      
      if (user && user.email) {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: '"Society Management" <jamiamasjidnabviqureshihashmi@gmail.com>',
          to: user.email,
          subject: 'Society Membership Approved',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Membership Approved</h1>
                <h2 style="margin: 5px 0 0 0;">Society Management System</h2>
              </div>
              
              <div style="padding: 20px;">
                <p>Dear ${user.name},</p>
                
                <p>Congratulations! Your society membership has been approved. You can now log in to the society portal and access all member features.</p>
                
                <p>Please use your username <strong>${user.username}</strong> to log in.</p>
                
                <p>Thank you for joining our society!</p>
                
                <p style="margin-top: 30px;">Regards,<br>Society Administration</p>
              </div>
            </div>
          `
        });
      }
      
      res.json({ 
        message: 'Member registration approved successfully',
        member: updatedMember
      });
      
    } catch (error) {
      console.error('Error approving registration:', error);
      res.status(500).json({ message: 'Failed to approve registration' });
    }
  });
  
  // Reject a user registration
  app.post('/api/society/user-registrations/:memberId/reject', async (req: Request, res: Response) => {
    try {
      const memberId = parseInt(req.params.memberId);
      
      // Update society member status to rejected
      const [updatedMember] = await db.update(schema.societyMembers)
        .set({ status: 'rejected' })
        .where(eq(schema.societyMembers.id, memberId))
        .returning();
      
      if (!updatedMember) {
        return res.status(404).json({ message: 'Member registration not found' });
      }
      
      // Send notification email
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, updatedMember.userId)
      });
      
      if (user && user.email) {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: '"Society Management" <jamiamasjidnabviqureshihashmi@gmail.com>',
          to: user.email,
          subject: 'Society Membership Application Status',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Membership Status Update</h1>
                <h2 style="margin: 5px 0 0 0;">Society Management System</h2>
              </div>
              
              <div style="padding: 20px;">
                <p>Dear ${user.name},</p>
                
                <p>Thank you for your interest in our society. After reviewing your application, we regret to inform you that your membership request could not be approved at this time.</p>
                
                <p>Please contact the society management office for more information or to submit additional documentation if needed.</p>
                
                <p style="margin-top: 30px;">Regards,<br>Society Administration</p>
              </div>
            </div>
          `
        });
      }
      
      res.json({ 
        message: 'Member registration rejected successfully',
        member: updatedMember
      });
      
    } catch (error) {
      console.error('Error rejecting registration:', error);
      res.status(500).json({ message: 'Failed to reject registration' });
    }
  });
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
  
  // Upload payment proof endpoint
  app.post("/api/upload-proof", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Return the URL to the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // API routes for donations
  app.post("/api/donations", async (req, res) => {
    try {
      console.log("Received donation request:", req.body);
      
      // Check required fields manually since some of our form data might need preprocessing
      if (!req.body.amount || !req.body.donationType || !req.body.firstName || !req.body.lastName || !req.body.email) {
        return res.status(400).json({
          message: "Missing required fields",
          required: "amount, donationType, firstName, lastName, email"
        });
      }
      
      // Convert amount to a valid numeric string if it's not already
      if (typeof req.body.amount === 'number') {
        req.body.amount = req.body.amount.toString();
      }
      
      // Handle crypto donation data
      let donationData = { ...req.body };
      if (donationData.paymentMethod === 'crypto_trc20' || donationData.paymentMethod === 'crypto_bnb') {
        if (!donationData.cryptoType || !donationData.cryptoAddress) {
          donationData.cryptoType = donationData.paymentMethod === 'crypto_trc20' ? 'trc20' : 'bnb';
          donationData.cryptoAddress = donationData.paymentMethod === 'crypto_trc20' 
            ? 'TAYc66GdUqufsWcAHXxS6qgXRW2w73179f' 
            : '0xd4f5912e37aa51402849acd7d9d4e7e9d94eb458';
        }
      }
      
      // Now try to validate the data with Zod schema
      const validationResult = insertDonationSchema.safeParse(donationData);
      
      if (!validationResult.success) {
        console.error("Validation errors:", validationResult.error.format());
        return res.status(400).json({ 
          message: "Invalid donation data", 
          errors: validationResult.error.format() 
        });
      }
      
      // Create the donation record
      const finalDonationData = validationResult.data;
      console.log("Processed donation data:", finalDonationData);
      
      const donation = await storage.createDonation(finalDonationData);
      console.log("Donation created:", donation);
      
      // Send receipt email if we have a valid email
      if (donation.email) {
        try {
          await sendDonationReceipt(donation);
          console.log("Receipt email sent to:", donation.email);
        } catch (emailError) {
          console.error("Failed to send receipt email:", emailError);
        }
        
        // Send thank you email
        try {
          await sendThankYouNotification(donation);
          console.log("Thank you notification sent to:", donation.email);
        } catch (thankYouError) {
          console.error("Failed to send thank you notification:", thankYouError);
        }
      }
      
      // Update campaign raised amount if campaign is specified
      if (donation.campaign && donation.campaign !== 'general') {
        try {
          const campaigns = await storage.getCampaigns();
          const campaign = campaigns.find(c => c.name.toLowerCase() === donation.campaign.toLowerCase());
          
          if (campaign) {
            const currentRaised = parseFloat(campaign.raised?.toString() || "0") || 0;
            const donationAmount = parseFloat(donation.amount.toString()) || 0;
            
            await storage.updateCampaignRaised(
              campaign.id, 
              currentRaised + donationAmount
            );
            console.log(`Updated campaign ${campaign.name} raised amount to ${currentRaised + donationAmount}`);
          }
        } catch (campaignError) {
          console.error("Failed to update campaign:", campaignError);
        }
      }
      
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
      
      // Send enrollment notification email to masjid admin
      try {
        await sendEnrollmentNotification(enrollment);
        console.log("Enrollment notification email sent successfully");
      } catch (emailError) {
        console.error("Failed to send enrollment notification email:", emailError);
        // Continue process even if email fails
      }
      
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Enrollment error:", error);
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
      
      // Send email notification for new contact message
      try {
        await sendContactMessageNotification(message);
        console.log("Contact message notification email sent successfully");
      } catch (emailError) {
        console.error("Failed to send contact message notification email:", emailError);
        // Continue process even if email fails
      }
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Contact message error:", error);
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

  // Fix the error handling type
  const handleError = (res: Response, error: unknown) => {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  };

  // Update the contact form route
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          message: "All fields are required" 
        });
      }
      
      // Create message record
      const [newMessage] = await db.insert(schema.messages)
        .values({
          name,
          email,
          subject,
          message,
          status: 'unread',
          createdAt: new Date()
        })
        .returning();
      
      // Send email notification
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || '"Masjid-e-Nabawi Islamabad" <jamiamasjidnabviqureshihashmi@gmail.com>',
          to: process.env.EMAIL_ADMIN || 'jamiamasjidnabviqureshihashmi@gmail.com',
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">New Contact Form Submission</h1>
                <h2 style="margin: 5px 0 0 0;">Jamia Masjid Nabvi Qureshi Hashmi</h2>
              </div>
              
              <div style="padding: 20px;">
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                  ${message}
                </div>
                
                <p style="margin-top: 30px;">This is an automated notification for a new contact form submission.</p>
              </div>
            </div>
          `
        });
        
        res.json({ 
          success: true, 
          message: "Message sent successfully" 
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Still return success to user even if email fails
        res.json({ 
          success: true, 
          message: "Message received. We'll get back to you soon.",
          emailSent: false 
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send message" 
      });
    }
  });

  // Update the enrollment form route
  app.post("/api/enroll", async (req: Request, res: Response) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
      
      try {
        await sendEnrollmentNotification(enrollment);
        res.json({ success: true, message: "Enrollment submitted successfully" });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Still return success to user even if email fails
        res.json({ 
          success: true, 
          message: "Enrollment received. We'll contact you soon.",
          emailSent: false 
        });
      }
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update the registration route
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, password, email, name } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: or(eq(users.username, username), eq(users.email, email))
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username or email already exists"
        });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const [user] = await db.insert(users)
        .values({
          username,
          password: hashedPassword,
          email,
          name,
          role: "user",
          status: "active"
        })
        .returning();
      
      // Set session
      req.session.adminUser = {
        id: user.id,
        username: user.username,
        role: user.role
      };
      
      res.json({
        success: true,
        message: "Registration successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update the login route
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await db.query.users.findFirst({
        where: eq(users.username, username)
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }
      
      // Verify password
      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }
      
      // Update last login
      await db.update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));
      
      // Set session
      req.session.adminUser = {
        id: user.id,
        username: user.username,
        role: user.role
      };
      
      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
