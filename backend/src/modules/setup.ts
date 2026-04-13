// Module setup file - imports and exports all modules
import { authController } from './auth/controllers/auth.controller';
// Temporarily disable user-group controller to fix compilation
// import { userGroupController } from './auth/controllers/user-group.controller';
import authRoutes from './auth/routes/auth.routes';
// Temporarily disable user-group routes to fix compilation
// import userGroupRoutes from './auth/routes/user-group.routes';
import crmRoutes from './crm/routes/crm.routes';

// Export all controllers for server integration
export { authController };
// export { userGroupController }; // Temporarily disabled

// Export all routes for server integration
export { authRoutes, crmRoutes };
// export { userGroupRoutes }; // Temporarily disabled

// Export services for use in other modules
export { authService } from './auth/services/auth.service';
// Temporarily disable user-group service to fix compilation
// export { userGroupService } from './auth/services/user-group.service';
export { emailService } from './shared/email/email.service';
export { database } from './shared/database/database.service';
export { migrationService } from './shared/database/migration.service';

// Export models for direct database access
export { userModel } from './auth/models/user.model';
// Temporarily disable user-group models to fix compilation
// export { userGroupModel, permissionModel, groupPermissionModel } from './auth/models/user-group.model';

// Export middleware
export { 
  authenticateToken, 
  requireAdmin, 
  requireSalesOrAdmin, 
  requireCrmOrAdmin, 
  requireMemberOrAdmin,
  optionalAuth,
  validateEmail,
  validatePassword,
  sanitizeInput,
  rateLimitByUser
} from './auth/middleware/auth.middleware';

// RBAC middleware temporarily disabled due to compilation issues
// export {
//   requirePermission,
//   requireModulePermission,
//   requireAnyPermission,
//   requireGroup,
//   loadUserPermissions,
//   requireOwnershipOrAdmin,
//   requireCompanyAccess,
//   checkUserPermission,
//   checkUserModulePermission
// } from './auth/middleware/rbac.middleware';

// Export types
export * from './shared/types/common.types';

// Export validators
export * from './auth/validators/auth.validators';
export { validateRequest } from './shared/middleware/validation.middleware';

// Export utilities
import logger, { requestLogger, logError, logAudit, logPerformance } from './shared/utils/logger';

export { logger, requestLogger, logError, logAudit, logPerformance };
