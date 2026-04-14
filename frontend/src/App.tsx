import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProductsPage } from "./features/products/ProductsPage";
import { ContactPage } from "./features/contact/ContactPage";
import { ProductDetailPage } from "./features/products/ProductDetailPage";

/* ── Static Page Imports ── */
import { HomePage } from "./features/home/HomePage";
import { AboutPage } from "./features/about/AboutPage";
import { ProcessPage } from "./features/process/ProcessPage";
import { InfrastructurePage } from "./features/infrastructure/InfrastructurePage";
import Chatbot from "./components/ui/Chatbot";

function AppContent() {
  return (
    <Layout>
      <Routes>
        {/* Static pages */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="process" element={<ProcessPage />} />
        <Route path="infrastructure" element={<InfrastructurePage />} />
        <Route path="capabilities" element={<InfrastructurePage />} />

        {/* Product Catalog */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Routes>
      <Chatbot />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
