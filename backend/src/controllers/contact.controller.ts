import { Request, Response } from 'express';
import { logError, logAudit } from '../modules/shared/utils/logger';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'archived';
  source?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateContactDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
}

interface UpdateContactDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'archived';
  source?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
}

// Mock data storage (in a real app, this would be in a database)
let contacts: Contact[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    company: 'Acme Corp',
    status: 'qualified',
    source: 'web',
    budget: 50000,
    currency: 'USD',
    requirements: 'Looking for ERP solution',
    notes: 'Interested in our products',
    assignedTo: 1,
    createdBy: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    company: 'Tech Solutions',
    status: 'new',
    source: 'referral',
    budget: 25000,
    currency: 'USD',
    requirements: 'Needs CRM integration',
    notes: 'Referred by existing client',
    assignedTo: 1,
    createdBy: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

let nextId = 3;

export class ContactController {
  async getAllContacts(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch contacts');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contacts'
      });
    }
  }

  async getContactById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const contact = contacts.find(c => c.id === parseInt(id));
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contact not found'
        });
      }

      res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch contact');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contact'
      });
    }
  }

  async createContact(req: Request, res: Response) {
    try {
      const contactData: CreateContactDto = req.body;
      const newContact: Contact = {
        id: nextId++,
        ...contactData,
        status: 'new',
        createdBy: 1, // In real app, get from authenticated user
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      contacts.push(newContact);
      
      logAudit(newContact.id, 'Contact created', { email: newContact.email });
      
      res.status(201).json({
        success: true,
        data: newContact
      });
    } catch (error) {
      logError(error as Error, 'Failed to create contact');
      res.status(500).json({
        success: false,
        error: 'Failed to create contact'
      });
    }
  }

  async updateContact(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const contactIndex = contacts.findIndex(c => c.id === parseInt(id));
      
      if (contactIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Contact not found'
        });
      }

      const updateData: UpdateContactDto = req.body;
      contacts[contactIndex] = {
        ...contacts[contactIndex],
        ...updateData,
        updatedAt: new Date()
      };

      logAudit(parseInt(id), 'Contact updated', { email: contacts[contactIndex].email });
      
      res.json({
        success: true,
        data: contacts[contactIndex]
      });
    } catch (error) {
      logError(error as Error, 'Failed to update contact');
      res.status(500).json({
        success: false,
        error: 'Failed to update contact'
      });
    }
  }

  async deleteContact(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const contactIndex = contacts.findIndex(c => c.id === parseInt(id));
      
      if (contactIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Contact not found'
        });
      }

      const deletedContact = contacts[contactIndex];
      contacts.splice(contactIndex, 1);

      logAudit(parseInt(id), 'Contact deleted', { email: deletedContact.email });
      
      res.json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      logError(error as Error, 'Failed to delete contact');
      res.status(500).json({
        success: false,
        error: 'Failed to delete contact'
      });
    }
  }
}

export const contactController = new ContactController();
