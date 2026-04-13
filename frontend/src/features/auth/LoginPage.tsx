import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Section } from '../../components/ui/Section';
import { login as loginApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginApi({ email, password, isRegistering });
      if (response.success) {
        setIsSuccess(true);
        // Rainbow confetti explosion!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0b3d91', '#d32f2f', '#fbbf24', '#10b981', '#6366f1']
        });

        if (response.requiresVerification) {
          setError(null);
          setLoading(false);
          return;
        }

        // Celebrate for a moment before redirecting
        setTimeout(() => {
          // Include the token from the API response if available
          const loginData = {
            ...response.data,
            token: response.data.token || localStorage.getItem('nucleus_auth_token')
          };
          login(loginData);
          if (response.data.role === 'admin') {
            // Redirect admin to dashboard (you can change this route as needed)
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        if (response.requiresVerification) {
          setError(null);
        } else {
          setError(response.message || 'Login failed');
        }
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error details:', {
        error: err,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <Section className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-20">
      <div className="w-full max-w-md bg-white p-8 md:p-10 border border-gray-200 shadow-2xl rounded-sm border-t-[6px] border-t-[#0b3d91]">
        <div className="text-center mb-8">
          <h1 className={cn(
            "text-3xl font-black text-[#0b3d91] tracking-tight mb-2 transition-all duration-1000",
            isSuccess && "rainbow-text"
          )}>
            {isRegistering ? "Create Account" : "Portal Access"}
          </h1>
          <p className="text-slate-500 font-medium lowercase tracking-wide">
            {isRegistering ? "Enter details to register with Nucleus" : "Enter your credentials to continue"}
          </p>
        </div>

        <div className="flex gap-4 mb-8 bg-slate-50 p-1 rounded-sm border border-slate-200">
          <button 
            onClick={() => { setIsRegistering(false); setError(null); }}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition-all ${!isRegistering ? 'bg-white shadow-sm text-[#0b3d91]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsRegistering(true); setError(null); }}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition-all ${isRegistering ? 'bg-white shadow-sm text-[#d32f2f]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0b3d91] transition-all font-medium"
                placeholder="admin@nucleus.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0b3d91] transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className={cn(
              "w-full py-4 text-md transition-all duration-500 shadow-lg",
              isRegistering ? "bg-[#0b3d91] hover:bg-blue-900" : "bg-[#d32f2f] hover:bg-red-800",
              (loading || isSuccess) && "rainbow-bg"
            )}
            disabled={loading || isSuccess}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> {isRegistering ? "Creating..." : "Verifying..."}
              </span>
            ) : isSuccess ? (
              "Success!"
            ) : (isRegistering ? "Create Official Account" : "Secure Login")}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            Nucleus Metal Cast &bull; Industrial Portal
          </p>
        </div>
      </div>
    </Section>
  );
}
