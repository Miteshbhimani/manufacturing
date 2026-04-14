import dotenv from 'dotenv';
dotenv.config();

import { OdooService } from './services/odoo.service';

async function updateSpecs() {
  try {
    await OdooService.authenticate();
    const products = await OdooService.executeKw('product.template', 'search_read', [[]], { fields: ['id', 'name'] });
    
    for (const p of products) {
      let specs = "";
      if (p.name.includes("Valve")) {
        specs = "Precision forged components|Corrosion-resistant coating for harsh environments|High thermodynamic efficiency|10-Year structural warranty";
      } else if (p.name.includes("Milling")) {
        specs = "5-Axis simultaneous milling|24,000 RPM high-torque spindle|Integrated part probing|Laser tool measurement";
      } else if (p.name.includes("Pump")) {
        specs = "Intelligent load sensing|Variable displacement|High-pressure cast iron body|Low noise emission";
      }
      
      if (specs) {
        await OdooService.executeKw('product.template', 'write', [[p.id], { description: specs }]);
      }
    }
    console.log("Successfully updated product specifications in Odoo!");
  } catch (err) {
    console.error(err);
  }
}

updateSpecs();
