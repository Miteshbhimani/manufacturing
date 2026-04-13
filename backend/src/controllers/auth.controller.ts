import { Request, Response } from 'express';
import { OdooService } from '../services/odoo.service';
import NodeCache from 'node-cache';
import crypto from 'crypto';
import { ApiResponse, LoginRequest } from '../types/express.types';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Input validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  isRegistering: z.boolean().optional().default(false)
});

const verifySchema = z.object({
  email: z.string().email('Invalid email format'),
  token: z.string().min(1, 'Token is required')
});

// Cache for pending registrations (expires in 1 hour)
const registrationCache = new NodeCache({ stdTTL: 3600 });

// Session cache for authenticated users (expires in 24 hours)
const sessionCache = new NodeCache({ stdTTL: 86400 });

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Failed login attempts tracking
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Lockout duration in milliseconds (15 minutes)
const LOCKOUT_DURATION = 15 * 60 * 1000;

// Maximum failed attempts before lockout
const MAX_FAILED_ATTEMPTS = 5;

// Helper function to check if user is locked out
const isUserLockedOut = (email: string): boolean => {
  const attempts = failedAttempts.get(email);
  if (!attempts) return false;
  
  const now = Date.now();
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    failedAttempts.delete(email);
    return false;
  }
  
  return attempts.count >= MAX_FAILED_ATTEMPTS;
};

// Helper function to record failed login attempt
const recordFailedAttempt = (email: string): void => {
  const attempts = failedAttempts.get(email) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  failedAttempts.set(email, attempts);
};

// Helper function to clear failed attempts
const clearFailedAttempts = (email: string): void => {
  failedAttempts.delete(email);
};

// Helper function to generate JWT token
const generateToken = (user: any): string => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.login, 
      role: user.share ? 'user' : 'admin' 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  // Validate input
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({ 
      success: false, 
      message: "Invalid input data",
      errors: validationResult.error.issues
    });
    return;
  }

  const { email, password, isRegistering } = validationResult.data;
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

  try {
    // Check if user is locked out
    if (isUserLockedOut(email)) {
      const response: ApiResponse = {
        success: false,
        error: "Account locked due to too many failed attempts. Please try again later."
      };
      res.status(423).json(response);
      console.log(`[AUTH] Login attempt for locked account: ${email} from IP: ${clientIP}`);
      return;
    }

    // 1. Handling Registration Intent
    if (isRegistering) {
      const existingUser = await OdooService.findUserByLogin(email);
      if (existingUser) {
        res.status(400).json({ success: false, message: "An account with this email already exists. Please login instead." });
        return;
      }

      // Generate a secure verification token for the cache
      const token = crypto.randomBytes(32).toString('hex');
      
      // Store credentials in cache
      registrationCache.set(token, { email, password, name: email.split('@')[0] });
      
      // Send pre-registration email
      await OdooService.sendPreRegistrationEmail(email, token);

      res.json({
        success: true,
        requiresVerification: true,
        message: "A verification email has been sent. Your account will be created once you verify your email."
      });
      return;
    }

    // 2. Handling Login for Existing Users
    // Check if user already exists in Odoo
    let user = await OdooService.userAuthenticate(email, password);

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials. If you are new, please use the Register option." });
      return;
    }

    // 3. Successful login - create session and token
    clearFailedAttempts(email);
    
    const role = user.share ? 'user' : 'admin';
    const token = generateToken(user);
    
    // Store session in cache
    const sessionData = {
      id: user.id,
      email: user.login,
      name: user.name,
      role: role,
      loginTime: new Date().toISOString(),
      clientIP: clientIP
    };
    
    sessionCache.set(token, sessionData);
    
    const response: ApiResponse = {
      success: true,
      data: { 
        id: user.id, 
        name: user.name, 
        email: user.login, 
        role: role,
        token: token,
        expiresIn: '24h'
      }
    };
    
    console.log(`[AUTH] Successful login: ${email} from IP: ${clientIP}`);
    res.json(response);
    
  } catch (error: any) {
    recordFailedAttempt(email);
    console.error(`[AUTH] Login error for ${email} from IP: ${clientIP}:`, error.message);
    
    // Don't reveal specific error details to prevent enumeration attacks
    res.status(401).json({ 
      success: false, 
      error: "Invalid email or password" 
    });
  }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  // Validate query parameters
  const validationResult = verifySchema.safeParse(req.query);
  if (!validationResult.success) {
    res.status(400).json({ 
      success: false, 
      message: "Invalid verification data",
      errors: validationResult.error.issues
    });
    return;
  }

  const { email, token } = validationResult.data;

  try {
    const cachedData = registrationCache.get(token as string) as any;
    
    if (cachedData && cachedData.email === email) {
      console.log(`[AUTH] Verified! Checking Odoo for: ${email}`);
      
      // 1. Double check if user already exists in Odoo (to avoid duplicate errors)
      const existingUser = await OdooService.findUserByLogin(email as string);
      
      if (!existingUser) {
        console.log(`[AUTH] Creating Odoo user for: ${email}`);
        await OdooService.createUser(cachedData.email, cachedData.password, cachedData.name);
      } else {
        console.log(`[AUTH] User already exists in Odoo, skipping creation: ${email}`);
      }
      
      // Remove from cache
      registrationCache.del(token as string);

      const response: ApiResponse = { 
        success: true, 
        message: "Account verified and created successfully! You can now login." 
      };
      res.json(response);
      return;
    }

    // Fallback: Check if it's an existing Odoo user verifying (backward compatibility)
    const success = await OdooService.verifyUser(email, token);
    if (success) {
      res.json({ success: true, message: "Email verified successfully! You can now login." });
    } else {
      res.status(400).json({ success: false, message: "Invalid or expired verification link." });
    }
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' ? error.message : "Internal server error during verification" 
    });
  }
};

export const logoutRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('[AUTH] Odoo logout redirect triggered');
    
    // Clear any frontend session data if needed
    // This is mainly to provide a clean redirect point from Odoo logout
    
    // Redirect to the website homepage
    res.redirect('http://localhost:5173/');
  } catch (error: any) {
    console.error("Logout redirect error:", error);
    // Fallback redirect even if there's an error
    res.redirect('http://localhost:5173/');
  }
};

export const createOdooSession = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validationResult = loginSchema.pick({ email: true, password: true }).safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid input data",
        errors: validationResult.error.issues
      });
      return;
    }

    const { email, password } = validationResult.data;

    console.log('[SSO] Creating Odoo session for:', email);

    // Authenticate with Odoo to get session ID
    const odooResponse = await fetch('http://localhost:8069/web/session/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: process.env.ODOO_DB || '',
          login: email,
          password: password,
        },
        id: Math.floor(Math.random() * 1000000)
      })
    });

    const odooData = await odooResponse.json();
    
    if (odooData.error) {
      console.error('[SSO] Odoo authentication failed:', odooData.error);
      res.status(401).json({ success: false, message: "Odoo authentication failed" });
      return;
    }

    if (odooData.result && odooData.result.uid) {
      console.log('[SSO] Odoo session created successfully for:', email);
      
      // Return the session info
      res.json({
        success: true,
        session: {
          uid: odooData.result.uid,
          session_id: odooData.result.session_id,
          username: odooData.result.username,
          context: odooData.result.context
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Failed to create Odoo session" });
    }
  } catch (error: any) {
    console.error('[SSO] Error creating Odoo session:', error);
    res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' ? error.message : "Internal server error" 
    });
  }
};
