import { OdooService } from '../services/odoo.service';
import axios from 'axios';

const syncEncoreProducts = async (): Promise<void> => {
    const urls = [
      'https://encoreshellcastllp.com/encoreshellcastllp.com/industries-we-serve.html'
    ];
    let created: any[] = [];
    console.log("Starting product sync...");
    try {
      for (const url of urls) {
        console.log("Fetching: " + url);
        const result = await axios.get(url);
        const html = result.data;
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        let match;
        while ((match = imgRegex.exec(html)) !== null) {
            const src = match[1];
            if (src && src.includes('assets/')) {
                let fullSrc = src;
                if (!src.startsWith('http')) {
                    const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
                    fullSrc = baseUrl + src;
                }
                
                const altMatch = match[0].match(/alt=["']([^"']+)["']/i);
                let name = altMatch ? altMatch[1] : ('Product ' + Math.floor(Math.random()*1000));
                if (!name || name === '') name = 'Nucleus Part';
                
                // Very basic duplicate check in this run
                if (created.find(c => c.name === name)) continue;

                try {
                    const imgResponse = await axios.get(fullSrc, { responseType: 'arraybuffer' });
                    const base64Img = Buffer.from(imgResponse.data, 'binary').toString('base64');

                    const productId = await OdooService.executeKw('product.template', 'create', [{
                        name: name,
                        image_1920: base64Img,
                        list_price: 0,
                        sale_ok: true,
                        description_sale: "Imported from Nucleus Metal Cast website"
                    }]);
                    console.log("--> Created Odoo product:", name, "(ID:", productId, ")");
                    created.push({ id: productId, name, url: fullSrc });
                } catch (e: any) {
                    console.error("Failed to process image", fullSrc, e.message);
                }
            }
        }
      }
      console.log(`Sync complete! Created ${created.length} products.`);
    } catch (e: any) {
      console.error("Fatal exception during sync:", e.message);
    }
};

syncEncoreProducts();
