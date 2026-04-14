"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const odoo_service_1 = require("../services/odoo.service");
const authMiddleware = async (req, res, next) => {
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
    if (!userId) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
    }
    try {
        // Check if user exists in Odoo
        const userDetail = await odoo_service_1.OdooService.executeKw('res.users', 'read', [[Number(userId)], ['id']]);
        if (!userDetail || userDetail.length === 0) {
            res.status(403).json({ success: false, message: "Account not found or invalid." });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ success: false, message: "Authentication service error" });
    }
};
exports.authMiddleware = authMiddleware;
