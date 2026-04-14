import { Router } from 'express';
import { login, verify, logoutRedirect, createOdooSession } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.get('/verify', verify);
router.get('/logout-redirect', logoutRedirect);
router.post('/create-odoo-session', createOdooSession);

export default router;
