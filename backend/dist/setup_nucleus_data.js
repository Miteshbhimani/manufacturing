"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const odoo_service_1 = require("./services/odoo.service");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const PAGES = [
    {
        page: {
            name: "Nucleus Home", slug: "home", is_published: true,
            seo_title: "Nucleus Metal Cast | High-Precision SS 304 Casting India",
            seo_description: "Nucleus Metal Cast - Leading manufacturer of shell moulding stainless steel pump components in Rajkot. SS 304 casting experts for submersible parts."
        },
        sections: [
            {
                name: "Home Hero", sequence: 10, component_type: "hero",
                title: "Precision Submersible Components", subtitle: "Nucleus Metal Cast: Specialized SS 304 Casting & Machining in Rajkot.", button_text: "Our Products", button_link: "/products"
            },
            {
                name: "Home About", sequence: 20, component_type: "text_image",
                title: "Quality Submersible Solutions", subtitle: "Industrial performance through precision engineering.",
                content: "<p>We specialize in manufacturing critical submersible motor components, focusing on superior SS 304 material grades to ensure long-term durability in corrosive environments.</p>"
            }
        ]
    },
    {
        page: {
            name: "Infrastructure", slug: "capabilities", is_published: true,
            seo_title: "Casting Facility Rajkot | Manufacturing Infrastructure",
            seo_description: "Explore the advanced manufacturing infrastructure of Nucleus Metal Cast. State-of-the-art foundry and machining center at Khirasara GIDC, Rajkot."
        },
        sections: [
            {
                name: "Infra Hero", sequence: 10, component_type: "hero",
                title: "Our Manufacturing Unit", subtitle: "State-of-the-art facility at Khirasara GIDC, Rajkot."
            },
            {
                name: "Infra Details", sequence: 20, component_type: "text_image",
                title: "Factory Specifications",
                content: "<ul><li>Shed No. 2, Plot No. 292, Khirasara Industrial Estate</li><li>Advanced Alloy Casting Units</li><li>Precision Machining Center</li><li>Metrology and Quality Lab</li></ul>"
            }
        ]
    },
    {
        page: {
            name: "About Us", slug: "about", is_published: true,
            seo_title: "About Nucleus Metal Cast | SS 304 Casting Rajkot",
            seo_description: "Learn about Nucleus Metal Cast, a leading manufacturer of precision SS 304 and alloy steel components in Rajkot, Gujarat. Expertise in submersible pump parts."
        },
        sections: [
            {
                name: "About Hero", sequence: 10, component_type: "hero",
                title: "Legacy of Precision", subtitle: "Nucleus Metal Cast: Engineering Excellence in Stainless Steel Casting."
            },
            {
                name: "About Story", sequence: 20, component_type: "text_image",
                title: "Advanced Casting Solutions",
                content: "<p>Led by <strong>Dhavalkumar Pravinchandra</strong>, our facility in Rajkot specializes in high-grade stainless steel casting (SS 304, SS 316). We serve the global water management and industrial sectors with unmatched precision.</p>"
            }
        ]
    },
    {
        page: {
            name: "Our Process", slug: "process", is_published: true,
            seo_title: "Precision Shell Moulding Process | Nucleus Metal Cast",
            seo_description: "Discover our 11-step precision shell moulding process for high-quality industrial castings. From die design to induction melting and CNC finishing."
        },
        sections: [
            {
                name: "Process Hero", sequence: 10, component_type: "hero",
                title: "Our Manufacturing Process", subtitle: "11 Steps of Precision: How we ensure world-class casting quality."
            },
            {
                name: "Process Steps", sequence: 20, component_type: "text_image",
                title: "Engineered for Excellence",
                content: `
          <div class="space-y-4">
            <p><strong>1. Die Design:</strong> Precision engineered CAD/CAM designs for high-accuracy metal patterns.</p>
            <p><strong>2. Sand Preparation:</strong> Specialized resin-coated silica sand for optimal mold stability.</p>
            <p><strong>3. Shell Formation:</strong> Heated patterns create high-definition shells (9-12mm thickness).</p>
            <p><strong>4. Mold Assembly:</strong> Precision alignment of shell halves and internal cores.</p>
            <p><strong>5. Induction Melting:</strong> Controlled melting of SS 304/316 at temperatures up to 1650°C.</p>
            <p><strong>6. Controlled Pouring:</strong> Automated pouring for consistent metallurgical Grain structure.</p>
            <p><strong>7. Mold Shakeout:</strong> Delicate removal of castings from the rigid shell molds.</p>
            <p><strong>8. Shot Blasting:</strong> Surface cleaning to achieve a smooth, non-porous finish.</p>
            <p><strong>9. Heat Treatment:</strong> Precise thermal cycles to enhance mechanical properties.</p>
            <p><strong>10. Spectro Analysis:</strong> Chemical verification for exact alloy composition.</p>
            <p><strong>11. Precision Machining:</strong> Final finishing on high-end CNC and VMC centers.</p>
          </div>
        `
            }
        ]
    }
];
async function setupNucleusData() {
    try {
        console.log("Authenticating with Odoo...");
        await odoo_service_1.OdooService.authenticate();
        console.log("Authenticated successfully.");
        // 1. Cleanup Demo Products
        try {
            console.log("Removing demo products from product.template...");
            const demoProds = await odoo_service_1.OdooService.executeKw('product.template', 'search', [[['name', 'ilike', 'Nexus'], '|', ['name', 'ilike', 'V5-Axis'], ['name', 'ilike', 'H-Series']]]);
            if (demoProds.length > 0) {
                await odoo_service_1.OdooService.executeKw('product.template', 'unlink', [demoProds]);
                console.log(`Deleted ${demoProds.length} demo products.`);
            }
        }
        catch (e) {
            console.log("Skipping product removal. The 'Sales' or 'Inventory' app might not be installed in Odoo.");
        }
        const NUCLEUS_PRODUCTS = [
            {
                name: "Submersible Motor Base – SS 304",
                list_price: 3500,
                sale_ok: true,
                description: "Critical structural component for submersible pumps. Features: SS 304 (Stainless Steel) material, superior corrosion resistance, non-magnetic properties.",
                description_sale: "Structural motor base in SS 304 for corrosive environments.",
                cat: "Submersible Components",
                img: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1000&q=80",
                has3D: true,
                filename: "motor-base.jpg"
            },
            {
                name: "Precision Pump Impeller (SS 316)",
                list_price: 2800,
                sale_ok: true,
                description: "High-efficiency investment cast impeller for chemical and water management. Designed for optimal fluid dynamics and long service life.",
                description_sale: "Investment cast SS 316 impeller for high-efficiency fluid flow.",
                cat: "Submersible Components",
                img: "https://images.unsplash.com/photo-1594819047050-99defca82545?auto=format&fit=crop&w=1000&q=80",
                filename: "impeller.jpg"
            },
            {
                name: "Multistage Pump Diffuser",
                list_price: 2200,
                sale_ok: true,
                description: "Precision shell moulded diffuser for submersible pump units. High dimensional accuracy ensures smooth pressure transitions.",
                description_sale: "Shell moulded diffuser for multistage submersible pumps.",
                cat: "Submersible Components",
                img: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1000&q=80",
                filename: "diffuser.jpg"
            },
            {
                name: "Heavy-Duty Pump Suction Case",
                list_price: 4500,
                sale_ok: true,
                description: "Robust SS 304 suction case designed for high-flow industrial pumps. Excellent fatigue resistance and surface finish.",
                description_sale: "Industrial grade SS 304 suction case for high-flow pumps.",
                cat: "Submersible Components",
                img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80",
                filename: "suction-case.jpg"
            },
            {
                name: "Industrial Bowl Assembly",
                list_price: 6800,
                sale_ok: true,
                description: "Custom-engineered bowl assembly for large-capacity submersible pumps. Precision machined for perfect component alignment.",
                description_sale: "Custom engineered bowl assembly for industrial submersible pumps.",
                cat: "Submersible Components",
                img: "https://images.unsplash.com/photo-1531284895818-f21715974514?auto=format&fit=crop&w=1000&q=80",
                filename: "bowl-assembly.jpg"
            },
            {
                name: "General Engineering Component",
                list_price: 1500,
                sale_ok: true,
                description: "Precision manufactured component for general engineering applications.",
                description_sale: "Precision manufactured component for general engineering applications.",
                cat: "General Engineering Parts",
                img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
                filename: "gen-eng.jpg"
            },
            {
                name: "Industrial Pump Housing",
                list_price: 3200,
                sale_ok: true,
                description: "Heavy-duty pump housing for industrial fluid transfer.",
                description_sale: "Heavy-duty pump housing for industrial fluid transfer.",
                cat: "Pump Parts",
                img: "https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80",
                filename: "pump-housing.jpg"
            },
            {
                name: "Railway Suspension Component",
                list_price: 5500,
                sale_ok: true,
                description: "High-strength suspension parts for railway locomotives and carriages.",
                description_sale: "High-strength suspension parts for railway locomotives and carriages.",
                cat: "Railway Equipment Parts",
                img: "https://images.unsplash.com/photo-1473625247510-8eceb153094d?auto=format&fit=crop&w=1000&q=80",
                filename: "railway-part.jpg"
            },
            {
                name: "Fire Hydrant Valve",
                list_price: 1200,
                sale_ok: true,
                description: "Reliable and durable valves for fire safety and suppression systems.",
                description_sale: "Reliable and durable valves for fire safety and suppression systems.",
                cat: "Fire industry parts",
                img: "https://images.unsplash.com/photo-1621535497270-22c608f10842?auto=format&fit=crop&w=1000&q=80",
                filename: "fire-valve.jpg"
            },
            {
                name: "Turbine Blade Base",
                list_price: 9800,
                sale_ok: true,
                description: "High-temperature resistant base for power generation turbines.",
                description_sale: "High-temperature resistant base for power generation turbines.",
                cat: "Powerplant parts",
                img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80",
                filename: "turbine-base.jpg"
            }
        ];
        try {
            console.log("Adding Nucleus Official Catalog with Local Media to Odoo...");
            const publicPath = path_1.default.join(__dirname, '../public/images');
            if (!fs_1.default.existsSync(publicPath)) {
                fs_1.default.mkdirSync(publicPath, { recursive: true });
            }
            for (const p of NUCLEUS_PRODUCTS) {
                const exists = await odoo_service_1.OdooService.executeKw('product.template', 'search', [[['name', '=', p.name]]]);
                let productId;
                const { cat, img, has3D, filename, ...pData } = p;
                if (exists.length > 0) {
                    productId = exists[0];
                    await odoo_service_1.OdooService.executeKw('product.template', 'write', [[productId], pData]);
                }
                else {
                    productId = await odoo_service_1.OdooService.executeKw('product.template', 'create', [pData]);
                }
                const categories = await odoo_service_1.OdooService.executeKw('product.category', 'search', [[['name', '=', cat]]]);
                let catId = categories.length > 0 ? categories[0] : await odoo_service_1.OdooService.executeKw('product.category', 'create', [{ name: cat }]);
                await odoo_service_1.OdooService.executeKw('product.template', 'write', [[productId], { categ_id: catId }]);
                // Local Image Download & Odoo Upload
                if (img && filename) {
                    try {
                        console.log(`Downloading and uploading image for ${p.name}...`);
                        const response = await axios_1.default.get(img, { responseType: 'arraybuffer' });
                        const buffer = Buffer.from(response.data, 'binary');
                        // Save locally
                        fs_1.default.writeFileSync(path_1.default.join(publicPath, filename), buffer);
                        // Upload to Odoo
                        const base64 = buffer.toString('base64');
                        await odoo_service_1.OdooService.executeKw('product.template', 'write', [[productId], { image_1920: base64 }]);
                    }
                    catch (e) {
                        console.log(`Image processing failed for ${p.name}`);
                    }
                }
                console.log(`Processed product: ${p.name}`);
            }
        }
        catch (e) {
            console.log("Skipping product creation. The 'Sales' or 'Inventory' app might not be installed in Odoo.");
        }
        // 4. Seed CMS Pages
        console.log("Seeding CMS Pages into headless.page...");
        for (const pageData of PAGES) {
            try {
                // Clear if exists
                const existingPage = await odoo_service_1.OdooService.executeKw('headless.page', 'search', [[['slug', '=', pageData.page.slug]]]);
                if (existingPage.length > 0) {
                    await odoo_service_1.OdooService.executeKw('headless.page', 'unlink', [existingPage]);
                }
                // Create page
                const pageId = await odoo_service_1.OdooService.executeKw('headless.page', 'create', [pageData.page]);
                // Create sections
                for (const sec of pageData.sections) {
                    await odoo_service_1.OdooService.executeKw('headless.section', 'create', [{ ...sec, page_id: pageId }]);
                }
                console.log(`Created/Updated page: ${pageData.page.slug}`);
            }
            catch (e) {
                console.error(`Failed to seed page ${pageData.page.slug}:`, e.message || e);
            }
        }
        console.log("Migration to Nucleus Metal Cast completed successfully!");
    }
    catch (error) {
        console.error("Migration failed:", error.message || error);
        process.exit(1);
    }
}
setupNucleusData();
