'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AlertCircle, ArrowRight } from 'lucide-react';
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
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-[#FAF3EA]/50">
      <div className="w-full max-w-xl bg-white p-8 sm:p-12 shadow-sm border-0 rounded-none">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#333333] font-montserrat">
            Register Store
          </h1>
          <p className="text-xs text-[#898989] mt-2">
            Create your merchant shop and join the shared catalog network.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Store / Shop Name <span className="text-[#B88E2F]">*</span>
            </label>
            <input
              type="text"
              {...register('shop_name')}
              className="w-full h-14 px-5 text-base bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
              placeholder="e.g. Nordic Haven Studio"
            />
            {errors.shop_name && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.shop_name.message}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                Your Full Name <span className="text-[#B88E2F]">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full h-14 px-5 text-base bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="Jane Doe"
              />
              {errors.name && (
                <div className="flex items-center space-x-1.5 text-xs text-rose-600 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                Contact Phone (Optional)
              </label>
              <input
                type="text"
                {...register('phone')}
                className="w-full h-14 px-5 text-base bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
                placeholder="+1 (555) 234-5678"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Business Email <span className="text-[#B88E2F]">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full h-14 px-5 text-base bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
              placeholder="jane@nordichaven.com"
            />
            {errors.email && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
              Password <span className="text-[#B88E2F]">*</span>
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full h-14 px-5 text-base bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F4EBD8] transition-colors"
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-none bg-[#B88E2F] hover:bg-[#967125] text-white font-semibold text-sm tracking-widest uppercase transition-all flex items-center justify-center space-x-2 border-0 outline-none shadow-none cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Launch Storefront</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-6 mt-6 border-t border-[#F2EDE4]">
          <p className="text-xs text-[#898989]">
            Already have a merchant or admin account?{' '}
            <Link href="/login" className="font-semibold text-[#B88E2F] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
