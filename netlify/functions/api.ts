import { Handler } from '@netlify/functions';
import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { users } from '../server/db/schema';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ZodError } from 'zod';
import { OpenAI } from 'openai';
import { createTransport } from 'nodemailer';
import Stripe from 'stripe';
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { createServer } from 'http';
import { parse } from 'url';
import { join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Initialize email transport
const transporter = createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validation schemas
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(1),
});

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const validatedData = userSchema.parse(req.body);
    
    // Save to database
    await db.insert(users).values(validatedData);
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'New Contact Form Submission',
      text: `
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        Phone: ${validatedData.phone}
        Message: ${validatedData.message}
      `,
    });
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: fromZodError(error).message });
    } else {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'gpt-3.5-turbo',
    });
    
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = join(__dirname, '../../dist/public');
  app.use(express.static(publicPath));
  
  app.get('*', (req, res) => {
    res.sendFile(join(publicPath, 'index.html'));
  });
}

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    ws.send('Message received');
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Netlify function handler
export const handler: Handler = async (event, context) => {
  // Parse the URL
  const parsedUrl = parse(event.path, true);
  
  // Create a mock request object
  const req = {
    method: event.httpMethod,
    url: event.path,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : {},
    query: parsedUrl.query,
  };
  
  // Create a mock response object
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    json: (data: any) => {
      res.body = JSON.stringify(data);
      res.headers['Content-Type'] = 'application/json';
    },
    send: (data: string) => {
      res.body = data;
    },
  };
  
  // Handle the request
  try {
    await app(req, res);
    
    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 