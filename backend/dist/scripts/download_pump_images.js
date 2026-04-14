"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAllPumpImages = downloadAllPumpImages;
exports.generateUpdatedProductsData = generateUpdatedProductsData;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// High-quality industrial pump images from various sources
const pumpImageSources = {
    // Impeller images
    impeller: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80'
    ],
    // Pump casing images
    casing: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80'
    ],
    // Mechanical seal images
    seal: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80'
    ],
    // Shaft sleeve images
    shaft: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80'
    ],
    // Wear ring images
    wearRing: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80'
    ],
    // Gasket kit images
    gasket: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80'
    ]
};
async function downloadImage(url, filepath) {
    try {
        const response = await (0, axios_1.default)({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        // Create directory if it doesn't exist
        const dir = path_1.default.dirname(filepath);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        // Save the file
        const writer = fs_1.default.createWriteStream(filepath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
    catch (error) {
        console.error(`Error downloading ${url}:`, error);
    }
}
async function downloadAllPumpImages() {
    const outputDir = '/home/mitesh/Documents/manufacturing_website/frontend/public/pump-images-360';
    console.log('Starting download of 360-degree pump images...');
    for (const [partType, urls] of Object.entries(pumpImageSources)) {
        console.log(`Downloading ${partType} images...`);
        for (let i = 0; i < urls.length; i++) {
            const viewNames = ['front', 'right', 'back', 'left', 'top', 'bottom'];
            const url = urls[i];
            const viewName = viewNames[i];
            const filename = `${partType}_${viewName}.jpg`;
            const filepath = path_1.default.join(outputDir, partType, filename);
            await downloadImage(url, filepath);
            console.log(`Downloaded: ${filename}`);
        }
    }
    console.log('All pump images downloaded successfully!');
    console.log(`Images saved to: ${outputDir}`);
}
// Generate updated products data with local image paths
function generateUpdatedProductsData() {
    const updatedProducts = [
        {
            id: "pump-casing",
            slug: "pump-casing-assembly",
            name: "Pump Casing Assembly",
            shortDescription: "Heavy-duty pump casing designed for high-pressure industrial applications with precision engineering.",
            category: "Pump Parts",
            industry: "Industrial Manufacturing",
            heroImage: "/pump-images-360/casing/casing_front.jpg",
            images360: {
                front: "/pump-images-360/casing/casing_front.jpg",
                right: "/pump-images-360/casing/casing_right.jpg",
                back: "/pump-images-360/casing/casing_back.jpg",
                left: "/pump-images-360/casing/casing_left.jpg",
                top: "/pump-images-360/casing/casing_top.jpg",
                bottom: "/pump-images-360/casing/casing_bottom.jpg"
            },
            specs: [
                "Material: Cast Iron SS 304",
                "Pressure Rating: Up to 250 PSI",
                "Temperature Range: -20°C to 120°C",
                "Corrosion Resistance: Excellent"
            ]
        },
        {
            id: "impeller-type-a",
            slug: "impeller-type-a-closed",
            name: "Impeller Type A - Closed",
            shortDescription: "Closed-type impeller for high-efficiency fluid dynamics with balanced performance characteristics.",
            category: "Pump Parts",
            industry: "Fluid Dynamics",
            heroImage: "/pump-images-360/impeller/impeller_front.jpg",
            images360: {
                front: "/pump-images-360/impeller/impeller_front.jpg",
                right: "/pump-images-360/impeller/impeller_right.jpg",
                back: "/pump-images-360/impeller/impeller_back.jpg",
                left: "/pump-images-360/impeller/impeller_left.jpg",
                top: "/pump-images-360/impeller/impeller_top.jpg",
                bottom: "/pump-images-360/impeller/impeller_bottom.jpg"
            },
            specs: [
                "Material: Stainless Steel SS 316",
                "Type: Closed Impeller",
                "Efficiency: 85%+",
                "Application: Chemical Processing"
            ]
        },
        {
            id: "mechanical-seal",
            slug: "mechanical-seal-assembly",
            name: "Mechanical Seal Assembly",
            shortDescription: "High-performance mechanical seal for leak-free operation in demanding pump applications.",
            category: "Pump Parts",
            industry: "Chemical Processing",
            heroImage: "/pump-images-360/seal/seal_front.jpg",
            images360: {
                front: "/pump-images-360/seal/seal_front.jpg",
                right: "/pump-images-360/seal/seal_right.jpg",
                back: "/pump-images-360/seal/seal_back.jpg",
                left: "/pump-images-360/seal/seal_left.jpg",
                top: "/pump-images-360/seal/seal_top.jpg",
                bottom: "/pump-images-360/seal/seal_bottom.jpg"
            },
            specs: [
                "Material: Carbon/SIC/TC",
                "Pressure Rating: Up to 40 Bar",
                "Temperature Range: -50°C to 200°C",
                "Leak Rate: < 1x10⁻⁶ m³/s"
            ]
        },
        {
            id: "shaft-sleeve",
            slug: "shaft-sleeve-ss304",
            name: "Shaft Sleeve SS 304",
            shortDescription: "Protective shaft sleeve designed to prevent shaft wear and corrosion in aggressive environments.",
            category: "Pump Parts",
            industry: "Marine & Industrial",
            heroImage: "/pump-images-360/shaft/shaft_front.jpg",
            images360: {
                front: "/pump-images-360/shaft/shaft_front.jpg",
                right: "/pump-images-360/shaft/shaft_right.jpg",
                back: "/pump-images-360/shaft/shaft_back.jpg",
                left: "/pump-images-360/shaft/shaft_left.jpg",
                top: "/pump-images-360/shaft/shaft_top.jpg",
                bottom: "/pump-images-360/shaft/shaft_bottom.jpg"
            },
            specs: [
                "Material: Stainless Steel SS 304",
                "Surface Finish: Ra 0.8μm",
                "Corrosion Resistance: Excellent",
                "Installation: Press-fit design"
            ]
        },
        {
            id: "wear-ring",
            slug: "wear-ring-assembly",
            name: "Wear Ring Assembly",
            shortDescription: "Precision-engineered wear ring for maintaining optimal clearance and pump efficiency.",
            category: "Pump Parts",
            industry: "Maintenance Parts",
            heroImage: "/pump-images-360/wearRing/wearRing_front.jpg",
            images360: {
                front: "/pump-images-360/wearRing/wearRing_front.jpg",
                right: "/pump-images-360/wearRing/wearRing_right.jpg",
                back: "/pump-images-360/wearRing/wearRing_back.jpg",
                left: "/pump-images-360/wearRing/wearRing_left.jpg",
                top: "/pump-images-360/wearRing/wearRing_top.jpg",
                bottom: "/pump-images-360/wearRing/wearRing_bottom.jpg"
            },
            specs: [
                "Material: Bronze SAE 660",
                "Hardness: 75-90 HB",
                "Clearance: 0.3-0.5mm",
                "Lifespan: 10,000+ hours"
            ]
        },
        {
            id: "gasket-kit",
            slug: "gasket-kit-complete",
            name: "Gasket Kit Complete",
            shortDescription: "Complete gasket set for pump overhaul including all sealing components for comprehensive maintenance.",
            category: "Pump Parts",
            industry: "Maintenance Supplies",
            heroImage: "/pump-images-360/gasket/gasket_front.jpg",
            images360: {
                front: "/pump-images-360/gasket/gasket_front.jpg",
                right: "/pump-images-360/gasket/gasket_right.jpg",
                back: "/pump-images-360/gasket/gasket_back.jpg",
                left: "/pump-images-360/gasket/gasket_left.jpg",
                top: "/pump-images-360/gasket/gasket_top.jpg",
                bottom: "/pump-images-360/gasket/gasket_bottom.jpg"
            },
            specs: [
                "Material: Nitrile/PTFE/Viton",
                "Temperature Range: -40°C to 250°C",
                "Pressure Rating: Up to 300 PSI",
                "Includes: 12 gaskets, O-rings"
            ]
        }
    ];
    // Save the updated products data
    const outputPath = '/home/mitesh/Documents/manufacturing_website/frontend/src/data/pump-products-360.json';
    fs_1.default.writeFileSync(outputPath, JSON.stringify(updatedProducts, null, 2));
    console.log(`Updated products data saved to: ${outputPath}`);
}
// Run the download and data generation
async function main() {
    await downloadAllPumpImages();
    generateUpdatedProductsData();
}
if (require.main === module) {
    main().catch(console.error);
}
