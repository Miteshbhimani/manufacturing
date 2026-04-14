import dotenv from 'dotenv';
dotenv.config();

import { OdooService } from './services/odoo.service';

async function setupCategories() {
  try {
    await OdooService.authenticate();
    
    // Create categories
    const catMap: Record<string, number> = {};
    const categories = ['Industrial Valves', 'CNC Machinery', 'Hydraulic Systems'];
    
    for (const c of categories) {
      // Check if exists
      let existing = await OdooService.executeKw('product.category', 'search', [[['name', '=', c]]]);
      if (existing.length > 0) {
        catMap[c] = existing[0];
      } else {
        const catId = await OdooService.executeKw('product.category', 'create', [{ name: c }]);
        catMap[c] = catId;
      }
    }

    // Assign to products
    const products = await OdooService.executeKw('product.template', 'search_read', [[]], { fields: ['id', 'name'] });
    
    for (const p of products) {
      if (p.name.includes("Valve")) {
        await OdooService.executeKw('product.template', 'write', [[p.id], { categ_id: catMap['Industrial Valves'] }]);
      } else if (p.name.includes("Milling")) {
        await OdooService.executeKw('product.template', 'write', [[p.id], { categ_id: catMap['CNC Machinery'] }]);
      } else if (p.name.includes("Pump")) {
        await OdooService.executeKw('product.template', 'write', [[p.id], { categ_id: catMap['Hydraulic Systems'] }]);
      }
    }
    
    console.log("Successfully categorized products inside Odoo!");
  } catch (err) {
    console.error(err);
  }
}

setupCategories();
