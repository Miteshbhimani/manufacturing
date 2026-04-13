import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { 
  authenticateToken, 
  requireAdmin, 
  validateEmail, 
  validatePassword,
  rateLimitByUser 
} from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', 
  validateEmail,
  validatePassword,
  rateLimitByUser(5, 15 * 60 * 1000), // 5 requests per 15 minutes
  authController.register.bind(authController)
);

router.post('/login', 
  validateEmail,
  // rateLimitByUser(100, 15 * 60 * 1000), // Temporarily disabled for testing
  authController.login.bind(authController)
);

router.post('/refresh-token', 
  rateLimitByUser(10, 60 * 60 * 1000), // 10 requests per hour
  authController.refreshToken.bind(authController)
);

router.post('/forgot-password', 
  validateEmail,
  rateLimitByUser(3, 15 * 60 * 1000), // 3 requests per 15 minutes
  authController.forgotPassword.bind(authController)
);

router.post('/reset-password', 
  validatePassword,
  rateLimitByUser(5, 60 * 60 * 1000), // 5 requests per hour
  authController.resetPassword.bind(authController)
);

router.post('/verify-email', 
  rateLimitByUser(10, 60 * 60 * 1000), // 10 requests per hour
  authController.verifyEmail.bind(authController)
);

// Protected routes
router.post('/logout', 
  authenticateToken,
  authController.logout.bind(authController)
);

router.get('/me', 
  authenticateToken,
  authController.getCurrentUser.bind(authController)
);

router.post('/change-password', 
  authenticateToken,
  validatePassword,
  rateLimitByUser(5, 60 * 60 * 1000), // 5 requests per hour
  authController.changePassword.bind(authController)
);

// Admin only routes (for future use)
// router.get('/users', 
//   authenticateToken,
//   requireAdmin,
//   authController.getAllUsers.bind(authController)
// );

export default router;
