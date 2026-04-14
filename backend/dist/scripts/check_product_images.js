"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProductImages = checkProductImages;
const odoo_service_1 = require("../services/odoo.service");
const axios_1 = __importDefault(require("axios"));
async function checkProductImages() {
    console.log('=== CHECKING PRODUCT IMAGES ===');
    try {
        // Get all products with image data
        const products = await odoo_service_1.OdooService.executeKw('product.template', 'search_read', [[['sale_ok', '=', true]]], { fields: ['id', 'name', 'image_1920'], limit: 20 });
        console.log(`Found ${products.length} products`);
        const odooUrl = process.env.ODOO_URL || 'http://localhost:8069';
        for (const product of products) {
            console.log(`\n--- Product: ${product.name} (ID: ${product.id}) ---`);
            if (product.image_1920) {
                console.log('Image data present:');
                console.log('- Type:', typeof product.image_1920);
                console.log('- Length:', product.image_1920.length);
                console.log('- Starts with:', product.image_1920.substring(0, 50));
                // Test different URL formats
                const urls = [
                    `${odooUrl}/web/image?model=product.template&field=image_1920&id=${product.id}`,
                    `${odooUrl}/web/image/product.template/${product.id}/image_1920`,
                    `${odooUrl}/web/image/${product.id}/image_1920`
                ];
                for (const url of urls) {
                    try {
                        const response = await axios_1.default.head(url, { timeout: 5000 });
                        console.log(`- ${url}: ${response.status} ${response.statusText} (${response.headers['content-length'] || 'unknown size'})`);
                        if (response.status === 200) {
                            break; // Found working URL
                        }
                    }
                    catch (error) {
                        console.log(`- ${url}: Failed - ${error.message}`);
                    }
                }
            }
            else {
                console.log('No image data found');
                // Try to add a placeholder image
                try {
                    const placeholderUrl = 'https://placehold.co/600x400/0b3d91/ffffff?text=' + encodeURIComponent(product.name);
                    const response = await axios_1.default.get(placeholderUrl, { responseType: 'arraybuffer' });
                    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                    await odoo_service_1.OdooService.executeKw('product.template', 'write', [[product.id], {
                            image_1920: base64Image
                        }]);
                    console.log('Added placeholder image to product');
                }
                catch (error) {
                    console.log('Failed to add placeholder image:', error.message);
                }
            }
        }
        console.log('\n=== CHECK COMPLETE ===');
    }
    catch (error) {
        console.error('Error checking product images:', error);
    }
}
// Run if called directly
if (require.main === module) {
    checkProductImages();
}
