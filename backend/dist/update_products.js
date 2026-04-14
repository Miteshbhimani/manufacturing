"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const odoo_service_1 = require("./services/odoo.service");
async function setupCategories() {
    try {
        await odoo_service_1.OdooService.authenticate();
        // Create categories
        const catMap = {};
        const categories = ['Industrial Valves', 'CNC Machinery', 'Hydraulic Systems'];
        for (const c of categories) {
            // Check if exists
            let existing = await odoo_service_1.OdooService.executeKw('product.category', 'search', [[['name', '=', c]]]);
            if (existing.length > 0) {
                catMap[c] = existing[0];
            }
            else {
                const catId = await odoo_service_1.OdooService.executeKw('product.category', 'create', [{ name: c }]);
                catMap[c] = catId;
            }
        }
        // Assign to products
        const products = await odoo_service_1.OdooService.executeKw('product.template', 'search_read', [[]], { fields: ['id', 'name'] });
        for (const p of products) {
            if (p.name.includes("Valve")) {
                await odoo_service_1.OdooService.executeKw('product.template', 'write', [[p.id], { categ_id: catMap['Industrial Valves'] }]);
            }
            else if (p.name.includes("Milling")) {
                await odoo_service_1.OdooService.executeKw('product.template', 'write', [[p.id], { categ_id: catMap['CNC Machinery'] }]);
            }
            else if (p.name.includes("Pump")) {
                await odoo_service_1.OdooService.executeKw('product.template', 'write', [[p.id], { categ_id: catMap['Hydraulic Systems'] }]);
            }
        }
        console.log("Successfully categorized products inside Odoo!");
    }
    catch (err) {
        console.error(err);
    }
}
setupCategories();
