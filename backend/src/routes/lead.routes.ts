import { Router } from 'express';
import { createLead } from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.post('/', authMiddleware, createLead);
export default router;
