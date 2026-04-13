import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProductsPage } from "./features/products/ProductsPage";
import { ContactPage } from "./features/contact/ContactPage";
import { ProductDetailPage } from "./features/products/ProductDetailPage";
import { DynamicPage } from "./features/cms/DynamicPage";
import { LoginPage } from "./features/auth/LoginPage";
import { VerifyPage } from "./features/auth/VerifyPage";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

/* Static Page Imports (do NOT use Odoo CMS for these) */
import { HomePage } from "./features/home/HomePage";
import { AboutPage } from "./features/about/AboutPage";
import { ProcessPage } from "./features/process/ProcessPage";
import { InfrastructurePage } from "./features/infrastructure/InfrastructurePage";

/* New Module Imports */
import DashboardPage from "./pages/DashboardPage";
import CRMPage from "./pages/crm/CRMPage";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b3d91] mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading application...</p>
        </div>
      </div>
    );
  }
  return (
    <Layout>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="verify" element={<VerifyPage />} />

        {/* New Module Routes */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="crm" element={<CRMPage />} />

        {/* Static redesigned pages served directly without Odoo CMS */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="process" element={<ProcessPage />} />
        <Route path="infrastructure" element={<InfrastructurePage />} />
        <Route path="capabilities" element={<InfrastructurePage />} />

        {/* Explicit modules Product Catalog, Contact */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Catch-all dynamic Odoo pages (handles any other slugs) */}
        <Route path=":slug" element={<DynamicPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
