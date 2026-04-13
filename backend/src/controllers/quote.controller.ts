import { Request, Response } from 'express';
import { logError, logAudit } from '../modules/shared/utils/logger';

interface Quote {
  id: number;
  quoteNumber: string;
  customerId: number;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  totalAmount: number;
  currency: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
}

interface CreateQuoteDto {
  customerId: number;
  title: string;
  description?: string;
  totalAmount: number;
  currency: string;
  validUntil: string;
}

interface UpdateQuoteDto {
  customerId?: number;
  title?: string;
  description?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  totalAmount?: number;
  currency?: string;
  validUntil?: string;
}

// Mock data storage (in a real app, this would be in a database)
let quotes: Quote[] = [
  {
    id: 1,
    quoteNumber: 'Q-2024-001',
    customerId: 1,
    title: 'ERP System Implementation',
    description: 'Complete ERP system setup and training',
    status: 'sent',
    totalAmount: 75000,
    currency: 'USD',
    validUntil: new Date('2024-02-15'),
    createdBy: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 2,
    quoteNumber: 'Q-2024-002',
    customerId: 2,
    title: 'CRM Integration',
    description: 'Custom CRM integration with existing systems',
    status: 'draft',
    totalAmount: 25000,
    currency: 'USD',
    validUntil: new Date('2024-02-28'),
    createdBy: 1,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  }
];

let nextId = 3;
let nextQuoteNumber = 3;

export class QuoteController {
  async getAllQuotes(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: quotes
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch quotes');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch quotes'
      });
    }
  }

  async getQuoteById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const quote = quotes.find(q => q.id === parseInt(id));
      
      if (!quote) {
        return res.status(404).json({
          success: false,
          error: 'Quote not found'
        });
      }

      res.json({
        success: true,
        data: quote
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch quote');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch quote'
      });
    }
  }

  async createQuote(req: Request, res: Response) {
    try {
      const quoteData: CreateQuoteDto = req.body;
      const newQuote: Quote = {
        id: nextId++,
        quoteNumber: `Q-2024-${String(nextQuoteNumber++).padStart(3, '0')}`,
        ...quoteData,
        status: 'draft',
        validUntil: new Date(quoteData.validUntil),
        createdBy: 1, // In real app, get from authenticated user
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      quotes.push(newQuote);
      
      logAudit(newQuote.id, 'Quote created', { quoteNumber: newQuote.quoteNumber });
      
      res.status(201).json({
        success: true,
        data: newQuote
      });
    } catch (error) {
      logError(error as Error, 'Failed to create quote');
      res.status(500).json({
        success: false,
        error: 'Failed to create quote'
      });
    }
  }

  async updateQuote(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const quoteIndex = quotes.findIndex(q => q.id === parseInt(id));
      
      if (quoteIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Quote not found'
        });
      }

      const updateData: UpdateQuoteDto = req.body;
      quotes[quoteIndex] = {
        ...quotes[quoteIndex],
        ...updateData,
        validUntil: updateData.validUntil ? new Date(updateData.validUntil) : quotes[quoteIndex].validUntil,
        updatedAt: new Date()
      };

      logAudit(parseInt(id), 'Quote updated', { quoteNumber: quotes[quoteIndex].quoteNumber });
      
      res.json({
        success: true,
        data: quotes[quoteIndex]
      });
    } catch (error) {
      logError(error as Error, 'Failed to update quote');
      res.status(500).json({
        success: false,
        error: 'Failed to update quote'
      });
    }
  }

  async deleteQuote(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const quoteIndex = quotes.findIndex(q => q.id === parseInt(id));
      
      if (quoteIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Quote not found'
        });
      }

      const deletedQuote = quotes[quoteIndex];
      quotes.splice(quoteIndex, 1);

      logAudit(parseInt(id), 'Quote deleted', { quoteNumber: deletedQuote.quoteNumber });
      
      res.json({
        success: true,
        message: 'Quote deleted successfully'
      });
    } catch (error) {
      logError(error as Error, 'Failed to delete quote');
      res.status(500).json({
        success: false,
        error: 'Failed to delete quote'
      });
    }
  }
}

export const quoteController = new QuoteController();
