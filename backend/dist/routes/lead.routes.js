"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = require("../controllers/lead.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authMiddleware, lead_controller_1.createLead);
exports.default = router;
