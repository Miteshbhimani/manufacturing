"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = exports.getCategories = exports.syncEncoreProducts = exports.getProducts = void 0;
const odoo_service_1 = require("../services/odoo.service");
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
// Validation schemas
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').max(50, 'Category name too long')
});
const seedCategoriesSchema = zod_1.z.array(categorySchema);
const getProducts = async (req, res) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const CORE_PRODUCTS = [
        {
            id: 1,
            name: "Submersible Motor Base – SS 304",
            list_price: 3500,
            description: "Critical structural component for submersible pumps. Features: SS 304 (Stainless Steel) material, superior corrosion resistance, non-magnetic properties.",
            description_sale: "Structural motor base in SS 304 for corrosive environments.",
            categ_id: [1, "Submersible Components"],
            image_1920: "https://placehold.co/600x400/eeeeee/999999?text=Submersible+Motor+Base"
        },
        {
            id: 2,
            name: "Precision Pump Impeller (SS 316)",
            list_price: 2800,
            description: "High-efficiency investment cast impeller for chemical and water management. Designed for optimal fluid dynamics and long service life.",
            description_sale: "Investment cast SS 316 impeller for high-efficiency fluid flow.",
            categ_id: [1, "Submersible Components"],
            image_1920: "https://placehold.co/600x400/eeeeee/999999?text=Precision+Impeller"
        },
        {
            id: 3,
            name: "Multistage Pump Diffuser",
            list_price: 2200,
            description: "Precision shell moulded diffuser for submersible pump units. High dimensional accuracy ensures smooth pressure transitions.",
            description_sale: "Shell moulded diffuser for multistage submersible pumps.",
            categ_id: [1, "Submersible Components"],
            image_1920: "https://placehold.co/600x400/eeeeee/999999?text=Pump+Diffuser"
        },
        {
            id: 4,
            name: "Heavy-Duty Pump Suction Case",
            list_price: 4500,
            description: "Robust SS 304 suction case designed for high-flow industrial pumps. Excellent fatigue resistance and surface finish.",
            description_sale: "Industrial grade SS 304 suction case for high-flow pumps.",
            categ_id: [1, "Submersible Components"],
            image_1920: "https://placehold.co/600x400/eeeeee/999999?text=Suction+Case"
        },
        {
            id: 5,
            name: "Industrial Bowl Assembly",
            list_price: 6800,
            description: "Custom-engineered bowl assembly for large-capacity submersible pumps. Precision machined for perfect component alignment.",
            description_sale: "Custom engineered bowl assembly for industrial submersible pumps.",
            categ_id: [1, "Submersible Components"],
            image_1920: "https://placehold.co/600x400/eeeeee/999999?text=Bowl+Assembly"
        }
    ];
    try {
        if (isDevelopment) {
            console.log('[PRODUCT_DEBUG] Attempting to fetch products from Odoo...');
        }
        const odooProducts = await odoo_service_1.OdooService.executeKw('product.template', 'search_read', [[['sale_ok', '=', true]]], { fields: ['id', 'name', 'list_price', 'description_sale', 'categ_id', 'description', 'image_1920'], limit: 50 });
        if (isDevelopment) {
            console.log(`[PRODUCT_DEBUG] Successfully fetched ${odooProducts.length} products from Odoo`);
        }
        // If no products from Odoo, use fallback products
        if (odooProducts.length === 0) {
            if (isDevelopment) {
                console.log('[PRODUCT_DEBUG] No products from Odoo, using fallback products');
            }
            const response = { success: true, data: CORE_PRODUCTS, isFallback: true };
            res.json(response);
            return;
        }
        const odooUrl = process.env.ODOO_URL;
        const enriched = odooProducts.map((p) => {
            if (isDevelopment) {
                console.log(`[PRODUCT_DEBUG] Product ${p.id}: ${p.name}`);
                console.log(`[PRODUCT_DEBUG] Image field present:`, !!p.image_1920);
                console.log(`[PRODUCT_DEBUG] Image field type:`, typeof p.image_1920);
                console.log(`[PRODUCT_DEBUG] Image field length:`, p.image_1920 ? p.image_1920.length : 'N/A');
            }
            let processedImage = null;
            if (p.image_1920) {
                if (typeof p.image_1920 === 'string') {
                    if (p.image_1920.startsWith('iVBORw0KGgo') || p.image_1920.startsWith('/9j/') || p.image_1920.startsWith('R0lGOD')) {
                        // Handle base64 images (JPEG, PNG, GIF)
                        processedImage = `data:image/jpeg;base64,${p.image_1920}`;
                        console.log(`[PRODUCT_DEBUG] Processed as base64 image`);
                    }
                    else if (p.image_1920.startsWith('data:image')) {
                        // Handle already formatted data URLs
                        processedImage = p.image_1920;
                        console.log(`[PRODUCT_DEBUG] Already formatted data URL`);
                    }
                    else if (p.image_1920.startsWith('http')) {
                        // Handle HTTP URLs
                        processedImage = p.image_1920;
                        console.log(`[PRODUCT_DEBUG] HTTP URL image`);
                    }
                    else {
                        // Handle Odoo image field paths or IDs
                        const imageUrl = `${odooUrl}/web/image?model=product.template&field=image_1920&id=${p.id}`;
                        processedImage = imageUrl;
                        console.log(`[PRODUCT_DEBUG] Using Odoo web/image URL`);
                    }
                }
                else {
                    // Handle other types (shouldn't happen but just in case)
                    const imageUrl = `${odooUrl}/web/image?model=product.template&field=image_1920&id=${p.id}`;
                    processedImage = imageUrl;
                    console.log(`[PRODUCT_DEBUG] Fallback to web/image URL`);
                }
            }
            else {
                // No image data - use placeholder
                processedImage = "https://placehold.co/600x400/eeeeee/999999?text=No+Image";
                console.log(`[PRODUCT_DEBUG] No image data, using placeholder`);
            }
            if (isDevelopment) {
                console.log(`[PRODUCT_DEBUG] Final processed image:`, processedImage ? processedImage.substring(0, 100) + '...' : 'null');
            }
            return {
                ...p,
                image_1920: processedImage
            };
        });
        const response = { success: true, data: enriched };
        res.json(response);
    }
    catch (error) {
        console.error("Odoo product fetch failed, returning core catalog:", error.message);
        const fallbackResponse = { success: true, data: CORE_PRODUCTS, isFallback: true };
        res.json(fallbackResponse);
    }
};
exports.getProducts = getProducts;
const syncEncoreProducts = async (req, res) => {
    const urls = [
        'https://encoreshellcastllp.com/encoreshellcastllp.com/industries-we-serve.html'
    ];
    let created = [];
    try {
        for (const url of urls) {
            const result = await axios_1.default.get(url);
            const html = result.data;
            const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
            let match;
            while ((match = imgRegex.exec(html)) !== null) {
                const src = match[1];
                if (src && src.includes('assets/')) {
                    let fullSrc = src;
                    if (!src.startsWith('http')) {
                        const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
                        fullSrc = baseUrl + src;
                    }
                    // Get alt or name
                    const altMatch = match[0].match(/alt=["']([^"']+)["']/i);
                    let name = altMatch ? altMatch[1] : ('Product ' + Math.floor(Math.random() * 1000));
                    if (!name || name === '')
                        name = 'Encore Part';
                    // Optional: avoid duplicates (very basic check)
                    if (created.find(c => c.name === name))
                        continue;
                    // Download image as base64
                    try {
                        const imgResponse = await axios_1.default.get(fullSrc, { responseType: 'arraybuffer' });
                        const base64Img = Buffer.from(imgResponse.data, 'binary').toString('base64');
                        // Create in Odoo
                        const productId = await odoo_service_1.OdooService.executeKw('product.template', 'create', [{
                                name: name,
                                image_1920: base64Img,
                                list_price: 0,
                                sale_ok: true,
                                description_sale: "Imported from Encore Shell Cast LLP"
                            }]);
                        created.push({ id: productId, name, url: fullSrc });
                    }
                    catch (e) {
                        console.error("Failed to process image", fullSrc, e.message);
                    }
                }
            }
        }
        res.json({ success: true, count: created.length, created });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
exports.syncEncoreProducts = syncEncoreProducts;
const getCategories = async (req, res) => {
    try {
        const odooCategories = await odoo_service_1.OdooService.executeKw('product.category', 'search_read', [[]], { fields: ['id', 'name'] });
        res.json({ success: true, data: odooCategories });
    }
    catch (error) {
        console.error("Odoo category fetch failed", error.message);
        res.json({ success: false, data: [], error: error.message });
    }
};
exports.getCategories = getCategories;
const seedCategories = async (req, res) => {
    try {
        const cats = [
            "General Engineering Parts",
            "Pump Parts",
            "Railway Equipment Parts",
            "Fire industry parts",
            "Powerplant parts"
        ];
        const created = [];
        for (const cat of cats) {
            const exists = await odoo_service_1.OdooService.executeKw('product.category', 'search', [[['name', '=', cat]]]);
            if (exists.length === 0) {
                const id = await odoo_service_1.OdooService.executeKw('product.category', 'create', [{ name: cat }]);
                created.push({ id, cat });
            }
        }
        const response = { success: true, data: { created } };
        res.json(response);
    }
    catch (error) {
        const errorResponse = { success: false, error: error.message };
        res.status(500).json(errorResponse);
    }
};
exports.seedCategories = seedCategories;
