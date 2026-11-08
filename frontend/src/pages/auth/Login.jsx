import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/shop-owner/dashboard');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-md shadow-emerald-500/20 mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access Admin Management or your Shop Owner Dashboard
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center space-x-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Instant Demo Accounts (Click to Fill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@ecommerce.com', 'password')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition-colors text-left flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">Admin Account</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('owner1@ecommerce.com', 'password')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition-colors text-left flex items-center space-x-1.5"
            >
              <Store className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span className="truncate">Tech Haven Owner</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('owner2@ecommerce.com', 'password')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition-colors text-left flex items-center space-x-1.5"
            >
              <Store className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span className="truncate">Urban Apparel Owner</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('owner3@ecommerce.com', 'password')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition-colors text-left flex items-center space-x-1.5"
            >
              <Store className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span className="truncate">Nordic Living Owner</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@ecommerce.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm mt-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Want to launch your own store?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
              Create a shop owner account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
