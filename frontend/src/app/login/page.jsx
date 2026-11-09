'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-[#FAF3EA]/40">
      <div className="w-full max-w-xl bg-white p-8 sm:p-12 shadow-sm border-0 rounded-none">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <img
              src="/images/furniro/imgMeubelHouseLogos05.png"
              alt="Furniro Logo"
              className="w-8 h-6 object-contain"
            />
            <span className="font-bold text-2xl tracking-tight text-black font-montserrat">
              Furniro
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#333333] font-montserrat">
            Log In
          </h1>
          <p className="text-sm text-[#898989] mt-2">
            Welcome back! Enter your credentials to access your account.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2.5">
              Username or email address <span className="text-[#B88E2F]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-12 pr-4 h-13 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F5EDE1] transition-colors"
                placeholder="e.g. admin@ecommerce.com"
              />
            </div>
            {errors.email && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333]">
                Password <span className="text-[#B88E2F]">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-12 pr-4 h-13 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F5EDE1] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#717171]">
              <input
                type="checkbox"
                className="rounded-none border-0 text-[#B88E2F] focus:ring-[#B88E2F]"
              />
              <span>Remember me</span>
            </label>
            <span className="text-xs text-[#898989] hover:text-[#B88E2F] cursor-pointer">
              Lost Your Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 rounded-none bg-[#B88E2F] hover:bg-[#967125] text-white font-semibold text-sm tracking-widest uppercase transition-all flex items-center justify-center space-x-2 border-0 outline-none shadow-none cursor-pointer mt-2"
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
        <div className="text-center pt-8 mt-6 border-t border-[#F2EDE4]">
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
