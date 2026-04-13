import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import axios from 'axios';

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email || !token) {
        setStatus('error');
        setMessage('Missing verification information.');
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await axios.get(`${apiUrl}/auth/verify`, {
          params: { email, token }
        });

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'An error occurred during verification.');
      }
    };

    verifyEmail();
  }, [email, token]);

  return (
    <Section className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-10 border border-gray-200 shadow-2xl rounded-sm text-center border-t-[6px] border-t-[#0b3d91]">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 text-[#0b3d91] animate-spin mx-auto" />
            <h2 className="text-2xl font-black text-[#0b3d91]">Verifying Email...</h2>
            <p className="text-slate-500">Please wait while we validate your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-black text-[#0b3d91]">Email Verified!</h2>
            <Link to="/login" className="block mt-8">
              <Button className="w-full bg-[#0b3d91] hover:bg-blue-900 uppercase font-black tracking-widest py-4">
                Proceed to Login
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-black text-[#0b3d91]">Verification Failed</h2>
            <p className="text-slate-600 font-medium">{message}</p>
            <div className="flex flex-col gap-3 mt-8">
              <Link to="/login">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 font-bold">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
