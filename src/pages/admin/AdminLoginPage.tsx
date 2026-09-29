import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRAND_INFO } from '../../config/authConfig';

export const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter owner password');
      return;
    }

    const success = login(password);
    if (success) {
      showToast('Owner access granted', 'success');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid owner password');
      showToast('Invalid owner password', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-deepBurgundy via-brand-burgundy to-brand-deepBurgundy flex items-center justify-center p-4">
      
      <div className="max-w-md w-full bg-brand-ivory rounded-3xl p-8 sm:p-10 shadow-2xl border border-brand-gold/40 space-y-8 animate-in fade-in duration-300">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <img
              src="/logo.jpg"
              alt={BRAND_INFO.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-brand-gold shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-deepBurgundy p-1.5 rounded-full shadow-md">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-burgundy tracking-wide">
              {BRAND_INFO.name}
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold mt-0.5">
              Owner Administration Gate
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-2">
              Owner Password
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter owner password..."
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-11 pr-4 py-3 bg-brand-cream border border-brand-gold/40 rounded-xl text-sm text-brand-burgundy font-medium focus:ring-2 focus:ring-brand-gold/60 focus:outline-none"
              />
            </div>
            {error && <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl border border-brand-gold/40 active:scale-95"
          >
            <Lock className="w-4 h-4 text-brand-gold" />
            <span>Access Dashboard</span>
          </button>
        </form>

        {/* Authorization Disclaimer */}
        <div className="pt-4 border-t border-brand-gold/20 text-center text-xs text-brand-muted">
          <p className="font-semibold text-brand-burgundy uppercase tracking-wider">
            Authorized TruelyWomen Owner Only
          </p>
        </div>

      </div>
    </div>
  );
};
