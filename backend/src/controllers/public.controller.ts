import { Request, Response } from 'express';
import { OdooService } from '../services/odoo.service';
import { sendEnquiryEmail } from '../services/email.service';

export const handlePublicEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, companyName, email, phone, message } = req.body;
    
    // 1. Create lead in Odoo
    let leadId = null;
    try {
      leadId = await OdooService.executeKw(
        'crm.lead',
        'create',
        [{
          name: `Website Inquiry - ${companyName || fullName}`,
          contact_name: fullName,
          partner_name: companyName,
          email_from: email,
          phone: phone,
          description: message,
        }]
      );
    } catch (odooError) {
      console.error("Non-fatal: Failed to create lead in Odoo", odooError);
      // We continue even if Odoo fails, as long as we can send the email
    }
    
    // 2. Send email notification
    await sendEnquiryEmail({
      fullName,
      companyName,
      email,
      phone,
      message
    });
    
    res.status(201).json({ 
      success: true, 
      message: "Enquiry submitted successfully", 
      leadId 
    });
  } catch (error: any) {
    console.error("Public enquiry processing failed:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to process enquiry" 
    });
  }
};
