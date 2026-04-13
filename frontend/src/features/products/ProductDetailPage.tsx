import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Section } from "../../components/ui/Section";
import { Image360Viewer } from "../../components/ui/Image360Viewer";
import { getProducts } from "../../lib/api";
import type { Product } from "../../data/products";
import * as React from "react";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getProducts().then(items => {
      const found = items.find((p: Product) => p.slug === id);
      setProduct(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Section className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-xl font-bold text-[#0b3d91]">Loading Details...</h1>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-bold text-[#0b3d91] mb-4">Product Not Found</h1>
        <Button variant="outline" onClick={() => navigate("/products")}>Back to Products</Button>
      </Section>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Utility Bar */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8 sticky top-[104px] z-40 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
           <button onClick={() => navigate("/products")} className="text-sm font-bold text-[#0b3d91] hover:text-[#d32f2f] flex items-center gap-2 transition-colors uppercase tracking-wider">
             <ArrowLeft className="h-4 w-4" /> Back to Catalog
           </button>
           <Button size="sm" variant="primary" onClick={() => navigate("/contact")} className="bg-[#d32f2f] hover:bg-red-800">
             Enquire Now
           </Button>
        </div>
      </div>

      <Section className="py-12 md:py-16 bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Media Side */}
          <div className="flex flex-col space-y-6">
            {/* 360 Viewer Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-700">360° Product View</h3>
              <div className="flex items-center gap-2 text-sm text-[#0b3d91] font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Interactive Viewer
              </div>
            </div>

            {/* 360 Viewer Only */}
            <Image360Viewer
              images={product.images360 || {
                front: product.heroImage,
                back: '',
                left: '',
                right: '',
                top: '',
                bottom: ''
              }}
              className="w-full"
            />
          </div>

          {/* Details Side */}
          <div className="flex flex-col bg-white p-8 md:p-10 border border-gray-200 shadow-lg rounded-sm border-t-[6px] border-t-[#0b3d91]">
            <div className="uppercase tracking-widest text-xs font-black text-[#d32f2f] mb-3">{product.category}</div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#0b3d91] tracking-tight mb-3 leading-tight">{product.name}</h1>
            <div className="text-2xl font-bold text-slate-800 mb-5">
  <span className="text-[#d32f2f]">Price on Enquiry</span>
</div>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">{product.shortDescription}</p>

            <div className="border-y border-gray-200 py-8 mb-10">
               <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-5">Key Specifications</h3>
               {product.specs && product.specs.length === 1 && /<\/?[a-z][\s\S]*>/i.test(product.specs[0]) ? (
                 <div 
                   className="text-slate-700 font-medium space-y-3 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mt-1.5 [&_li]:pl-1 [&_p]:mb-3 [&_strong]:font-bold [&_strong]:text-slate-900"
                   dangerouslySetInnerHTML={{ __html: product.specs[0] }} 
                 />
               ) : (
                 <ul className="space-y-4">
                   {(product.specs && product.specs.length > 0 ? product.specs : ['Precision forged components', 'Corrosion-resistant coating for harsh environments', 'High thermodynamic efficiency', '10-Year structural warranty']).map((spec, i) => (
                     <li key={i} className="flex items-start gap-3">
                       <CheckCircle2 className="h-5 w-5 text-[#d32f2f] shrink-0 mt-0.5" />
                       <span className="text-slate-700 font-semibold">{spec}</span>
                     </li>
                   ))}
                 </ul>
               )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" variant="primary" className="flex-1 text-md h-14 bg-[#d32f2f] hover:bg-red-800" onClick={() => navigate("/contact")}>
                 Request Quote
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-md h-14 bg-white text-[#0b3d91] border-[#0b3d91]">
                 <Download className="h-5 w-5" /> Download Brochure
              </Button>
            </div>

            <div className="bg-blue-50 rounded-sm border border-blue-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
               <div className="rounded-full bg-white p-4 shadow-sm border border-blue-100">
                 <ShieldCheck className="h-8 w-8 text-[#0b3d91] shrink-0" />
               </div>
               <div>
                  <h4 className="text-[#0b3d91] font-bold mb-1">Guaranteed Quality Assurance</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    100% optical inspection and non-destructive testing before shipment. Conforms to ISO 9001:2015 and global export standards.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </Section>
    </div>
  );
}
