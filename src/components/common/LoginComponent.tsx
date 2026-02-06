import { AlertCircle, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

interface LoginComponentProps {
  setAdminId: (id: string) => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ setAdminId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@aitimaad.pk';
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

      if (email === adminEmail && password === adminPassword) {
        const adminId = `admin-${Date.now()}`;
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_id', adminId);
        setAdminId(adminId);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-green p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-gradient-to-b from-white to-primary-50 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-green rounded-2xl shadow-lg mb-4">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary-900">
              AITIMAAD.PK Admin
            </h2>
            <p className="text-primary-600 mt-2">
              Secure Admin Dashboard
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-slide-up">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-sm font-medium text-red-800">{error}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@aitimaad.pk"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-primary-100">
            <p className="text-center text-sm text-primary-600">
              Secure access to admin panel. Contact support if you need assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};