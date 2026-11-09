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
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
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
        description:
          err.response?.data?.message ||
          'Could not register your store. Please check the fields.',
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 bg-[#FAF3EA]/40">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 shadow-sm border-0 rounded-none space-y-7">
        {/* Header */}
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
            Launch Your Store
          </h1>
          <p className="text-xs text-[#898989] mt-1">
            Create your merchant shop and join the shared catalog network
          </p>
        </div>

        {/* Register Form - Flat Sharp Corners, Zero Borders */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Store / Shop Name <span className="text-[#B88E2F]">*</span>
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('shop_name')}
                className="w-full pl-11 pr-4 h-12 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="e.g. Nordic Haven Studio"
              />
            </div>
            {errors.shop_name && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1.5">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.shop_name.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Your Full Name <span className="text-[#B88E2F]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('name')}
                className="w-full pl-11 pr-4 h-12 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="e.g. Jane Doe"
              />
            </div>
            {errors.name && (
              <div className="flex items-center space-x-1 text-[11px] text-rose-600 mt-1.5">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.name.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Business Email <span className="text-[#B88E2F]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-11 pr-4 h-12 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="jane@nordichaven.com"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Contact Phone (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('phone')}
                className="w-full pl-11 pr-4 h-12 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="+1 (555) 234-5678"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Password <span className="text-[#B88E2F]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-11 pr-4 h-12 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="At least 6 characters"
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
            className="w-full h-12 rounded-none bg-[#B88E2F] hover:bg-[#9e7925] text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center space-x-2 border-0 outline-none shadow-none cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Launch My Store</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#898989]">
            Already have a store account?{' '}
            <Link href="/login" className="font-semibold text-[#B88E2F] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
