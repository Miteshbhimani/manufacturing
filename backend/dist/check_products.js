"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const odoo_service_1 = require("./services/odoo.service");
async function checkProducts() {
    try {
        const products = await odoo_service_1.OdooService.executeKw('product.template', 'search_read', [[['sale_ok', '=', true]]], { fields: ['id', 'name', 'image_1920'], limit: 10 });
        products.forEach((p) => {
            console.log(`Product: ${p.name}, ID: ${p.id}, Image size: ${p.image_1920 ? p.image_1920.length : 0}`);
        });
    }
    catch (error) {
        console.error('Error checking products:', error);
    }
}
checkProducts();
