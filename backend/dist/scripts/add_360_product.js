"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add360ProductToOdoo = add360ProductToOdoo;
exports.verify360Product = verify360Product;
const fs_1 = __importDefault(require("fs"));
const odoo_service_1 = require("../services/odoo.service");
// Extract the base64 image from the HTML file
function extract360ImageFromHTML() {
    const htmlPath = '/home/mitesh/Documents/manufacturing_website/pump_360_single_image.html';
    const htmlContent = fs_1.default.readFileSync(htmlPath, 'utf8');
    // Find the base64 image data
    const imgMatch = htmlContent.match(/src="data:image\/jpeg;base64,([^"]+)"/);
    if (!imgMatch) {
        throw new Error('No base64 image found in HTML file');
    }
    return imgMatch[1];
}
// Create product with 360-degree image in Odoo
async function add360ProductToOdoo() {
    try {
        console.log('Starting 360-degree product import to Odoo...');
        // Authenticate with Odoo
        await odoo_service_1.OdooService.authenticate();
        console.log('✓ Authenticated with Odoo successfully');
        // Extract the base64 image
        const base64Image = extract360ImageFromHTML();
        console.log('✓ Extracted 360-degree sprite image from HTML');
        // Check if product already exists
        const existingProducts = await odoo_service_1.OdooService.executeKw('product.template', 'search_read', [[['name', '=', '360° Pump Assembly']]], { fields: ['id', 'name'] });
        if (existingProducts.length > 0) {
            console.log('✓ 360° Pump product already exists in Odoo');
            console.log(`Product ID: ${existingProducts[0].id}`);
            return existingProducts[0].id;
        }
        // Create or find the "360° Products" category
        let categoryId;
        const existingCategories = await odoo_service_1.OdooService.executeKw('product.category', 'search_read', [[['name', '=', '360° Products']]], { fields: ['id', 'name'] });
        if (existingCategories.length > 0) {
            categoryId = existingCategories[0].id;
            console.log('✓ Found existing 360° Products category');
        }
        else {
            categoryId = await odoo_service_1.OdooService.executeKw('product.category', 'create', [{
                    name: '360° Products',
                    parent_id: false
                }]);
            console.log('✓ Created new 360° Products category');
        }
        // Create the product with 360-degree image
        const productId = await odoo_service_1.OdooService.executeKw('product.template', 'create', [{
                name: '360° Pump Assembly',
                description: 'Complete pump assembly with 360-degree interactive viewing. This product demonstrates advanced 360-degree rotation capabilities with 21 different viewing angles, allowing customers to examine the product from every perspective.',
                description_sale: 'Interactive 360° pump assembly viewer with 21 rotation angles for complete product inspection.',
                list_price: 8500.00,
                sale_ok: true,
                purchase_ok: true,
                categ_id: categoryId,
                default_code: 'PP-360-001',
                weight: 15.5,
                uom_id: 1, // Units
                uom_po_id: 1, // Purchase Units
                image_1920: base64Image
            }]);
        console.log('✓ Successfully created 360° Pump product in Odoo');
        console.log(`Product ID: ${productId}`);
        console.log(`Category ID: ${categoryId}`);
        // Add additional product variants with different 360-degree views
        const variants = [
            {
                name: '360° Pump Assembly - Industrial Grade',
                description: 'Heavy-duty pump assembly with 360° viewing for industrial applications.',
                list_price: 9500.00,
                default_code: 'PP-360-002'
            },
            {
                name: '360° Pump Assembly - Marine Grade',
                description: 'Marine-grade pump assembly with corrosion-resistant 360° viewing.',
                list_price: 10500.00,
                default_code: 'PP-360-003'
            }
        ];
        for (const variant of variants) {
            const variantId = await odoo_service_1.OdooService.executeKw('product.template', 'create', [{
                    ...variant,
                    description_sale: variant.description,
                    sale_ok: true,
                    purchase_ok: true,
                    categ_id: categoryId,
                    weight: 15.5,
                    uom_id: 1,
                    uom_po_id: 1,
                    image_1920: base64Image
                }]);
            console.log(`✓ Created variant: ${variant.name} (ID: ${variantId})`);
        }
        console.log('\n🎉 360-degree products successfully added to Odoo!');
        console.log('\nProduct Summary:');
        console.log('- Main Product: 360° Pump Assembly');
        console.log('- Variants: Industrial Grade, Marine Grade');
        console.log('- 360° Features: 21 rotation frames, interactive viewing');
        console.log('- Images: High-quality sprite-based 360° rotation');
        return productId;
    }
    catch (error) {
        console.error('❌ Failed to add 360° product to Odoo:', error.message);
        throw error;
    }
}
// Function to verify the product was created correctly
async function verify360Product(productId) {
    try {
        console.log('\n🔍 Verifying 360° product creation...');
        const product = await odoo_service_1.OdooService.executeKw('product.template', 'read', [[productId]], { fields: ['id', 'name', 'list_price', 'categ_id', 'image_1920'] });
        if (product.length > 0) {
            const p = product[0];
            console.log('✓ Product verification successful:');
            console.log(`  - Name: ${p.name}`);
            console.log(`  - Price: $${p.list_price}`);
            console.log(`  - Category: ${p.categ_id}`);
            console.log(`  - 360° Image: ${p.image_1920 ? 'Present' : 'Missing'}`);
        }
        else {
            console.log('❌ Product verification failed - product not found');
        }
    }
    catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}
// Main execution
async function main() {
    try {
        const productId = await add360ProductToOdoo();
        await verify360Product(productId);
        console.log('\n✅ All operations completed successfully!');
        console.log('You can now view the 360° products on your website.');
    }
    catch (error) {
        console.error('\n❌ Operation failed:', error);
        process.exit(1);
    }
}
// Run if called directly
if (require.main === module) {
    main();
}
