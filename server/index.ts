import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import http from 'http';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Conditionally disable Stripe if STRIPE_SECRET_KEY is missing
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY. Stripe payments will not be processed.");
}

// Initialize the application
const init = async () => {
  // Register routes
  const router = registerRoutes(app);
  app.use('/api', router);

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  // Start server
  server.listen(port, () => {
    console.log(`[express] Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[express] serving on port ${port}`);
  });
};

// Start the application
init().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Export the Express app for Vercel
export default app;
