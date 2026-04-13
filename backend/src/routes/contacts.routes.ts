import { Router } from 'express';
import { authenticateToken, requireCrmOrAdmin } from '../modules/auth/middleware/auth.middleware';
import { contactController } from '../controllers/contact.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Contact management routes
router.get('/', contactController.getAllContacts.bind(contactController));
router.get('/:id', contactController.getContactById.bind(contactController));
router.post('/', requireCrmOrAdmin, contactController.createContact.bind(contactController));
router.put('/:id', requireCrmOrAdmin, contactController.updateContact.bind(contactController));
router.delete('/:id', requireCrmOrAdmin, contactController.deleteContact.bind(contactController));

export default router;
