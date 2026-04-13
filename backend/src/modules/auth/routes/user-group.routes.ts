import { Router } from 'express';
import { userGroupController } from '../controllers/user-group.controller';
import { authenticateJWT } from '../../../middleware/auth.middleware';

const router = Router();

// Apply authentication to all routes
router.use(authenticateJWT);

// Group management routes (simplified without validation for now)
router.post('/groups', userGroupController.createGroup.bind(userGroupController));
router.put('/groups/:id', userGroupController.updateGroup.bind(userGroupController));
router.delete('/groups/:id', userGroupController.deleteGroup.bind(userGroupController));
router.get('/groups/:id', userGroupController.getGroupDetails.bind(userGroupController));
router.get('/companies/:companyId/groups', userGroupController.getCompanyGroups.bind(userGroupController));

// Group member management
router.post('/groups/:groupId/members', userGroupController.addUserToGroup.bind(userGroupController));
router.delete('/groups/:groupId/members/:userId', userGroupController.removeUserFromGroup.bind(userGroupController));
router.get('/users/:userId/groups', userGroupController.getUserGroups.bind(userGroupController));

// Permission management routes
router.get('/permissions', userGroupController.getAllPermissions.bind(userGroupController));
router.get('/permissions/modules/:module', userGroupController.getPermissionsByModule.bind(userGroupController));
router.get('/users/:userId/permissions', userGroupController.getUserPermissions.bind(userGroupController));
router.post('/users/:userId/check-permission', userGroupController.checkUserPermission.bind(userGroupController));

// Permission matrix
router.get('/companies/:companyId/permission-matrix', userGroupController.getPermissionMatrix.bind(userGroupController));
router.post('/permissions/bulk-update', userGroupController.bulkUpdatePermissions.bind(userGroupController));

export default router;
