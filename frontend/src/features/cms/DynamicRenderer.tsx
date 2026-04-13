import * as React from "react";
import { createLead } from "../../lib/api";

function DynamicContactForm({ section }: { section: any }) {
  const [formData, setFormData] = React.useState({ fullName: '', companyName: '', email: '', phone: '', message: '' });
  const [status, setStatus] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await createLead(formData);
      setStatus('Success');
      setFormData({ fullName: '', companyName: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('Error submitting inquiry. Please try again.');
    }
  };

  if (status === 'Success') {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 bg-white p-12 shadow-xl border-t-[6px] border-t-green-600 rounded-sm text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <h2 className="text-3xl font-black text-[#0b3d91]">Thank you!</h2>
          <p className="mt-4 text-lg text-slate-600 font-medium">We have received your business request and an engineering representative will be in touch shortly.</p>
          <button onClick={() => setStatus('')} className="mt-8 px-8 py-3 font-bold border border-gray-300 text-slate-700 rounded-sm hover:bg-slate-50 transition-colors uppercase tracking-widest text-sm">Submit Another Request</button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-4xl mx-auto px-4 bg-white p-8 md:p-12 shadow-xl border-t-[6px] border-t-[#0b3d91] rounded-sm">
         <h2 className="text-3xl lg:text-4xl font-black text-[#0b3d91] mb-2">{section.title || 'Contact Us'}</h2>
         {section.subtitle && <p className="text-slate-600 font-medium mb-10 text-lg">{section.subtitle}</p>}
         <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="text-sm font-bold text-slate-700">Full Name *</label>
               <input required type="text" className="w-full mt-2 bg-slate-50 border border-slate-300 focus:border-[#0b3d91] focus:ring-[#0b3d91] p-3.5 rounded-sm outline-none" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
             </div>
             <div>
               <label className="text-sm font-bold text-slate-700">Company Name *</label>
               <input required type="text" className="w-full mt-2 bg-slate-50 border border-slate-300 focus:border-[#0b3d91] focus:ring-[#0b3d91] p-3.5 rounded-sm outline-none" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
             </div>
             <div>
               <label className="text-sm font-bold text-slate-700">Corporate Email *</label>
               <input required type="email" className="w-full mt-2 bg-slate-50 border border-slate-300 focus:border-[#0b3d91] focus:ring-[#0b3d91] p-3.5 rounded-sm outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             </div>
             <div>
               <label className="text-sm font-bold text-slate-700">Phone</label>
               <input type="text" className="w-full mt-2 bg-slate-50 border border-slate-300 focus:border-[#0b3d91] focus:ring-[#0b3d91] p-3.5 rounded-sm outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
             </div>
           </div>
           <div>
             <label className="text-sm font-bold text-slate-700">Technical Requirements *</label>
             <textarea required rows={5} className="w-full mt-2 bg-slate-50 border border-slate-300 focus:border-[#0b3d91] focus:ring-[#0b3d91] p-3.5 rounded-sm outline-none resize-y" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
           </div>
           <button type="submit" disabled={status === 'Submitting...'} className="w-full bg-[#d32f2f] text-white py-5 font-black uppercase tracking-widest text-sm hover:bg-red-800 transition-colors shadow-md rounded-sm mt-4">
             {status === 'Submitting...' ? 'Processing...' : (section.button_text || 'Send Enquiry Now')}
           </button>
         </form>
         {status && status !== 'Submitting...' && <p className="mt-6 text-red-500 font-bold bg-red-50 p-4 rounded-sm border border-red-200">{status}</p>}
      </div>
    </section>
  );
}

export function DynamicRenderer({ section }: { section: any }) {
  switch (section.component_type) {
    case "hero":
      return (
        <section className="relative py-20 bg-[#0b3d91] text-white" style={{ backgroundImage: section.image_1920 ? `url(data:image/png;base64,${section.image_1920})` : 'none', backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}>
          <div className="max-w-7xl mx-auto px-4 z-10 relative text-center">
            <h1 className="text-4xl md:text-6xl font-black">{section.title}</h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">{section.subtitle}</p>
            {section.content && <div dangerouslySetInnerHTML={{ __html: section.content }} className="mt-6 max-w-3xl mx-auto" />}
            {section.button_text && (
               <a href={section.button_link} className="inline-block mt-8 bg-[#d32f2f] text-white hover:bg-red-800 px-10 py-5 font-black rounded-sm uppercase tracking-widest transition-colors shadow-xl">
                 {section.button_text}
               </a>
            )}
          </div>
        </section>
      );
    case "text_image":
      return (
        <section className="py-20 bg-slate-50 relative border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-3xl lg:text-5xl font-black text-[#0b3d91] mb-6 tracking-tight leading-tight">{section.title}</h2>
                {section.subtitle && <h3 className="text-2xl text-[#d32f2f] font-bold mb-6">{section.subtitle}</h3>}
                <div className="prose max-w-none text-slate-600 space-y-4 font-medium text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
             </div>
             <div>
                {section.image_1920 ? (
                  <img src={`data:image/png;base64,${section.image_1920}`} alt={section.title} className="w-full rounded-sm shadow-2xl border border-gray-200" />
                ) : (
                  <div className="aspect-[4/3] w-full bg-slate-200 border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center text-slate-400">
                     <span className="font-bold">Image Placeholder</span>
                  </div>
                )}
             </div>
          </div>
        </section>
      );
    case "contact_form":
      return <DynamicContactForm section={section} />;
    default:
      return (
        <section className="py-12 bg-white">
           <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-[#0b3d91] mb-4">{section.title}</h2>
              {section.subtitle && <p className="text-lg font-bold text-gray-500 mb-4">{section.subtitle}</p>}
              {section.content && <div dangerouslySetInnerHTML={{ __html: section.content }} className="text-gray-700" />}
              <div className="bg-red-50 text-red-700 p-4 border border-red-200 mt-6 text-xs font-mono rounded">
                Unmapped Odoo Component String: <strong>{section.component_type}</strong>
              </div>
           </div>
        </section>
      );
  }
}
