import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, LogIn } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Section } from "../../components/ui/Section";
import { createLead } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const inquirySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide more details on your request"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export function ContactPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  
  // Retry mechanism for pending inquiries
  React.useEffect(() => {
    const retryPendingInquiries = async () => {
      const pendingInquiries = JSON.parse(localStorage.getItem('pending_inquiries') || '[]');
      
      if (pendingInquiries.length > 0) {
        console.log(`Found ${pendingInquiries.length} pending inquiries, attempting to submit...`);
        
        for (let i = 0; i < pendingInquiries.length; i++) {
          try {
            await createLead(pendingInquiries[i]);
            console.log(`Successfully resubmitted inquiry for ${pendingInquiries[i].companyName}`);
          } catch (error: any) {
            if (error?.response?.status !== 500) {
              // If it's not a 500 error, remove from pending
              pendingInquiries.splice(i, 1);
              i--; // Adjust index after removal
            }
          }
        }
        
        // Update pending inquiries list
        localStorage.setItem('pending_inquiries', JSON.stringify(pendingInquiries));
      }
    };
    
    // Try to submit pending inquiries every 30 seconds
    const interval = setInterval(retryPendingInquiries, 30000);
    
    // Also try immediately on component mount
    retryPendingInquiries();
    
    return () => clearInterval(interval);
  }, []);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || ""
    }
  });

  const onSubmit = async (data: InquiryFormValues) => {
    setIsSubmitting(true);
    try {
      await createLead({
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone || '',
        message: data.message
      });
      setSubmitSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Submission failed", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Unknown error occurred";
      const statusCode = err?.response?.status;
      
      console.error("Detailed error:", {
        status: statusCode,
        data: err?.response?.data,
        message: errorMessage
      });
      
      // Handle different error types
      if (statusCode === 500) {
        alert("Server error occurred. Your inquiry has been saved locally and will be submitted automatically when the server is back online. Please try again in a few minutes.");
        
        // Save inquiry to localStorage for retry
        const inquiryData = {
          fullName: data.fullName,
          companyName: data.companyName,
          email: data.email,
          phone: data.phone || '',
          message: data.message,
          timestamp: new Date().toISOString()
        };
        
        const savedInquiries = JSON.parse(localStorage.getItem('pending_inquiries') || '[]');
        savedInquiries.push(inquiryData);
        localStorage.setItem('pending_inquiries', JSON.stringify(savedInquiries));
        
      } else if (statusCode === 401) {
        alert("Your session has expired. Please log in again and try submitting.");
      } else {
        alert(`Failed to submit inquiry: ${errorMessage}. Please check your connection and try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="border-b-8 border-b-[#d32f2f] bg-[#0b3d91] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-7xl mx-auto">
           <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Request a Quote</h1>
           <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 font-medium">
             Contact our engineering team to discuss capabilities, request pricing, or coordinate a facility audit.
           </p>
        </div>
      </div>

      <Section className="flex-1 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto">
          
          <div className="space-y-8 mt-4">
             <div>
               <h3 className="text-3xl font-black text-[#0b3d91] mb-8">Contact Information</h3>
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="rounded-full bg-blue-50 p-4 border border-blue-100 shadow-sm transition-transform hover:scale-105">
                     <MapPin className="h-6 w-6 text-[#d32f2f]" />
                   </div>
                   <div>
                     <p className="font-bold text-[#0b3d91] text-lg">Manufacturing Unit</p>
                     <p className="text-slate-600 mt-1 font-medium leading-relaxed">Shed No. 2, Plot No. 292, Khirasara GIDC<br/>Nr. Mahadev Entr., Lodhika, Rajkot<br/>Gujarat 360021, India</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="rounded-full bg-blue-50 p-4 border border-blue-100 shadow-sm transition-transform hover:scale-105">
                     <span className="text-xs font-bold text-[#d32f2f]">GST</span>
                   </div>
                   <div>
                     <p className="font-bold text-[#0b3d91] text-lg">GST Registration</p>
                     <p className="text-slate-600 mt-1 font-medium">24BAOPB4633F1Z0</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="rounded-full bg-blue-50 p-4 border border-blue-100 shadow-sm transition-transform hover:scale-105">
                     <Mail className="h-6 w-6 text-[#d32f2f]" />
                   </div>
                   <div>
                     <p className="font-bold text-[#0b3d91] text-lg">Sales & Engineering Inquiries</p>
                     <p className="text-slate-600 mt-1 font-medium">info@nucleusmetalcast.com</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="rounded-full bg-blue-50 p-4 border border-blue-100 shadow-sm transition-transform hover:scale-105">
                     <Phone className="h-6 w-6 text-[#d32f2f]" />
                   </div>
                   <div>
                     <p className="font-bold text-[#0b3d91] text-lg">Direct Contact Line</p>
                     <p className="text-slate-600 mt-1 font-medium">+91 98253 43585</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <div>
             <Card className="shadow-2xl border-t-[6px] border-t-[#0b3d91] bg-white">
               <CardContent className="p-8 md:p-10">
                 {!user ? (
                   <div className="text-center py-12">
                     <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-6 border border-blue-100">
                       <LogIn className="h-8 w-8 text-[#0b3d91]" />
                     </div>
                     <h3 className="text-2xl font-black text-[#0b3d91] mb-2">Login Required</h3>
                     <p className="text-slate-600 font-medium mb-8">Please log in or register to submit an engineering enquiry.</p>
                     <Link to="/login">
                       <Button variant="primary" className="w-full gap-2 text-md h-14 bg-[#0b3d91] hover:bg-blue-900 uppercase tracking-wider">
                         Go to Login
                       </Button>
                     </Link>
                   </div>
                 ) : submitSuccess ? (
                   <div className="text-center py-12">
                     <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mb-6 border border-green-100">
                       <Send className="h-8 w-8 text-green-600" />
                     </div>
                     <h3 className="text-2xl font-black text-[#0b3d91] mb-2">Enquiry Received</h3>
                     <p className="text-slate-600 font-medium">Thank you, {user.name}. An engineering representative will contact you shortly.</p>
                     <Button variant="outline" className="mt-8 gap-2 bg-white" onClick={() => setSubmitSuccess(false)}>
                       Submit Another Request
                     </Button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-700">Full Name *</label>
                         <Input placeholder="E.g. Jayesh Patel" {...register("fullName")} className={`bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0b3d91] focus:ring-[#0b3d91] ${errors.fullName ? "border-red-500" : ""}`} />
                         {errors.fullName && <p className="text-xs text-red-500 font-bold">{errors.fullName.message}</p>}
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-700">Company Name *</label>
                         <Input placeholder="E.g. Acme Industries" {...register("companyName")} className={`bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0b3d91] focus:ring-[#0b3d91] ${errors.companyName ? "border-red-500" : ""}`} />
                         {errors.companyName && <p className="text-xs text-red-500 font-bold">{errors.companyName.message}</p>}
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-700">Corporate Email *</label>
                         <Input type="email" placeholder="sales@acme.in" {...register("email")} className={`bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0b3d91] focus:ring-[#0b3d91] ${errors.email ? "border-red-500" : ""}`} />
                         {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>}
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-700">Phone/WhatsApp</label>
                         <Input type="tel" placeholder="+91 XXXXX XXXXX" {...register("phone")} className="bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0b3d91] focus:ring-[#0b3d91]" />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Technical Requirements *</label>
                       <textarea 
                         placeholder="Please describe your machinery requirements, materials, or RFQ details..."
                         className={`flex min-h-[140px] w-full rounded-sm border ${errors.message ? "border-red-500" : "border-slate-300"} bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d91] resize-y`}
                         {...register("message")}
                       />
                       {errors.message && <p className="text-xs text-red-500 font-bold">{errors.message.message}</p>}
                     </div>

                     <Button type="submit" variant="primary" className="w-full gap-2 text-md h-14 bg-[#d32f2f] hover:bg-red-800 uppercase tracking-wider" disabled={isSubmitting}>
                       {isSubmitting ? "Submitting..." : "Send Enquiry Now"}
                     </Button>
                   </form>
                 )}
               </CardContent>
             </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
