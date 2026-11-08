'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Store, User, Mail, Lock, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
  shop_name: z
    .string()
    .min(2, 'Store name must be at least 2 characters')
    .max(80, 'Store name too long'),
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      shop_name: '',
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || '',
        shop_name: data.shop_name,
      });
      toast.success('Store Created Successfully!', {
        description: `Welcome ${data.name}! Your storefront "${data.shop_name}" is ready.`,
      });
      router.push('/shop-owner/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Registration Failed', {
        description: err.response?.data?.message || 'Could not register your store. Please check the fields.',
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-9 rounded-2xl border border-stone-200 shadow-craft">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 mb-4 shadow-subtle">
            <Store className="w-6 h-6 text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Launch Your Store</h1>
          <p className="text-xs text-stone-500 mt-1.5 font-normal">
            Give your shop a home online. Add your details and start building your collection.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Store / Shop Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('shop_name')}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50/60 rounded-xl border ${
                  errors.shop_name ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-200 focus:ring-blue-500'
                } focus:outline-none focus:ring-1 focus:bg-white text-stone-900 transition-all`}
                placeholder="e.g. Skyline Goods"
              />
            </div>
            {errors.shop_name && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.shop_name.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('name')}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50/60 rounded-xl border ${
                  errors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-200 focus:ring-blue-500'
                } focus:outline-none focus:ring-1 focus:bg-white text-stone-900 transition-all`}
                placeholder="e.g. Jordan Hayes"
              />
            </div>
            {errors.name && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.name.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50/60 rounded-xl border ${
                  errors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-200 focus:ring-blue-500'
                } focus:outline-none focus:ring-1 focus:bg-white text-stone-900 transition-all`}
                placeholder="jordan@example.com"
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
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('phone')}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50/60 rounded-xl border border-stone-200 focus:ring-blue-500 focus:outline-none focus:ring-1 focus:bg-white text-stone-900 transition-all"
                placeholder="+1 (555) 012-3456"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Password (Min. 6 characters) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50/60 rounded-xl border ${
                  errors.password ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-200 focus:ring-blue-500'
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
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm mt-3"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create my store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-700 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
