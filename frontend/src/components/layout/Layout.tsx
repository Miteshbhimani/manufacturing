import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  console.log('Layout component rendering');
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
      <Footer />
      {/* <WhatsAppWidget /> */}
    </div>
  );
}
