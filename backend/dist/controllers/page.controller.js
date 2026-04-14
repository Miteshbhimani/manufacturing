"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPage = void 0;
const odoo_service_1 = require("../services/odoo.service");
const node_cache_1 = __importDefault(require("node-cache"));
// Cache pages for 5 minutes
const pageCache = new node_cache_1.default({ stdTTL: 300 });
const getPage = async (req, res) => {
    try {
        const slug = req.params.slug;
        const cachedPage = pageCache.get(slug);
        if (cachedPage) {
            res.json({ success: true, data: cachedPage, cached: true });
            return;
        }
        const pages = await odoo_service_1.OdooService.executeKw('headless.page', 'search_read', [[['slug', '=', slug], ['is_published', '=', true]]], { fields: ['id', 'name', 'slug', 'seo_title', 'seo_description', 'section_ids'], limit: 1 });
        if (!pages || pages.length === 0) {
            // Return 404 for missing pages
            res.status(404).json({ success: false, error: 'Page not found' });
            return;
        }
        const page = pages[0];
        let sections = [];
        if (page.section_ids && page.section_ids.length > 0) {
            sections = await odoo_service_1.OdooService.executeKw('headless.section', 'search_read', [[['id', 'in', page.section_ids]]], {
                fields: ['id', 'sequence', 'name', 'component_type', 'title', 'subtitle', 'content', 'image_1920', 'button_text', 'button_link', 'extra_json_data'],
            });
            // Sort by sequence manually just in case
            sections.sort((a, b) => a.sequence - b.sequence);
        }
        const responseData = {
            ...page,
            sections
        };
        pageCache.set(slug, responseData);
        res.json({ success: true, data: responseData, cached: false });
    }
    catch (error) {
        console.error("Failed to fetch headless page:", error);
        res.status(500).json({ success: false, error: error.message || "Interal Server Error" });
    }
};
exports.getPage = getPage;
