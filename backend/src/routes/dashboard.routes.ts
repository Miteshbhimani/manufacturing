import { Router } from 'express';
import { authenticateToken } from '../modules/auth/middleware/auth.middleware';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Dashboard routes
router.get('/stats', dashboardController.getStats.bind(dashboardController));
router.get('/activity', dashboardController.getActivity.bind(dashboardController));

export default router;
