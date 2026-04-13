import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_PASSWORD) {
  throw new Error('Missing required Odoo configuration. Please check ODOO_URL, ODOO_DB, ODOO_USERNAME, and ODOO_PASSWORD environment variables.');
}

// Create axios instance with better configuration
const odooApi = axios.create({
  baseURL: ODOO_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class OdooService {
  private static adminUid: number | null = null;

  static async userAuthenticate(login: string, password: string) {
    console.log(`[AUTH v2][PID:${process.pid}] Login attempt: ${login}`);
    const uid = await this.rpcCall("call", {
      service: "common",
      method: "login",
      args: [ODOO_DB, login, password]
    });
    
    if (!uid) {
      console.log(`[AUTH v2][PID:${process.pid}] Login failed for: ${login}`);
      return null;
    }

    // Get user details using the user's own credentials to check share status
    const users = await this.rpcCall("call", {
      service: "object",
      method: "execute_kw",
      args: [ODOO_DB, uid, password, 'res.users', 'read', [[uid], ['name', 'login', 'share', 'partner_id']]]
    });
    
    console.log(`[AUTH v2][PID:${process.pid}] Login success: ${login} (Role: ${users[0].share ? 'User' : 'Admin'})`);
    return users[0];
  }

  static async findUserByLogin(login: string) {
    const users = await this.executeKw('res.users', 'search_read', [[['login', '=', login]]], { fields: ['id', 'login'], limit: 1 });
    return users.length > 0 ? users[0] : null;
  }

  static async createUser(login: string, password: string, name: string) {
    console.log(`[USER_CREATE] Creating new Odoo user for: ${login}`);
    
    // 1. Create Partner
    const partnerId = await this.executeKw('res.partner', 'create', [{
      name: name || login.split('@')[0],
      email: login,
      type: 'contact'
    }]);

    // 2. Find the 'Public' group ID
    const groups = await this.executeKw('res.groups', 'search', [[['name', 'ilike', 'public']]]);
    const publicGroupId = groups.length > 0 ? groups[0] : false;

    // 3. Create User (already verified by our backend)
    // Pass context to suppress Odoo's default invitation email
    const uid = await this.executeKw('res.users', 'create', [{
      login: login,
      password: password,
      partner_id: partnerId,
      share: true, 
      active: true,
      groups_id: publicGroupId ? [[6, 0, [publicGroupId]]] : []
    }], { 
      context: { 
        no_reset_password: true, 
        signup_valid: false,
        no_email_welcome: true
      } 
    });

    return uid;
  }

  static async sendVerificationEmail(uid: number) {
    const user = await this.executeKw('res.users', 'read', [[uid], ['login', 'name']]);
    if (!user || user.length === 0) return;

    // Use a simplified verification link since auth_signup fields might be missing
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=legacy&email=${user[0].login}`;

    const messageBody = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0b3d91;">Verify Your Nexus Engineering Account</h2>
        <p>Hello ${user[0].name},</p>
        <p>Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #666;">${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">Nexus Engineering &bull; GIDC Ahmedabad</p>
      </div>
    `;

    // Send email using Odoo's mail.mail
    const mailId = await this.executeKw('mail.mail', 'create', [{
      subject: "Verify Your Nexus Engineering Account",
      body_html: messageBody,
      email_to: user[0].login,
      auto_delete: true
    }]);

    await this.executeKw('mail.mail', 'send', [[mailId]]);
    console.log(`[AUTH] Verification email sent to ${user[0].login}`);
  }

  static async verifyUser(email: string, token: string) {
    try {
      // 1. Safer check for field existence using ir.model.fields
      const fieldCount = await this.executeKw('ir.model.fields', 'search_count', [
        [['model', '=', 'res.users'], ['name', '=', 'signup_token']]
      ]);
      
      if (fieldCount === 0) {
        console.log(`[AUTH] signup_token field missing in Odoo, skipping legacy verification for: ${email}`);
        return false;
      }

      // 2. Only search if the field exists
      const users = await this.executeKw('res.users', 'search_read', [
        [['login', '=', email], ['signup_token', '=', token]]
      ], { fields: ['id'] });

      if (users.length > 0) {
        await this.executeKw('res.users', 'write', [[users[0].id], {
          signup_token: false,
          signup_type: false
        }]);
        return true;
      }
    } catch (e) {
      console.warn(`[AUTH] verifyUser check failed:`, e);
    }
    return false;
  }

  static async sendPreRegistrationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=${token}&email=${email}`;

    const messageBody = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0b3d91;">Verify Your Nexus Engineering Account</h2>
        <p>Thank you for your interest in Nexus Engineering. Please click the button below to verify your email address and officially create your account:</p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #666;">${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">Nexus Engineering &bull; GIDC Ahmedabad</p>
      </div>
    `;

    // Send email using Odoo's mail.mail directly (doesn't need a user record)
    const mailId = await this.executeKw('mail.mail', 'create', [{
      subject: "Welcome to Nexus Engineering - Verify Your Account",
      body_html: messageBody,
      email_to: email,
      auto_delete: true
    }]);

    await this.executeKw('mail.mail', 'send', [[mailId]]);
    console.log(`[AUTH] Pre-registration email sent to ${email}`);
  }

  private static async rpcCall(method: string, params: any) {
    try {
      const response = await odooApi.post('/jsonrpc', {
        jsonrpc: "2.0",
        method: "call",
        params: params,
        id: Math.floor(Math.random() * 1000000)
      });
      
      if (response.data.error) {
        const errorMessage = response.data.error.data?.message || response.data.error.message || 'Unknown Odoo RPC error';
        throw new Error(`Odoo RPC Error: ${errorMessage}`);
      }
      
      return response.data.result;
    } catch (error: any) {
      if (error.response) {
        console.error("Odoo RPC HTTP Error:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        console.error("Odoo RPC Network Error:", error.message);
      } else {
        console.error("Odoo RPC Error:", error);
      }
      throw new Error(`Failed to communicate with Odoo: ${error.message}`);
    }
  }

  static async authenticate(): Promise<number> {
    if (this.adminUid) return this.adminUid;
    
    console.log(`[ODOO] Authenticating admin user: ${ODOO_USERNAME}`);
    const result = await this.rpcCall("call", {
      service: "common",
      method: "login",
      args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD]
    });
    if (!result) {
      throw new Error(`Authentication failed for user "${ODOO_USERNAME}" on database "${ODOO_DB}". Please check ODOO_PASSWORD in your backend .env file.`);
    }
    this.adminUid = result as number;
    return this.adminUid;
  }

  static async executeKw(model: string, method: string, args: any[], kwargs: any = {}) {
    const uid = await this.authenticate();
    const result = await this.rpcCall("call", {
      service: "object",
      method: "execute_kw",
      args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs]
    });
    return result;
  }
}
