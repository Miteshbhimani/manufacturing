import * as React from "react";
import { useParams, useLocation } from "react-router-dom";
import { getDynamicPage } from "../../lib/api";
import { DynamicRenderer } from "./DynamicRenderer";
import { Section } from "../../components/ui/Section";
import { Loader2 } from "lucide-react";

export function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const actualSlug = slug || (location.pathname === "/" ? "home" : location.pathname.substring(1));
  
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    getDynamicPage(actualSlug).then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
        setError(null);
      } else {
        // Safe fallback - if it fails to find the page dynamically at all, let us handle it softly
        setError(res?.error || 'Page missing from CMS');
      }
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [actualSlug]);

  if (loading) {
    return (
      <Section className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-[#0b3d91] animate-spin mb-4" />
        <h1 className="text-xl font-bold text-[#0b3d91]">Loading Content from Odoo CMS...</h1>
      </Section>
    );
  }
  
  if (error || !data) {
    // If not found dynamically, we can render 404 or a fallback text
    return (
      <Section className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-black text-[#d32f2f] uppercase mb-4">404: Not Found</h1>
        <p className="text-slate-600 font-medium">The page '{actualSlug}' does not exist in the Odoo CMS database.</p>
        <p className="text-xs text-slate-400 mt-4">Error details: {error}</p>
      </Section>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Search Engine Metadata */}
      {data.seo_title && (
        <React.Fragment>
          <title>{data.seo_title}</title>
          {data.seo_description && <meta name="description" content={data.seo_description} />}
        </React.Fragment>
      )}
      {/* Sections Iterator mapping JSON models directly to React Views */}
      {data.sections && data.sections.map((section: any) => (
        <DynamicRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
