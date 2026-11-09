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
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Package,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
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
    <div className="furniro-register-page bg-[#FAF3EA]/30 min-h-screen flex flex-col justify-between">
      {/* 1. Header Banner */}
      <PageBanner
        title="Open a Store"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Register Merchant' }]}
      />

      {/* 2. Main Registration Container (Spacious Wide Layout) */}
      <main className="section-container py-14 sm:py-20 flex-1">
        <div className="max-w-5xl mx-auto bg-white shadow-sm border-0 rounded-none overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Register Form (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-2">
                  <img
                    src="/images/furniro/imgMeubelHouseLogos05.png"
                    alt="Furniro Logo"
                    className="w-8 h-6 object-contain"
                  />
                  <span className="font-bold text-xl tracking-tight text-black font-montserrat">
                    Furniro
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#333333] font-montserrat mt-2">
                  Launch Your Store
                </h1>
                <p className="text-sm text-[#898989] mt-1.5">
                  Join the Furniro multi-store network. Sell from the shared catalog or retail custom pieces.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    Store / Shop Name <span className="text-[#B88E2F]">*</span>
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      {...register('shop_name')}
                      className="w-full pl-12 pr-4 h-13 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F5EDE1] transition-colors"
                      placeholder="e.g. Nordic Haven Studio"
                    />
                  </div>
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
                    <div className="relative">
                      <User className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        {...register('name')}
                        className="w-full pl-12 pr-4 h-13 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F5EDE1] transition-colors"
                        placeholder="Jane Doe"
                      />
                    </div>
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
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        {...register('phone')}
                        className="w-full pl-12 pr-4 h-13 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F5EDE1] transition-colors"
                        placeholder="+1 (555) 234-5678"
                      />
                    </div>
                  </div>
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
                      className="w-full pl-12 pr-4 h-13 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F5EDE1] transition-colors"
                      placeholder="jane@nordichaven.com"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#333333] mb-2">
                    Password <span className="text-[#B88E2F]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9F9F9F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      {...register('password')}
                      className="w-full pl-12 pr-4 h-13 text-sm bg-[#FAF7F2] text-[#333333] placeholder-[#9F9F9F] rounded-none border-0 outline-none focus:bg-[#F5EDE1] transition-colors"
                      placeholder="At least 6 characters"
                    />
                  </div>
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
                  className="w-full h-13 rounded-none bg-[#B88E2F] hover:bg-[#967125] text-white font-semibold text-sm tracking-widest uppercase transition-all flex items-center justify-center space-x-2 border-0 outline-none shadow-none cursor-pointer mt-4"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Launch Storefront Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#F2EDE4] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#898989]">
                <span>Already have a merchant or admin account?</span>
                <Link
                  href="/login"
                  className="font-semibold text-[#B88E2F] hover:underline flex items-center gap-1"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Merchant Network Benefits (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF7F2] p-8 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-[#F0E6D8] flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B88E2F] flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4" /> Merchant Network
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-montserrat">
                  Why open a store on Furniro?
                </h3>
                <p className="text-xs text-[#717171] mt-2 leading-relaxed">
                  Join hundreds of independent artisans, carpenters, and boutique studios distributing hand-crafted living decor.
                </p>

                <div className="space-y-4 mt-6">
                  <div className="p-3.5 bg-white rounded-none flex items-start gap-3">
                    <div className="p-2 bg-[#FAF3EA] text-[#B88E2F] flex-shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Shared Catalog Access
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Instantly retail platform master furniture or publish unique artisan items to other stores.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-none flex items-start gap-3">
                    <div className="p-2 bg-[#FAF3EA] text-[#B88E2F] flex-shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Custom Markup & Pricing
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Full autonomy over your store retail prices, promotional copy, and distinct photo angles.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-none flex items-start gap-3">
                    <div className="p-2 bg-[#FAF3EA] text-[#B88E2F] flex-shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Direct Merchant Dashboard
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Fulfill customer orders, track weekly earnings, and control your public storefront branding.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EBE3D5] text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B88E2F]" />
                  <span>Instant setup in under 60 seconds</span>
                </div>
                Your storefront is generated automatically with its own custom URL slug and portal.
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 3. Features Bar */}
      <FeaturesBar />
    </div>
  );
}
