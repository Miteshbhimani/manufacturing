"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '.env') });
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
        const response = await axios_1.default.post(`${ODOO_URL}/jsonrpc`, {
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
        }
        else if (response.data.result) {
            console.log("\n[DIAGNOSTIC] ✅ Success! UID:", response.data.result);
        }
        else {
            console.log("\n[DIAGNOSTIC] ❌ Authentication failed (No UID returned)");
            console.log("[DIAGNOSTIC] Advice: Check if Database name is correct.");
        }
    }
    catch (error) {
        console.error("\n[DIAGNOSTIC] ❌ Network/Connection Error:", error.message);
    }
}
testConnection();
