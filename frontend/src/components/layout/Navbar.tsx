import * as React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Menu, X, Hexagon, User as UserIcon, LogOut, LogIn } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout, isAdmin } = useAuth();

  console.log('Navbar rendering, user:', user, 'isAdmin:', isAdmin);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "OUR PRODUCTS", path: "/products" },
    { name: "OUR PROCESS", path: "/process" },
    { name: "INFRASTRUCTURE", path: "/capabilities" },
    { name: "ABOUT US", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      // Force refresh to clear any cached states or session residues
      window.location.href = '/'; 
    }
  };

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

              {user ? (
                  <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                    {isAdmin && (
                      <a 
                        href="/odoo" 
                        className="text-[11px] font-black text-[#d32f2f] hover:underline uppercase tracking-widest bg-red-50 px-2 py-1 rounded-sm flex items-center"
                        title="Access Odoo Backend"
                      >
                        Manage
                      </a>
                    )}
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-[12px] font-black text-[#0b3d91] uppercase leading-none">{user?.name || 'User'}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter mt-0.5 ${isAdmin ? 'bg-red-100 text-[#d32f2f]' : 'bg-blue-100 text-[#0b3d91]'}`}>
                        {isAdmin ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-[#d32f2f] transition-colors flex items-center"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 text-[13px] font-bold text-gray-700 hover:text-[#0b3d91] uppercase tracking-wide pl-4 border-l border-gray-200">
                  <LogIn className="h-4 w-4 flex-shrink-0" /> Login
                </Link>
              )}

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
              
              {user ? (
                <div className="px-3 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <UserIcon className="h-5 w-5 text-[#0b3d91]" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#0b3d91] uppercase">{user.name}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{isAdmin ? 'Administrator' : 'Portal Member'}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="text-[#d32f2f] font-bold text-sm uppercase">Logout</button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="block px-3 py-3 text-base font-bold text-[#0b3d91] hover:bg-blue-50 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Login to Portal
                </Link>
              )}

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
