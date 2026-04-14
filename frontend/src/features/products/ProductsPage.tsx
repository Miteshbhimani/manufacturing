import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Section } from "../../components/ui/Section";
import { staticProducts, getCategories as getStaticCategories } from "../../data/products";

export function ProductsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const allCategories = getStaticCategories();
  const categories = ["All", ...allCategories];

  // Count per category
  const countForCategory = (cat: string) =>
    cat === "All"
      ? staticProducts.length
      : staticProducts.filter((p) => p.category === cat).length;

  // Filter by category then by search
  const filteredProducts = staticProducts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.specs || []).some((s) => s.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b-8 border-b-[#d32f2f] bg-[#0b3d91] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Our Products</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 font-medium">
            Engineered for performance, designed for durability. Browse our full operational catalog of{" "}
            <span className="text-amber-400 font-bold">{staticProducts.length} precision cast components</span>.
          </p>
        </div>
      </div>

      <Section className="flex-1 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-6 flex-shrink-0">

            {/* Category Filter */}
            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
              <div className="flex items-center gap-2 font-bold text-[#0b3d91] mb-6 border-b border-gray-200 pb-3">
                <Filter className="h-5 w-5 text-[#d32f2f]" />
                <h3 className="uppercase tracking-widest text-sm">Categories</h3>
              </div>
              <ul className="space-y-1">
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => setActiveCategory(c)}
                      className={`text-sm font-semibold transition-colors text-left w-full px-3 py-2.5 rounded-sm flex items-center justify-between ${
                        activeCategory === c
                          ? "bg-blue-50 text-[#0b3d91] border-l-4 border-[#d32f2f]"
                          : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                      }`}
                    >
                      <span>{c}</span>
                      <span
                        className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                          activeCategory === c
                            ? "bg-[#0b3d91] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {countForCategory(c)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Search */}
            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
              <div className="flex items-center gap-2 font-bold text-[#0b3d91] mb-4 border-b border-gray-200 pb-3">
                <Search className="h-5 w-5 text-[#d32f2f]" />
                <h3 className="uppercase tracking-widest text-sm">Search</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b3d91] focus:border-[#0b3d91]"
                />
              </div>
              {searchQuery && (
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <Search className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-lg font-bold">No products found</p>
                <p className="text-sm mt-1">Try a different search term or category</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                  {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer group border-t-4 border-t-gray-200 hover:border-t-[#0b3d91]"
                      onClick={() => navigate(`/products/${product.slug}`)}
                    >
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-gray-200">
                        <img
                          src={product.heroImage}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable";
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <CardContent className="flex-1 p-5 flex flex-col bg-white">
                        <div className="text-[10px] font-black tracking-widest text-[#d32f2f] uppercase mb-1.5">
                          {product.category}
                        </div>
                        <h3 className="text-base font-bold text-[#0b3d91] mb-2 leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-2 font-medium leading-relaxed">
                          {product.shortDescription}
                        </p>
                        <Button variant="outline" className="w-full text-sm">
                          View Specifications
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
