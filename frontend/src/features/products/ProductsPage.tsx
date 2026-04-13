import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, Cuboid } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Section } from "../../components/ui/Section";
import { getProducts, getCategories } from "../../lib/api";
import type { Product } from "../../data/products";

export function ProductsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [odooCategories, setOdooCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
    getCategories().then(setOdooCategories).catch(console.error);
  }, []);

  // Deduplicate and combine categories exclusively from Odoo and products data
  const combinedSet = new Set([...odooCategories, ...products.map(p => p.category)]);
  combinedSet.delete("All"); // Remove any native 'All' to avoid duplicating our 'All' toggle
  const dynamicCategories = ["All", ...Array.from(combinedSet)];

  const filteredProducts = products.filter(p => activeCategory === "All" || p.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="border-b-8 border-b-[#d32f2f] bg-[#0b3d91] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Our Products</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 font-medium">
            Engineered for performance, designed for durability. Browse our full operational catalog.
          </p>
        </div>
      </div>

      <Section className="flex-1 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 space-y-8">
            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
              <div className="flex items-center gap-2 font-bold text-[#0b3d91] mb-6 border-b border-gray-200 pb-3">
                <Filter className="h-5 w-5 text-[#d32f2f]" />
                <h3 className="uppercase tracking-widest text-sm">Categories</h3>
              </div>
              <ul className="space-y-2">
                {dynamicCategories.map((c: any) => (
                  <li key={c}>
                    <button 
                      onClick={() => setActiveCategory(c)}
                      className={`text-sm font-semibold transition-colors text-left w-full p-2 rounded-sm ${activeCategory === c ? 'bg-blue-50 text-[#0b3d91] border-l-4 border-[#d32f2f]' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
               <div className="flex items-center gap-2 font-bold text-[#0b3d91] mb-6 border-b border-gray-200 pb-3">
                 <Search className="h-5 w-5 text-[#d32f2f]" />
                 <h3 className="uppercase tracking-widest text-sm">Search</h3>
               </div>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search machinery..." 
                   className="w-full bg-slate-50 border border-slate-300 rounded-sm py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b3d91] focus:border-[#0b3d91]"
                 />
               </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer group border-t-4 border-t-gray-300 hover:border-t-[#0b3d91]" onClick={() => navigate(`/products/${product.slug}`)}>
                <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden border-b border-gray-200 p-3">
                  <img 
                    src={product.heroImage} 
                    alt={product.name} 
                    onError={(e) => { 
                      const errorDetails = {
                        imageUrl: product.heroImage,
                        imageType: product.heroImage.startsWith('data:') ? 'base64' : 
                                  product.heroImage.startsWith('http') ? 'external' : 'proxy',
                        productId: product.id,
                        productName: product.name,
                        timestamp: new Date().toISOString()
                      };
                      console.error('Product image failed to load:', errorDetails);
                      
                      // Try fallback image if not already a fallback
                      if (!e.currentTarget.src.includes('placehold.co')) {
                        // Try Odoo web/image URL as fallback
                        const fallbackUrl = `/web/image/product.product/${product.id}/image_1920`;
                        console.log('Trying fallback URL:', fallbackUrl);
                        e.currentTarget.src = fallbackUrl;
                      } else {
                        // Final fallback to placeholder
                        e.currentTarget.src = "https://placehold.co/600x400/eeeeee/999999?text=Image+Unavailable";
                      }
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', {
                        productId: product.id,
                        productName: product.name,
                        imageUrl: product.heroImage,
                        imageType: product.heroImage.startsWith('data:') ? 'base64' : 
                                  product.heroImage.startsWith('http') ? 'external' : 'proxy'
                      });
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-sm shadow-sm"
                    loading="lazy"
                    decoding="async"
                    crossOrigin="anonymous"
                  />
                  {product.has3D && (
                    <div className="absolute top-4 right-4 bg-white/95 border border-gray-200 text-xs px-3 py-1.5 rounded-sm flex items-center gap-1.5 text-[#0b3d91] font-bold shadow-md">
                      <Cuboid className="h-4 w-4 text-[#d32f2f]" />
                      3D Model
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 p-6 flex flex-col bg-white">
                  <div className="text-xs font-bold tracking-widest text-[#d32f2f] uppercase mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold text-[#0b3d91] mb-3 leading-tight">{product.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3 font-medium">
                    {product.shortDescription}
                  </p>
                  <div className="text-lg font-bold text-[#d32f2f] mb-4">
                    Price on Enquiry
                  </div>
                  <Button variant="outline" className="w-full">
                    View Specifications
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
