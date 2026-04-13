import { Router } from 'express';
import { crmController } from '../controllers/crm.controller';
import { authenticateToken, requireAdmin } from '../middleware/crm.middleware';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createLeadSchema = Joi.object({
  email: Joi.string().email().required().max(255),
  firstName: Joi.string().optional().max(100),
  lastName: Joi.string().optional().max(100),
  phone: Joi.string().optional().max(20),
  company: Joi.string().optional().max(255),
  title: Joi.string().optional().max(100),
  source: Joi.string().optional().max(50),
  status: Joi.string().optional().valid('new', 'contacted', 'qualified', 'converted', 'lost', 'archived'),
  budget: Joi.number().optional().min(0),
  currency: Joi.string().optional().max(3),
  requirements: Joi.string().optional().max(2000),
  notes: Joi.string().optional().max(2000),
  assignedTo: Joi.number().optional().integer().positive()
});

const updateLeadSchema = Joi.object({
  firstName: Joi.string().optional().max(100),
  lastName: Joi.string().optional().max(100),
  email: Joi.string().email().optional().max(255),
  phone: Joi.string().optional().max(20),
  company: Joi.string().optional().max(255),
  title: Joi.string().optional().max(100),
  source: Joi.string().optional().max(50),
  status: Joi.string().optional().valid('new', 'contacted', 'qualified', 'converted', 'lost', 'archived'),
  budget: Joi.number().optional().min(0),
  currency: Joi.string().optional().max(3),
  requirements: Joi.string().optional().max(2000),
  notes: Joi.string().optional().max(2000),
  assignedTo: Joi.number().optional().integer().positive()
});

const createActivitySchema = Joi.object({
  leadId: Joi.number().required().integer().positive(),
  type: Joi.string().required().valid('call', 'email', 'meeting', 'task', 'note'),
  subject: Joi.string().optional().max(255),
  description: Joi.string().optional().max(2000),
  durationMinutes: Joi.number().optional().integer().positive(),
  location: Joi.string().optional().max(255),
  status: Joi.string().optional().valid('scheduled', 'completed', 'cancelled'),
  scheduledAt: Joi.date().optional()
});

const assignLeadSchema = Joi.object({
  assignedTo: Joi.number().required().integer().positive()
});

// Validation middleware
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};

// Lead Management Routes
router.post('/leads', 
  authenticateToken,
  validateRequest(createLeadSchema),
  crmController.createLead.bind(crmController)
);

router.get('/leads', 
  authenticateToken,
  crmController.getLeads.bind(crmController)
);

router.get('/leads/:id', 
  authenticateToken,
  crmController.getLead.bind(crmController)
);

router.put('/leads/:id', 
  authenticateToken,
  validateRequest(updateLeadSchema),
  crmController.updateLead.bind(crmController)
);

router.delete('/leads/:id', 
  authenticateToken,
  crmController.deleteLead.bind(crmController)
);

router.post('/leads/:id/assign', 
  authenticateToken,
  validateRequest(assignLeadSchema),
  crmController.assignLead.bind(crmController)
);

// Lead Activity Routes
router.post('/activities', 
  authenticateToken,
  validateRequest(createActivitySchema),
  crmController.createLeadActivity.bind(crmController)
);

router.get('/leads/:leadId/activities', 
  authenticateToken,
  crmController.getLeadActivities.bind(crmController)
);

router.get('/activities/upcoming', 
  authenticateToken,
  crmController.getUpcomingActivities.bind(crmController)
);

// Dashboard and Statistics Routes
router.get('/stats', 
  authenticateToken,
  crmController.getCRMStats.bind(crmController)
);

router.get('/dashboard', 
  authenticateToken,
  crmController.getCRMDashboard.bind(crmController)
);

// Admin only routes
router.get('/leads/all', 
  authenticateToken,
  requireAdmin,
  crmController.getLeads.bind(crmController)
);

export default router;
