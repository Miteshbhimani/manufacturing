import dotenv from 'dotenv';
dotenv.config();

import { OdooService } from './services/odoo.service';

async function seedData() {
  try {
    await OdooService.authenticate();
    
    // Clear page cache physically so the next request automatically re-gets the new section
    // we don't have access to the instance inside page.controller, so we just assume
    // it will be fetched (or we can just restart the backend via prompt).
    // The user running 'npm run dev' has watch mode if nodemon is active, but vite proxy covers frontend. Wait backend is run with ts-node!
    // Since it's stored in in-memory node-cache, we might need the user to restart backend or wait 5 mins.
    
    const existingAbout = await OdooService.executeKw('headless.page', 'search', [[['slug', '=', 'about']]]);
    if (existingAbout.length > 0) {
      await OdooService.executeKw('headless.section', 'create', [{
        name: "About Us Contact Form",
        page_id: existingAbout[0],
        sequence: 30, // appending it
        component_type: "contact_form",
        title: "Get In Touch",
        subtitle: "Have a question about our industrial capabilities? Fill out the form below.",
        button_text: "Submit Lead"
      }]);
      console.log("Successfully appended the new Contact Form section to the About Us page!");
    } else {
      console.log("About page not found.");
    }
  } catch (err) {
    console.error(err);
  }
}
seedData();
