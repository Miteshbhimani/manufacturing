import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../modules/auth/middleware/auth.middleware';
import { userController } from '../controllers/user.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// User management routes
router.get('/', requireAdmin, userController.getAllUsers.bind(userController));
router.get('/:id', requireAdmin, userController.getUserById.bind(userController));
router.post('/', requireAdmin, userController.createUser.bind(userController));
router.put('/:id', requireAdmin, userController.updateUser.bind(userController));
router.delete('/:id', requireAdmin, userController.deleteUser.bind(userController));

export default router;
