import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../modules/auth/middleware/auth.middleware';
import { companyController } from '../controllers/company.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Company management routes
router.get('/', companyController.getAllCompanies.bind(companyController));
router.get('/:id', companyController.getCompanyById.bind(companyController));
router.post('/', requireAdmin, companyController.createCompany.bind(companyController));
router.put('/:id', requireAdmin, companyController.updateCompany.bind(companyController));
router.delete('/:id', requireAdmin, companyController.deleteCompany.bind(companyController));

export default router;
