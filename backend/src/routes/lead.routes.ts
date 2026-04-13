import { Router } from 'express';
import { createLead } from '../controllers/lead.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.post('/', authenticateJWT, createLead);
export default router;
