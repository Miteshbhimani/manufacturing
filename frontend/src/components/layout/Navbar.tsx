import * as React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Menu, X, Hexagon } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "OUR PRODUCTS", path: "/products" },
    { name: "OUR PROCESS", path: "/process" },
    { name: "INFRASTRUCTURE", path: "/capabilities" },
    { name: "ABOUT US", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <>
      <div className="bg-[#0b3d91] text-white py-2 px-4 sm:px-6 lg:px-8 text-sm shadow-md z-50 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-bold"><Phone className="h-4 w-4 text-amber-400" /> +91 98253 43585</span>
            <span className="hidden sm:flex text-amber-400 font-bold tracking-wider underline decoration-amber-400/30">ISO 9001:2015 CERTIFIED COMPANY</span>
          </div>
          <div className="hidden md:flex items-center gap-2 font-semibold">
            <Mail className="h-4 w-4 text-amber-400" /> info@nucleusmetalcast.com
          </div>
        </div>
      </div>
      <nav className="bg-white border-b border-gray-300 sticky top-0 z-40 shadow-sm transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <Hexagon className="h-10 w-10 text-[#d32f2f]" fill="#d32f2f" fillOpacity="0.1" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-[#0b3d91] leading-none tracking-tight">NUCLEUS</span>
                  <span className="text-[10px] font-bold text-gray-500 tracking-[0.25em] pl-[2px] uppercase">Metal Cast</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[13px] font-bold text-gray-700 hover:text-[#d32f2f] uppercase tracking-wide transition-colors items-center flex"
                >
                  {link.name}
                </Link>
              ))}

              
              <Link to="/contact">
                <Button size="md" variant="secondary" className="bg-[#d32f2f] hover:bg-red-700 shadow-md ml-4">
                  GET A QUOTE
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-[#0b3d91] focus:outline-none"
              >
                {isOpen ? <X className="block h-7 w-7" /> : <Menu className="block h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-slate-50 absolute w-full shadow-lg">
            <div className="space-y-1 px-4 pb-4 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-blue-50 hover:text-[#0b3d91] border-b border-gray-100 last:border-0"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              
              <Link to="/contact" className="block pt-4" onClick={() => setIsOpen(false)}>
                <Button className="w-full" variant="secondary">
                  GET A QUOTE
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
