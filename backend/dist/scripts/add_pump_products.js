"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const odoo_service_1 = require("../services/odoo.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const IMAGE_DIR = '/home/mitesh/Documents/manufacturing_website/pump_enhanced_HQ/pump_enhanced';
const extractProductInfo = () => {
    const imageFiles = fs.readdirSync(IMAGE_DIR)
        .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
        .sort((a, b) => {
        const aNum = parseInt(a.split('.')[0]);
        const bNum = parseInt(b.split('.')[0]);
        return aNum - bNum;
    });
    const products = [];
    // Map images to product names based on typical pump parts
    const productNames = [
        'Pump Casing',
        'Impeller Type A',
        'Impeller Type B',
        'Wear Ring',
        'Shaft Sleeve',
        'Mechanical Seal',
        'Gasket Kit',
        'Bearing Housing',
        'Thrust Bearing',
        'Radial Bearing',
        'Pump Shaft',
        'Lantern Ring',
        'Stuffing Box',
        'Seal Chamber',
        'Suction Nozzle',
        'Discharge Nozzle',
        'Coupling Hub',
        'Key Stock',
        'Lock Nut',
        'Drain Plug',
        'Vent Plug',
        'Base Plate'
    ];
    for (let i = 0; i < imageFiles.length && i < productNames.length; i++) {
        const imagePath = path.join(IMAGE_DIR, imageFiles[i]);
        products.push({
            name: productNames[i],
            description: `High-quality pump component - ${productNames[i]}. Precision engineered for durability and optimal performance in industrial applications.`,
            imagePath: imagePath,
            category: 'Pump Parts',
            price: Math.floor(Math.random() * 5000) + 500 // Random price between 500-5500
        });
    }
    return products;
};
const createPumpCategory = async () => {
    try {
        // Check if Pump Parts category exists
        const existing = await odoo_service_1.OdooService.executeKw('product.category', 'search', [[['name', '=', 'Pump Parts']]]);
        if (existing.length > 0) {
            console.log('Pump Parts category already exists:', existing[0]);
            return existing[0];
        }
        // Create new category
        const categoryId = await odoo_service_1.OdooService.executeKw('product.category', 'create', [{
                name: 'Pump Parts',
                parent_id: false // Top-level category
            }]);
        console.log('Created Pump Parts category:', categoryId);
        return categoryId;
    }
    catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};
const imageToBase64 = (imagePath) => {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        return imageBuffer.toString('base64');
    }
    catch (error) {
        console.error('Error reading image:', imagePath, error);
        throw error;
    }
};
const addPumpProducts = async () => {
    try {
        console.log('Starting pump products import...');
        // Authenticate with Odoo
        await odoo_service_1.OdooService.authenticate();
        console.log('Authenticated with Odoo successfully');
        // Create category
        const categoryId = await createPumpCategory();
        // Extract product info
        const products = extractProductInfo();
        console.log(`Found ${products.length} pump products to import`);
        let successCount = 0;
        let errorCount = 0;
        for (const product of products) {
            try {
                // Convert image to base64
                const base64Image = imageToBase64(product.imagePath);
                // Create product in Odoo
                const productId = await odoo_service_1.OdooService.executeKw('product.template', 'create', [{
                        name: product.name,
                        description: product.description,
                        description_sale: product.description,
                        image_1920: base64Image,
                        list_price: product.price || 1000,
                        sale_ok: true,
                        purchase_ok: true,
                        categ_id: categoryId,
                        default_code: `PP-${product.name.replace(/\s+/g, '-').toUpperCase()}`,
                        weight: 1.0,
                        uom_id: 1, // Units
                        uom_po_id: 1 // Purchase Units
                    }]);
                console.log(`✓ Created product: ${product.name} (ID: ${productId})`);
                successCount++;
            }
            catch (error) {
                console.error(`✗ Failed to create product ${product.name}:`, error.message);
                errorCount++;
            }
        }
        console.log(`\nImport complete!`);
        console.log(`Successfully created: ${successCount} products`);
        console.log(`Failed: ${errorCount} products`);
    }
    catch (error) {
        console.error('Fatal error during import:', error);
        throw error;
    }
};
// Run the import
addPumpProducts()
    .then(() => {
    console.log('Pump products import completed successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
});
