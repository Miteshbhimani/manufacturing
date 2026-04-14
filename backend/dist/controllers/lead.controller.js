"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = void 0;
const odoo_service_1 = require("../services/odoo.service");
const createLead = async (req, res) => {
    try {
        const { fullName, companyName, email, phone, message } = req.body;
        const leadId = await odoo_service_1.OdooService.executeKw('crm.lead', 'create', [{
                name: `Website Inquiry - ${companyName || fullName}`,
                contact_name: fullName,
                partner_name: companyName,
                email_from: email,
                phone: phone,
                description: message,
            }]);
        // Broadcast notification to Odoo Discuss (General channel)
        try {
            const channels = await odoo_service_1.OdooService.executeKw('discuss.channel', 'search_read', [[['name', 'ilike', 'general']]], { fields: ['id'], limit: 1 });
            // Attempt to find OdooBot to set as the notification author
            const bots = await odoo_service_1.OdooService.executeKw('res.partner', 'search', [[['name', 'ilike', 'odoobot']]]);
            const botId = bots.length > 0 ? bots[0] : false;
            if (channels && channels.length > 0) {
                const messageBody = `
          <div style="padding:10px; background-color:#f0f4f8; border-left: 4px solid #d32f2f; margin-bottom: 5px;">
            <p>🚨 <strong>New Website Enquiry!</strong></p>
            <ul>
              <li><strong>Name:</strong> ${fullName}</li>
              <li><strong>Company:</strong> ${companyName || 'N/A'}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
            </ul>
            <p><em>A new lead has been successfully generated in the CRM pipeline.</em></p>
          </div>
        `;
                await odoo_service_1.OdooService.executeKw('discuss.channel', 'message_post', [channels[0].id], {
                    body: messageBody,
                    message_type: 'notification',
                    subtype_xmlid: 'mail.mt_comment',
                    author_id: botId
                });
            }
        }
        catch (notificationError) {
            console.error("Non-fatal: Failed to send Discuss notification", notificationError);
        }
        res.status(201).json({ success: true, message: "Lead created successfully", leadId });
    }
    catch (error) {
        console.error("Failed to create lead:", error);
        res.status(500).json({ success: false, error: error.message || "Failed to create lead in Odoo" });
    }
};
exports.createLead = createLead;
