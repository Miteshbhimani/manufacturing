import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEnquiryEmail = async (data: {
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const { fullName, companyName, email, phone, message } = data;
  
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Nucleus Metal Cast <onboarding@resend.dev>', // Use verified domain in production
      to: ['miteshbhimani2127@gmail.com'],
      subject: `New Website Enquiry: ${companyName || fullName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0b3d91;">New Website Enquiry Received</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f4f7f9; border-left: 4px solid #d32f2f;">
            <p><strong>Message/Requirements:</strong></p>
            <p>${message}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">
            This enquiry was sent from the Nucleus Metal Cast website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error(error.message);
    }

    return result;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};
