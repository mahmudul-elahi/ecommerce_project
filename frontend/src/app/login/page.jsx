'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Store,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  Sparkles,
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
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 bg-[#FAF3EA]/40">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 shadow-sm border-0 rounded-none space-y-7">
        {/* Furniro Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Image
              src="/images/furniro/imgMeubelHouseLogos05.png"
              alt="Furniro Logo"
              width={36}
              height={26}
              className="h-auto w-auto object-contain"
            />
            <span className="font-bold text-2xl tracking-tight text-[#000000] font-montserrat">
              Furniro
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-[#333333]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#898989] mt-1">
            Access your multi-tenant merchant or admin control suite
          </p>
        </div>

        {/* Quick Demo Access - Sharp Rectangular Cards, No Borders */}
        <div className="bg-[#FAF7F2] p-4 rounded-none space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B88E2F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Quick Demo Login
            </span>
            <span className="text-[10px] text-[#9F9F9F]">Click to autofill</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@ecommerce.com', 'password')}
              className="p-2.5 bg-white text-left transition-colors hover:bg-[#F4E8D3] rounded-none flex items-center gap-2 border-0 outline-none"
            >
              <ShieldCheck className="w-4 h-4 text-[#B88E2F] flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-900 text-[11px]">System Admin</div>
                <div className="text-[10px] text-slate-400 truncate">admin@ecommerce.com</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('furniro@ecommerce.com', 'password')}
              className="p-2.5 bg-white text-left transition-colors hover:bg-[#F4E8D3] rounded-none flex items-center gap-2 border-0 outline-none"
            >
              <Building2 className="w-4 h-4 text-[#B88E2F] flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-900 text-[11px]">Furniro Flagship</div>
                <div className="text-[10px] text-slate-400 truncate">furniro@ecommerce.com</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('partner@ecommerce.com', 'password')}
              className="p-2.5 bg-white text-left transition-colors hover:bg-[#F4E8D3] rounded-none flex items-center gap-2 border-0 outline-none col-span-2"
            >
              <Store className="w-4 h-4 text-[#B88E2F] flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-900 text-[11px]">Artisan Living Boutique</div>
                <div className="text-[10px] text-slate-400 truncate">partner@ecommerce.com</div>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form - Zero Borders, Sharp Corners */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-11 pr-4 h-12 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="you@ecommerce.com"
              />
            </div>
            {errors.email && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1.5">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333]">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-11 pr-4 h-12 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1.5">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-none bg-[#B88E2F] hover:bg-[#9e7925] text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center space-x-2 border-0 outline-none shadow-none cursor-pointer mt-3"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#898989]">
            Want to open a merchant store?{' '}
            <Link href="/register" className="font-semibold text-[#B88E2F] hover:underline">
              Register Store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
