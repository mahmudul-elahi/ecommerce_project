'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Store,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`, {
        description: `Signed in as ${user.role === 'admin' ? 'Administrator' : 'Shop Owner'}`,
      });
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/shop-owner/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error('Authentication Failed', {
        description: err.response?.data?.message || 'Invalid email or password',
      });
    }
  };

  const handleQuickLogin = (email, pass) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-paper">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-9 rounded-2xl border border-stone-200 shadow-craft">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 mb-4 shadow-subtle">
            <Store className="w-6 h-6 text-emerald-800" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Sign in to OmniShop</h1>
          <p className="text-xs text-stone-500 mt-1.5 font-normal">
            Shared Catalog Multi-Vendor Architecture Portal
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-900">
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Instant Demo Accounts</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
              Click to autofill
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@ecommerce.com', 'password')}
              className="p-2 rounded-lg bg-white border border-amber-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center space-x-2 shadow-subtle group"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-stone-900 text-[11px] group-hover:text-amber-900">System Admin</div>
                <div className="text-[10px] text-stone-400 truncate">admin@ecommerce.com</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('owner1@ecommerce.com', 'password')}
              className="p-2 rounded-lg bg-white border border-amber-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center space-x-2 shadow-subtle group"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-700 flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-stone-900 text-[11px] group-hover:text-amber-900">Tech Haven</div>
                <div className="text-[10px] text-stone-400 truncate">owner1@ecommerce.com</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('owner2@ecommerce.com', 'password')}
              className="p-2 rounded-lg bg-white border border-amber-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center space-x-2 shadow-subtle group"
            >
              <Store className="w-3.5 h-3.5 text-violet-700 flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-stone-900 text-[11px] group-hover:text-amber-900">Urban Apparel</div>
                <div className="text-[10px] text-stone-400 truncate">owner2@ecommerce.com</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('owner3@ecommerce.com', 'password')}
              className="p-2 rounded-lg bg-white border border-amber-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center space-x-2 shadow-subtle group"
            >
              <Store className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-stone-900 text-[11px] group-hover:text-amber-900">Nordic Living</div>
                <div className="text-[10px] text-stone-400 truncate">owner3@ecommerce.com</div>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50/60 rounded-xl border ${
                  errors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-200 focus:ring-stone-900'
                } focus:outline-none focus:ring-1 focus:bg-white text-stone-900 transition-all`}
                placeholder="you@ecommerce.com"
              />
            </div>
            {errors.email && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50/60 rounded-xl border ${
                  errors.password ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-200 focus:ring-stone-900'
                } focus:outline-none focus:ring-1 focus:bg-white text-stone-900 transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-medium text-xs transition-all flex items-center justify-center space-x-2 shadow-sm mt-3 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Want to launch your own store?{' '}
            <Link href="/register" className="font-semibold text-emerald-800 hover:underline">
              Register as Shop Owner
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
