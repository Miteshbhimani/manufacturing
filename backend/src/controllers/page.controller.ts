import { Request, Response } from 'express';
import { OdooService } from '../services/odoo.service';
import NodeCache from 'node-cache';

// Cache pages for 5 minutes
const pageCache = new NodeCache({ stdTTL: 300 });

export const getPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    
    const cachedPage = pageCache.get(slug);
    if (cachedPage) {
      res.json({ success: true, data: cachedPage, cached: true });
      return;
    }

    const pages = await OdooService.executeKw(
      'headless.page',
      'search_read',
      [[['slug', '=', slug], ['is_published', '=', true]]],
      { fields: ['id', 'name', 'slug', 'seo_title', 'seo_description', 'section_ids'], limit: 1 }
    );

    if (!pages || pages.length === 0) {
      // Return 404 for missing pages
      res.status(404).json({ success: false, error: 'Page not found' });
      return;
    }

    const page = pages[0];

    let sections = [];
    if (page.section_ids && page.section_ids.length > 0) {
      sections = await OdooService.executeKw(
        'headless.section',
        'search_read',
        [[['id', 'in', page.section_ids]]],
        { 
          fields: ['id', 'sequence', 'name', 'component_type', 'title', 'subtitle', 'content', 'image_1920', 'button_text', 'button_link', 'extra_json_data'],
        }
      );
      // Sort by sequence manually just in case
      sections.sort((a: any, b: any) => a.sequence - b.sequence);
    }

    const responseData = {
      ...page,
      sections
    };

    pageCache.set(slug, responseData);

    res.json({ success: true, data: responseData, cached: false });
  } catch (error: any) {
    console.error("Failed to fetch headless page:", error);
    res.status(500).json({ success: false, error: error.message || "Interal Server Error" });
  }
};
