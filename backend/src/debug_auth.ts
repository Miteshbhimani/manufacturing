import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.ODOO_DB || '';
const ODOO_USERNAME = process.env.ODOO_USERNAME || '';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || '';

async function testConnection() {
  console.log(`[DIAGNOSTIC] URL: ${ODOO_URL}`);
  console.log(`[DIAGNOSTIC] DB: ${ODOO_DB}`);
  console.log(`[DIAGNOSTIC] User: ${ODOO_USERNAME}`);
  console.log(`[DIAGNOSTIC] Pass: ${ODOO_PASSWORD ? '****' : 'MISSING'}`);

  try {
    const response = await axios.post(`${ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "common",
        method: "login",
        args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD]
      },
      id: 1
    });

    if (response.data.error) {
      console.error("\n[DIAGNOSTIC] ❌ Odoo Error:", response.data.error.data.message || response.data.error.message);
      if (response.data.error.data.message === "Access Denied") {
        console.error("[DIAGNOSTIC] Advice: Your ODOO_PASSWORD is wrong.");
      }
    } else if (response.data.result) {
      console.log("\n[DIAGNOSTIC] ✅ Success! UID:", response.data.result);
    } else {
       console.log("\n[DIAGNOSTIC] ❌ Authentication failed (No UID returned)");
       console.log("[DIAGNOSTIC] Advice: Check if Database name is correct.");
    }
  } catch (error: any) {
    console.error("\n[DIAGNOSTIC] ❌ Network/Connection Error:", error.message);
  }
}

testConnection();
