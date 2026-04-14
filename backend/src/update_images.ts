import dotenv from 'dotenv';
dotenv.config();

import { OdooService } from './services/odoo.service';
import axios from 'axios';

async function updateImages() {
  try {
    await OdooService.authenticate();
    const products = await OdooService.executeKw('product.template', 'search_read', [[]], { fields: ['id', 'name'] });
    
    // Use stable placeholder seeds to avoid Unsplash 404 bot blocking
    const imgUrls: Record<string, string> = {
      'Valve': 'https://picsum.photos/seed/industrialvalve/400/400',
      'Milling': 'https://picsum.photos/seed/cncmilling/400/400',
      'Pump': 'https://picsum.photos/seed/hydraulicpump/400/400'
    };

    for (const p of products) {
      let url = '';
      if (p.name.includes("Valve")) url = imgUrls['Valve'];
      else if (p.name.includes("Milling")) url = imgUrls['Milling'];
      else if (p.name.includes("Pump")) url = imgUrls['Pump'];
      
      if (url) {
        console.log(`Downloading high-quality image for ${p.name}...`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        // Convert to base64 properly for Odoo's image_1920 binary field
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        
        await OdooService.executeKw('product.template', 'write', [[p.id], { image_1920: base64 }]);
        console.log(`Updated base64 BLOB image for ${p.name}`);
      }
    }
    console.log("Completely finished pushing native images to Odoo Products!");
  } catch (err) {
    console.error(err);
  }
}

updateImages();
