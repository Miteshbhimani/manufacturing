import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CheckCircle2, Phone, Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Section } from "../../components/ui/Section";
import { getProductBySlug } from "../../data/products";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = getProductBySlug(id || "");

  if (!product) {
    return (
      <Section className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-bold text-[#0b3d91] mb-4">Product Not Found</h1>
        <Button variant="outline" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Section>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Breadcrumb Bar */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8 sticky top-[104px] z-40 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => navigate("/products")}
            className="text-sm font-bold text-[#0b3d91] hover:text-[#d32f2f] flex items-center gap-2 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate("/contact")}
            className="bg-[#d32f2f] hover:bg-red-800"
          >
            Enquire Now
          </Button>
        </div>
      </div>

      <Section className="py-12 md:py-16 bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-md aspect-[4/3]">
              <img
                src={product.heroImage}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/800x600/f1f5f9/94a3b8?text=Image+Unavailable";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Manufacturing Process Badge */}
            <div className="bg-[#0b3d91]/5 border border-[#0b3d91]/10 rounded-sm px-5 py-4">
              <p className="text-xs font-black uppercase tracking-widest text-[#0b3d91] mb-1">
                Manufacturing Process
              </p>
              <p className="text-sm font-semibold text-slate-700">
                Shell Mould Casting — Nucleus Metal Cast Pvt. Ltd., Rajkot, India
              </p>
            </div>
            {/* Contact strip */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+919825343585"
                className="flex items-center gap-2 text-sm font-bold text-[#0b3d91] bg-white border border-gray-200 rounded-sm px-4 py-3 hover:border-[#0b3d91] transition-colors flex-1 justify-center"
              >
                <Phone className="h-4 w-4 text-[#d32f2f]" />
                +91 98253 43585
              </a>
              <a
                href="mailto:info@nucleusmetalcast.com"
                className="flex items-center gap-2 text-sm font-bold text-[#0b3d91] bg-white border border-gray-200 rounded-sm px-4 py-3 hover:border-[#0b3d91] transition-colors flex-1 justify-center"
              >
                <Mail className="h-4 w-4 text-[#d32f2f]" />
                Email Us
              </a>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col bg-white p-8 md:p-10 border border-gray-200 shadow-lg rounded-sm border-t-[6px] border-t-[#0b3d91]">
            <div className="uppercase tracking-widest text-xs font-black text-[#d32f2f] mb-3">
              {product.category}
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#0b3d91] tracking-tight mb-3 leading-tight">
              {product.name}
            </h1>
            <div className="text-lg font-bold text-[#d32f2f] mb-5">Price on Enquiry</div>
            <p className="text-base text-slate-600 mb-8 leading-relaxed font-medium">
              {product.shortDescription}
            </p>

            {/* Specs */}
            <div className="border-y border-gray-200 py-7 mb-8">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-5">
                Key Specifications
              </h3>
              <ul className="space-y-3">
                {(product.specs && product.specs.length > 0
                  ? product.specs
                  : [
                      "Precision shell mould casting",
                      "Corrosion-resistant for harsh environments",
                      "High dimensional accuracy",
                      "ISO 9001:2015 quality controlled",
                    ]
                ).map((spec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#d32f2f] shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                variant="primary"
                className="flex-1 text-md h-14 bg-[#d32f2f] hover:bg-red-800"
                onClick={() => navigate("/contact")}
              >
                Request Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-md h-14 bg-white text-[#0b3d91] border-[#0b3d91]"
                onClick={() => navigate("/contact")}
              >
                Contact Engineer
              </Button>
            </div>

            {/* Quality Badge */}
            <div className="bg-blue-50 rounded-sm border border-blue-100 p-5 flex items-start gap-4">
              <div className="rounded-full bg-white p-3 shadow-sm border border-blue-100 shrink-0">
                <ShieldCheck className="h-7 w-7 text-[#0b3d91]" />
              </div>
              <div>
                <h4 className="text-[#0b3d91] font-bold mb-1 text-sm">Guaranteed Quality Assurance</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  100% optical inspection and non-destructive testing before shipment. Conforms to
                  ISO&nbsp;9001:2015 and global export standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
