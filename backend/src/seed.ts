import dotenv from 'dotenv';
dotenv.config();

import { OdooService } from './services/odoo.service';

const PAGES = [
  {
    page: { name: "Nexus Homepage", slug: "home", is_published: true, seo_title: "Nexus | Home" },
    sections: [
      {
        name: "Home Hero", sequence: 10, component_type: "hero",
        title: "Precision Industrial Machinery", subtitle: "ISO 9001:2015 certified company in Ahmedabad specializing in CNC machining.", button_text: "Explore Products", button_link: "/products"
      },
      {
        name: "Home Capabilities", sequence: 20, component_type: "text_image",
        title: "Our Core Capabilities", subtitle: "Full-cycle manufacturing solutions.",
        content: "<ul><li>Precision CNC Machining</li><li>Heavy Fabrication</li><li>Quality Assurance</li></ul>"
      }
    ]
  },
  {
    page: { name: "Capabilities", slug: "capabilities", is_published: true, seo_title: "Capabilities | Nexus" },
    sections: [
      {
        name: "Capabilities Hero", sequence: 10, component_type: "hero",
        title: "Advanced Manufacturing Capabilities", subtitle: "From rapid prototyping to high-volume production."
      },
      {
        name: "Machinery List", sequence: 20, component_type: "text_image",
        title: "State-of-the-art Infrastructure",
        content: "We house high-end 5-axis vertical machining centers, heavy duty hydraulic presses, and our own metrology lab. Every piece of equipment is meticulously maintained."
      }
    ]
  },
  {
    page: { name: "About Us", slug: "about", is_published: true, seo_title: "About | Nexus" },
    sections: [
      {
        name: "About Hero", sequence: 10, component_type: "hero",
        title: "About Nexus Engineering", subtitle: "Over 35 Years of Manufacturing Excellence."
      },
      {
        name: "About Story", sequence: 20, component_type: "text_image",
        title: "Our Legacy",
        content: "<p>Founded in 1989, we have grown from a small shop to an international exporter. Our parts operate in critical infrastructure across 20+ countries.</p>"
      }
    ]
  },
  {
    page: { name: "Services", slug: "services", is_published: true, seo_title: "Services | Nexus" },
    sections: [
      {
        name: "Services Hero", sequence: 10, component_type: "hero",
        title: "Our Industrial Services", subtitle: "Tailored manufacturing services for diverse industries.", button_text: "Contact Us", button_link: "/contact"
      }
    ]
  }
];

async function seedData() {
  try {
    console.log("Authenticating with Odoo...");
    await OdooService.authenticate();
    console.log("Authenticated successfully.");

    // Attempt products softly
    try {
      console.log("Attempting to populate sample Products...");
      const products = [
        { name: 'Nexus X-700 Valve', list_price: 2500, sale_ok: true },
        { name: 'V5-Axis Milling Center', list_price: 154000, sale_ok: true },
        { name: 'H-Series Pump', list_price: 3200, sale_ok: true }
      ];
      for (const prod of products) {
        await OdooService.executeKw('product.template', 'create', [prod]);
      }
      console.log("Products populated.");
    } catch (e: any) {
      console.log("Skipping product creation. The 'Sales' or 'Inventory' app might not be installed in Odoo yet.");
    }

    console.log("Creating Headless CMS Pages...");
    for (const pageData of PAGES) {
      // Clear if exists
      const existingPage = await OdooService.executeKw('headless.page', 'search', [[['slug', '=', pageData.page.slug]]]);
      if (existingPage.length > 0) {
        await OdooService.executeKw('headless.page', 'unlink', [existingPage]);
      }

      // Create page
      const pageId = await OdooService.executeKw('headless.page', 'create', [pageData.page]);
      
      // Create sections
      for (const sec of pageData.sections) {
        await OdooService.executeKw('headless.section', 'create', [{ ...sec, page_id: pageId }]);
      }
      console.log(`Created page: ${pageData.page.slug}`);
    }

    console.log("Successfully seeded Odoo database via JSON-RPC!");
  } catch (error: any) {
    console.error("Failed to seed Odoo:", error.message || error);
    process.exit(1);
  }
}

seedData();
