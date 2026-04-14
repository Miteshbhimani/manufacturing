import { Hexagon, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories as getStaticCategories } from "../../data/products";

export function Footer() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const cats = getStaticCategories();
    setCategories(cats.slice(0, 3)); // Show first 3 categories
  }, []);

  return (
    <footer className="bg-slate-900 border-t-8 border-[#0b3d91] text-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2">
                <Hexagon className="h-8 w-8 text-[#d32f2f]" fill="#d32f2f" fillOpacity="0.2" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white leading-none tracking-tight">NUCLEUS</span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.25em] pl-[2px] uppercase">Metal Cast</span>
                </div>
              </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mt-4">
              Leading ISO 9001:2015 certified manufacturer of precision components and robust machinery for global industrial sectors.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase border-b border-gray-700 pb-3 mb-4">Our Products</h3>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li key={index}>
                    <Link to="/products" className="text-sm font-semibold text-slate-400 hover:text-[#d32f2f] transition-colors">
                      {category}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/products" className="text-sm font-semibold text-slate-400 hover:text-[#d32f2f] transition-colors">CNC Machinery</Link></li>
                  <li><Link to="/products" className="text-sm font-semibold text-slate-400 hover:text-[#d32f2f] transition-colors">Industrial Valves</Link></li>
                  <li><Link to="/products" className="text-sm font-semibold text-slate-400 hover:text-[#d32f2f] transition-colors">Hydraulic Systems</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase border-b border-gray-700 pb-3 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm font-semibold text-slate-400 hover:text-[#d32f2f] transition-colors">About Us</Link></li>
              <li><Link to="/capabilities" className="text-sm font-semibold text-slate-400 hover:text-[#d32f2f] transition-colors">Infrastructure</Link></li>
              <li><Link to="/contact" className="text-sm font-semibold text-slate-400 hover:text-[#d32f2f] transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase border-b border-gray-700 pb-3 mb-4">Corporate Office</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                 <MapPin className="h-5 w-5 text-[#d32f2f] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400 font-medium">Shed No. 2, Plot No. 292, Khirasara GIDC<br/>Nr. Mahadev Entr., Lodhika, Rajkot<br/>Gujarat 360021, India</span>
               </li>
               <li className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GSTIN: 24BAOPB4633F1Z0</span>
               </li>
               <li className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal: Dhavalkumar Pravinchandra Bhenshdadiya</span>
               </li>
              <li className="flex items-center gap-3">
                 <Phone className="h-5 w-5 text-[#d32f2f] shrink-0" />
                 <span className="text-sm text-slate-400 font-medium">+91 98253 43585</span>
              </li>
              <li className="flex items-center gap-3">
                 <Mail className="h-5 w-5 text-[#d32f2f] shrink-0" />
                  <span className="text-sm text-slate-400 font-medium">info@nucleusmetalcast.com</span>
               </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
             &copy; {new Date().getFullYear()} Nucleus Metal Cast.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">Privacy Policy</Link>
          </div>
        </div>

        {/* SEO Keywords Layer */}
        <div className="mt-8 pt-8 border-t border-slate-800/50">
          <p className="text-[9px] text-slate-600 font-medium leading-relaxed text-center uppercase tracking-widest">
            Specialized in: SS 304 Casting India &bull; Shell Moulding Rajkot &bull; Stainless Steel Pump Components &bull; Investment Casting Gujarat &bull; Submersible Motor Parts Manufacturer &bull; Precision Alloy Steel Castings &bull; Pump Impeller Casting India &bull; Industrial Casting Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
