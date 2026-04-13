import nodemailer from 'nodemailer';
import { EmailOptions, EmailTemplate } from '../types/common.types';
import { database } from '../database/database.service';
import logger, { logError } from '../utils/logger';

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@nexusengineering.com',
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log email
      await this.logEmail({
        toEmail: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        status: 'sent',
        providerMessageId: result.messageId
      });

      logger.info(`Email sent successfully to ${options.to}`);
    } catch (error) {
      logError(error as Error, { context: 'EmailService.sendEmail', options });
      
      // Log failed email
      await this.logEmail({
        toEmail: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        status: 'failed',
        errorMessage: (error as Error).message
      });
      
      throw error;
    }
  }

  async sendTemplateEmail(
    templateName: string, 
    toEmail: string | string[], 
    variables: Record<string, any>
  ): Promise<void> {
    try {
      const template = await this.getEmailTemplate(templateName);
      if (!template) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      const processedHtml = this.processTemplate(template.bodyHtml, variables);
      const processedText = template.bodyText ? this.processTemplate(template.bodyText, variables) : undefined;
      const processedSubject = this.processTemplate(template.subject, variables);

      await this.sendEmail({
        to: toEmail,
        subject: processedSubject,
        html: processedHtml,
        text: processedText
      });
    } catch (error) {
      logError(error as Error, { context: 'EmailService.sendTemplateEmail', templateName, toEmail });
      throw error;
    }
  }

  async getEmailTemplate(name: string): Promise<EmailTemplate | null> {
    try {
      const query = 'SELECT * FROM email_templates WHERE name = $1 AND is_active = true';
      const result = await database.query(query, [name]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const template = result.rows[0];
      return {
        id: template.id,
        name: template.name,
        subject: template.subject,
        bodyHtml: template.body_html,
        bodyText: template.body_text,
        variables: template.variables || {},
        category: template.category,
        isActive: template.is_active
      };
    } catch (error) {
      logError(error as Error, { context: 'EmailService.getEmailTemplate', name });
      throw error;
    }
  }

  async createEmailTemplate(template: {
    name: string;
    subject: string;
    bodyHtml: string;
    bodyText?: string;
    variables?: Record<string, any>;
    category?: string;
  }): Promise<EmailTemplate> {
    try {
      const query = `
        INSERT INTO email_templates (name, subject, body_html, body_text, variables, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const values = [
        template.name,
        template.subject,
        template.bodyHtml,
        template.bodyText || null,
        JSON.stringify(template.variables || {}),
        template.category || null
      ];

      const result = await database.query(query, values);
      const createdTemplate = result.rows[0];

      return {
        id: createdTemplate.id,
        name: createdTemplate.name,
        subject: createdTemplate.subject,
        bodyHtml: createdTemplate.body_html,
        bodyText: createdTemplate.body_text,
        variables: createdTemplate.variables || {},
        category: createdTemplate.category,
        isActive: createdTemplate.is_active
      };
    } catch (error) {
      logError(error as Error, { context: 'EmailService.createEmailTemplate' });
      throw error;
    }
  }

  async updateEmailTemplate(id: number, updates: Partial<{
    subject: string;
    bodyHtml: string;
    bodyText: string;
    variables: Record<string, any>;
    category: string;
    isActive: boolean;
  }>): Promise<EmailTemplate | null> {
    try {
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (updates.subject !== undefined) {
        fields.push(`subject = $${paramIndex++}`);
        values.push(updates.subject);
      }
      if (updates.bodyHtml !== undefined) {
        fields.push(`body_html = $${paramIndex++}`);
        values.push(updates.bodyHtml);
      }
      if (updates.bodyText !== undefined) {
        fields.push(`body_text = $${paramIndex++}`);
        values.push(updates.bodyText);
      }
      if (updates.variables !== undefined) {
        fields.push(`variables = $${paramIndex++}`);
        values.push(JSON.stringify(updates.variables));
      }
      if (updates.category !== undefined) {
        fields.push(`category = $${paramIndex++}`);
        values.push(updates.category);
      }
      if (updates.isActive !== undefined) {
        fields.push(`is_active = $${paramIndex++}`);
        values.push(updates.isActive);
      }

      if (fields.length === 0) {
        return this.getEmailTemplateById(id);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE email_templates 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await database.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }

      const template = result.rows[0];
      return {
        id: template.id,
        name: template.name,
        subject: template.subject,
        bodyHtml: template.body_html,
        bodyText: template.body_text,
        variables: template.variables || {},
        category: template.category,
        isActive: template.is_active
      };
    } catch (error) {
      logError(error as Error, { context: 'EmailService.updateEmailTemplate' });
      throw error;
    }
  }

  async deleteEmailTemplate(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM email_templates WHERE id = $1';
      const result = await database.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      logError(error as Error, { context: 'EmailService.deleteEmailTemplate' });
      throw error;
    }
  }

  async getEmailTemplateById(id: number): Promise<EmailTemplate | null> {
    try {
      const query = 'SELECT * FROM email_templates WHERE id = $1';
      const result = await database.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const template = result.rows[0];
      return {
        id: template.id,
        name: template.name,
        subject: template.subject,
        bodyHtml: template.body_html,
        bodyText: template.body_text,
        variables: template.variables || {},
        category: template.category,
        isActive: template.is_active
      };
    } catch (error) {
      logError(error as Error, { context: 'EmailService.getEmailTemplateById' });
      throw error;
    }
  }

  async listEmailTemplates(category?: string): Promise<EmailTemplate[]> {
    try {
      let query = 'SELECT * FROM email_templates WHERE is_active = true';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $1';
        params.push(category);
      }

      query += ' ORDER BY name';

      const result = await database.query(query, params);
      
      return result.rows.map((template: any) => ({
        id: template.id,
        name: template.name,
        subject: template.subject,
        bodyHtml: template.body_html,
        bodyText: template.body_text,
        variables: template.variables || {},
        category: template.category,
        isActive: template.is_active
      }));
    } catch (error) {
      logError(error as Error, { context: 'EmailService.listEmailTemplates' });
      throw error;
    }
  }

  async getEmailLogs(limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      const query = `
        SELECT * FROM email_logs 
        ORDER BY sent_at DESC 
        LIMIT $1 OFFSET $2
      `;
      const result = await database.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      logError(error as Error, { context: 'EmailService.getEmailLogs' });
      throw error;
    }
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    }
    
    return processed;
  }

  private async logEmail(logData: {
    toEmail: string;
    subject: string;
    status: string;
    providerMessageId?: string;
    errorMessage?: string;
  }): Promise<void> {
    try {
      const query = `
        INSERT INTO email_logs (to_email, subject, status, provider_message_id, error_message)
        VALUES ($1, $2, $3, $4, $5)
      `;
      
      await database.query(query, [
        logData.toEmail,
        logData.subject,
        logData.status,
        logData.providerMessageId || null,
        logData.errorMessage || null
      ]);
    } catch (error) {
      logError(error as Error, { context: 'EmailService.logEmail' });
    }
  }

  async testEmailConfiguration(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      logError(error as Error, { context: 'EmailService.testEmailConfiguration' });
      return false;
    }
  }

  async sendTestEmail(toEmail: string): Promise<void> {
    await this.sendEmail({
      to: toEmail,
      subject: 'Test Email from Nexus Engineering',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0b3d91;">Test Email</h2>
          <p>This is a test email from the Nexus Engineering system.</p>
          <p>If you received this email, the email service is working correctly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">Nexus Engineering &bull; GIDC Ahmedabad</p>
        </div>
      `,
      text: 'This is a test email from the Nexus Engineering system. If you received this email, the email service is working correctly.'
    });
  }
}

export const emailService = EmailService.getInstance();
