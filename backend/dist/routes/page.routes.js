"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const page_controller_1 = require("../controllers/page.controller");
const router = (0, express_1.Router)();
router.get('/:slug', page_controller_1.getPage);
exports.default = router;
