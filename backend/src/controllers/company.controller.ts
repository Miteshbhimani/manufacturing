import { Request, Response } from 'express';
import { logError, logAudit } from '../modules/shared/utils/logger';

interface Company {
  id: number;
  name: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency: string;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCompanyDto {
  name: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency?: string;
  timezone?: string;
}

interface UpdateCompanyDto {
  name?: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency?: string;
  timezone?: string;
  isActive?: boolean;
}

// Mock data storage (in a real app, this would be in a database)
let companies: Company[] = [
  {
    id: 1,
    name: 'Nexus Engineering',
    legalName: 'Nexus Engineering Solutions Pvt. Ltd.',
    registrationNumber: 'REG-2024-001',
    taxId: 'TAX-2024-001',
    website: 'https://nexusengineering.com',
    email: 'info@nexusengineering.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Tech Solutions Inc.',
    legalName: 'Tech Solutions Incorporated',
    registrationNumber: 'REG-2024-002',
    taxId: 'TAX-2024-002',
    website: 'https://techsolutions.com',
    email: 'contact@techsolutions.com',
    phone: '+1-555-0456',
    address: {
      street: '456 Innovation Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    currency: 'USD',
    timezone: 'America/New_York',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

let nextId = 3;

export class CompanyController {
  async getAllCompanies(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: companies
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch companies');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch companies'
      });
    }
  }

  async getCompanyById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const company = companies.find(c => c.id === parseInt(id));
      
      if (!company) {
        return res.status(404).json({
          success: false,
          error: 'Company not found'
        });
      }

      res.json({
        success: true,
        data: company
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch company');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch company'
      });
    }
  }

  async createCompany(req: Request, res: Response) {
    try {
      const companyData: CreateCompanyDto = req.body;
      const newCompany: Company = {
        id: nextId++,
        ...companyData,
        currency: companyData.currency || 'USD',
        timezone: companyData.timezone || 'UTC',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      companies.push(newCompany);
      
      logAudit(newCompany.id, 'Company created', { name: newCompany.name });
      
      res.status(201).json({
        success: true,
        data: newCompany
      });
    } catch (error) {
      logError(error as Error, 'Failed to create company');
      res.status(500).json({
        success: false,
        error: 'Failed to create company'
      });
    }
  }

  async updateCompany(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const companyIndex = companies.findIndex(c => c.id === parseInt(id));
      
      if (companyIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Company not found'
        });
      }

      const updateData: UpdateCompanyDto = req.body;
      companies[companyIndex] = {
        ...companies[companyIndex],
        ...updateData,
        updatedAt: new Date()
      };

      logAudit(parseInt(id), 'Company updated', { name: companies[companyIndex].name });
      
      res.json({
        success: true,
        data: companies[companyIndex]
      });
    } catch (error) {
      logError(error as Error, 'Failed to update company');
      res.status(500).json({
        success: false,
        error: 'Failed to update company'
      });
    }
  }

  async deleteCompany(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const companyIndex = companies.findIndex(c => c.id === parseInt(id));
      
      if (companyIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Company not found'
        });
      }

      const deletedCompany = companies[companyIndex];
      companies.splice(companyIndex, 1);

      logAudit(parseInt(id), 'Company deleted', { name: deletedCompany.name });
      
      res.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      logError(error as Error, 'Failed to delete company');
      res.status(500).json({
        success: false,
        error: 'Failed to delete company'
      });
    }
  }
}

export const companyController = new CompanyController();
