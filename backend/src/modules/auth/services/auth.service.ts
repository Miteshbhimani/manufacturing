import jwt from 'jsonwebtoken';
import { User, LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest, JwtPayload } from '../../shared/types/common.types';
import { userModel } from '../models/user.model';
import { emailService } from '../../shared/email/email.service';
import logger, { logError, logAudit } from '../../shared/utils/logger';
import { database } from '../../shared/database/database.service';

export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
  private readonly refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  async register(userData: RegisterRequest): Promise<{ user: User; message: string }> {
    try {
      // Check if user already exists
      const existingUser = await userModel.findByEmailWithInactive(userData.email);
      if (existingUser) {
        if (existingUser.is_active) {
          throw new Error('User with this email already exists');
        } else {
          throw new Error('Account with this email exists but is deactivated. Please contact support.');
        }
      }

      // Create new user
      const user = await userModel.create({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'member'
      });

      // Generate verification token
      const verificationToken = this.generateToken();
      await userModel.setVerificationToken(user.id, verificationToken);

      // Send verification email
      await this.sendVerificationEmail(user.email, verificationToken);

      // Log audit
      logAudit(user.id, 'user_registered', { email: user.email });

      // Return user (password will be filtered at controller level)
      return {
        user: user,
        message: 'Registration successful. Please check your email for verification.'
      };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.register', email: userData.email });
      throw error;
    }
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      // Find user by email
      const user = await userModel.findByEmail(loginData.email);
      console.log('User found:', JSON.stringify(user, null, 2));
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      const isLocked = await userModel.isAccountLocked(user);
      if (isLocked) {
        throw new Error('Account is temporarily locked due to too many failed login attempts. Please try again later.');
      }

      // Validate password
      const isValidPassword = await userModel.validatePassword(loginData.password, user.password_hash);
      if (!isValidPassword) {
        await userModel.incrementLoginAttempts(user.id);
        throw new Error('Invalid email or password');
      }

      // Reset login attempts and update last login
      await userModel.resetLoginAttempts(user.id);

      // Generate tokens
      const token = this.generateJwtToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Log audit
      logAudit(user.id, 'user_login', { email: user.email });

      // Return user (password will be filtered at controller level)
      return {
        user: user,
        token,
        refreshToken,
        expiresIn: this.parseExpirationTime(this.jwtExpiresIn)
      };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.login', email: loginData.email });
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string; expiresIn: number }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as JwtPayload;
      
      // Find user
      const user = await userModel.findById(decoded.userId);
      if (!user || !user.is_active) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newToken = this.generateJwtToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: this.parseExpirationTime(this.jwtExpiresIn)
      };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.refreshToken' });
      throw new Error('Invalid refresh token');
    }
  }

  async forgotPassword(requestData: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      // Find user by email
      const user = await userModel.findByEmail(requestData.email);
      if (!user) {
        // Don't reveal that user doesn't exist
        return { message: 'If an account with this email exists, a password reset link has been sent.' };
      }

      // Generate reset token
      const resetToken = this.generateToken();
      await userModel.setPasswordResetToken(user.id, resetToken);

      // Send reset email
      await this.sendPasswordResetEmail(user.email, resetToken);

      // Log audit
      logAudit(user.id, 'password_reset_requested', { email: user.email });

      return { message: 'If an account with this email exists, a password reset link has been sent.' };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.forgotPassword', email: requestData.email });
      throw error;
    }
  }

  async resetPassword(requestData: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      // Find user by reset token
      const user = await userModel.findByPasswordResetToken(requestData.token);
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password
      await userModel.updatePassword(user.id, requestData.password);

      // Log audit
      logAudit(user.id, 'password_reset_completed', { email: user.email });

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.resetPassword' });
      throw error;
    }
  }

  async verifyEmail(requestData: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      // Find user by verification token
      const user = await userModel.findByVerificationToken(requestData.token);
      if (!user) {
        throw new Error('Invalid or expired verification token');
      }

      // Verify email
      await userModel.verifyEmail(user.id);

      // Log audit
      logAudit(user.id, 'email_verified', { email: user.email });

      return { message: 'Email has been verified successfully' };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.verifyEmail' });
      throw error;
    }
  }

  async logout(userId: number): Promise<{ message: string }> {
    try {
      // Log audit
      logAudit(userId, 'user_logout', {});

      return { message: 'Logged out successfully' };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.logout' });
      throw error;
    }
  }

  async getCurrentUser(userId: number): Promise<User | null> {
    try {
      const user = await userModel.findById(userId);
      if (!user || !user.is_active) {
        return null;
      }

      // Get user profile (placeholder - userProfileModel not implemented yet)
      // const profile = await userProfileModel.findByUserId(userId);

      // Return user (password will be filtered at controller level)
      return user;
    } catch (error) {
      logError(error as Error, { context: 'AuthService.getCurrentUser' });
      throw error;
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      // Get user
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate current password
      const isValidPassword = await userModel.validatePassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await userModel.updatePassword(userId, newPassword);

      // Log audit
      logAudit(userId, 'password_changed', {});

      return { message: 'Password changed successfully' };
    } catch (error) {
      logError(error as Error, { context: 'AuthService.changePassword' });
      throw error;
    }
  }

  private generateJwtToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseExpirationTime(this.jwtExpiresIn)
    };

    return jwt.sign(payload, this.jwtSecret);
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseExpirationTime(this.refreshExpiresIn)
    };

    return jwt.sign(payload, this.jwtRefreshSecret);
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private parseExpirationTime(expiresIn: string): number {
    const timeValue = parseInt(expiresIn);
    const timeUnit = expiresIn.replace(/[0-9]/g, '');
    
    switch (timeUnit) {
      case 's':
        return timeValue;
      case 'm':
        return timeValue * 60;
      case 'h':
        return timeValue * 60 * 60;
      case 'd':
        return timeValue * 60 * 60 * 24;
      default:
        return 3600; // Default to 1 hour
    }
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;
    
    await emailService.sendEmail({
      to: email,
      subject: 'Verify Your Nexus Engineering Account',
      html: this.getEmailTemplate('verification', {
        verificationUrl,
        email
      })
    });
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    
    await emailService.sendEmail({
      to: email,
      subject: 'Reset Your Nexus Engineering Password',
      html: this.getEmailTemplate('password_reset', {
        resetUrl,
        email
      })
    });
  }

  private getEmailTemplate(type: 'verification' | 'password_reset', data: any): string {
    if (type === 'verification') {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0b3d91;">Verify Your Nexus Engineering Account</h2>
          <p>Hello,</p>
          <p>Thank you for registering with Nexus Engineering. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" style="background-color: #0b3d91; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${data.verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">Nexus Engineering &bull; GIDC Ahmedabad</p>
        </div>
      `;
    } else {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0b3d91;">Reset Your Nexus Engineering Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background-color: #0b3d91; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${data.resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">Nexus Engineering &bull; GIDC Ahmedabad</p>
        </div>
      `;
    }
  }
}

export const authService = new AuthService();
