import dotenv from 'dotenv';
dotenv.config();

import { OdooService } from '../services/odoo.service';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const IMAGE_DIR = '/home/mitesh/Documents/manufacturing_website/pump_enhanced_HQ/pump_enhanced';

interface PumpProduct {
  name: string;
  description: string;
  imagePath: string;
  category: string;
  price?: number;
}

const extractProductInfo = (): PumpProduct[] => {
  const imageFiles = fs.readdirSync(IMAGE_DIR)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    .sort((a, b) => {
      const aNum = parseInt(a.split('.')[0]);
      const bNum = parseInt(b.split('.')[0]);
      return aNum - bNum;
    });

  const products: PumpProduct[] = [];
  
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

const createPumpCategory = async (): Promise<number> => {
  try {
    // Check if Pump Parts category exists
    const existing = await OdooService.executeKw('product.category', 'search', [[['name', '=', 'Pump Parts']]]);
    
    if (existing.length > 0) {
      console.log('Pump Parts category already exists:', existing[0]);
      return existing[0];
    }

    // Create new category
    const categoryId = await OdooService.executeKw('product.category', 'create', [{
      name: 'Pump Parts',
      parent_id: false // Top-level category
    }]);
    
    console.log('Created Pump Parts category:', categoryId);
    return categoryId;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

const imageToBase64 = (imagePath: string): string => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error reading image:', imagePath, error);
    throw error;
  }
};

const addPumpProducts = async (): Promise<void> => {
  try {
    console.log('Starting pump products import...');
    
    // Authenticate with Odoo
    await OdooService.authenticate();
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
        const productId = await OdooService.executeKw('product.template', 'create', [{
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
        
      } catch (error: any) {
        console.error(`✗ Failed to create product ${product.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nImport complete!`);
    console.log(`Successfully created: ${successCount} products`);
    console.log(`Failed: ${errorCount} products`);
    
  } catch (error) {
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
