import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { useToast } from '../../context/ToastContext';
import { BRAND_INFO } from '../../config/authConfig';

export const VendorLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useVendorAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your vendor email address.');
      return;
    }
    if (!username.trim()) {
      setError('Please enter your sales/vendor name.');
      return;
    }
    if (!password) {
      setError('Please enter your vendor access password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const success = login(email, username, password);
      if (success) {
        showToast(`Welcome back, ${username}!`, 'success');
        navigate('/vendor/dashboard');
      } else {
        setError('Invalid password. Default vendor password is "vendor@123"');
      }
      setLoading(false);
    }, 400);
  };

  const handleDemoFill = (demoName: string, demoEmail: string) => {
    setUsername(demoName);
    setEmail(demoEmail);
    setPassword('vendor@123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-brand-deepBurgundy flex items-center justify-center p-4 selection:bg-brand-gold selection:text-brand-deepBurgundy relative overflow-hidden">
      
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-burgundy/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-brand-gold/40 relative z-10 space-y-7">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <img
              src="/logo.jpg"
              alt={BRAND_INFO.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-brand-gold shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-deepBurgundy p-1.5 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-burgundy tracking-tight">
              Vendor Portal
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gold font-bold mt-1">
              {BRAND_INFO.name} Saree Partner Access
            </p>
          </div>
          
          <p className="text-xs text-brand-muted">
            Submit your authentic handloom sarees, set your wholesale cost price, and track sales performance.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider">
              Vendor / Sales Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="salesperson@example.com"
                className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-gold/40 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none transition-all placeholder:text-brand-muted/60"
              />
            </div>
          </div>

          {/* Username / Business Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider">
              Salesperson / Vendor Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. Ramesh Textiles or Kavitha Silks"
                className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-gold/40 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none transition-all placeholder:text-brand-muted/60"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider">
              Vendor Access Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-gold/40 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-3.5 rounded-xl font-bold text-sm shadow-md border border-brand-gold/40 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
          >
            <span>{loading ? 'Verifying...' : 'Login to Vendor Portal'}</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </button>
        </form>

        {/* Quick Demo Credentials helper */}
        <div className="pt-4 border-t border-brand-gold/20 space-y-2">
          <p className="text-[11px] text-brand-muted text-center font-medium">Quick Demo Profiles:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleDemoFill('Kavitha Weavers', 'kavitha@weavers.in')}
              className="text-[11px] bg-brand-lightGold/60 hover:bg-brand-gold/30 text-brand-burgundy px-2.5 py-1 rounded-lg border border-brand-gold/30 font-semibold"
            >
              Kavitha Weavers
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('Ramesh Handlooms', 'ramesh@textiles.com')}
              className="text-[11px] bg-brand-lightGold/60 hover:bg-brand-gold/30 text-brand-burgundy px-2.5 py-1 rounded-lg border border-brand-gold/30 font-semibold"
            >
              Ramesh Handlooms
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="pt-2 text-center text-[11px] text-brand-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
          <span>Secured Partner Gateway • TruelyWomen</span>
        </div>

      </div>
    </div>
  );
};
