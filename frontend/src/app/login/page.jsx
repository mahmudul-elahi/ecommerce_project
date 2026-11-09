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
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
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
    <div className="furniro-login-page bg-[#FAF3EA]/30 min-h-screen flex flex-col justify-between">
      {/* 1. Furniro Header Banner */}
      <PageBanner
        title="My Account"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Login' }]}
      />

      {/* 2. Main Login Container (Spacious Wide Layout) */}
      <main className="section-container py-14 sm:py-20 flex-1">
        <div className="max-w-5xl mx-auto bg-white shadow-sm border-0 rounded-none overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Sign In Form (7 cols) */}
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
                  Log In
                </h1>
                <p className="text-sm text-[#898989] mt-1.5">
                  Welcome back! Enter your credentials to access your control suite.
                </p>
              </div>

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

              <div className="mt-8 pt-6 border-t border-[#F2EDE4] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#898989]">
                <span>Want to sell handcrafted furniture?</span>
                <Link
                  href="/register"
                  className="font-semibold text-[#B88E2F] hover:underline flex items-center gap-1"
                >
                  <span>Launch Merchant Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Demo Accounts & Architecture Highlights (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF7F2] p-8 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-[#F0E6D8] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B88E2F] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> 1-Click Demo Accounts
                  </span>
                  <span className="text-[10px] text-[#9F9F9F] font-mono">Instant Autofill</span>
                </div>

                <p className="text-xs text-[#717171] mb-5 leading-relaxed">
                  Select any persona below to quickly test the multi-tenant architecture and portal features:
                </p>

                <div className="space-y-3">
                  {/* Persona 1: Platform Admin */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@ecommerce.com', 'password')}
                    className="w-full p-3.5 bg-white text-left transition-all hover:bg-[#F4E8D3] hover:shadow-xs rounded-none flex items-start gap-3 border-0 outline-none group cursor-pointer"
                  >
                    <div className="p-2 bg-[#FAF3EA] text-[#B88E2F] rounded-none group-hover:bg-[#B88E2F] group-hover:text-white transition-colors flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs">
                          Platform Administrator
                        </span>
                        <span className="text-[10px] font-mono text-[#B88E2F] uppercase font-bold">Admin</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        admin@ecommerce.com
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Full catalog management, categories, and store oversight.
                      </div>
                    </div>
                  </button>

                  {/* Persona 2: Flagship Merchant */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('furniro@ecommerce.com', 'password')}
                    className="w-full p-3.5 bg-white text-left transition-all hover:bg-[#F4E8D3] hover:shadow-xs rounded-none flex items-start gap-3 border-0 outline-none group cursor-pointer"
                  >
                    <div className="p-2 bg-[#FAF3EA] text-[#B88E2F] rounded-none group-hover:bg-[#B88E2F] group-hover:text-white transition-colors flex-shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs">
                          Furniro Flagship Store
                        </span>
                        <span className="text-[10px] font-mono text-[#B88E2F] uppercase font-bold">Merchant</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        furniro@ecommerce.com
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Store-specific pricing, custom listings, and orders.
                      </div>
                    </div>
                  </button>

                  {/* Persona 3: Partner Boutique */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('partner@ecommerce.com', 'password')}
                    className="w-full p-3.5 bg-white text-left transition-all hover:bg-[#F4E8D3] hover:shadow-xs rounded-none flex items-start gap-3 border-0 outline-none group cursor-pointer"
                  >
                    <div className="p-2 bg-[#FAF3EA] text-[#B88E2F] rounded-none group-hover:bg-[#B88E2F] group-hover:text-white transition-colors flex-shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs">
                          Artisan Living Boutique
                        </span>
                        <span className="text-[10px] font-mono text-[#B88E2F] uppercase font-bold">Merchant</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        partner@ecommerce.com
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Independent boutique shop in the shared catalog.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Informational feature card */}
              <div className="pt-4 border-t border-[#EBE3D5]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B88E2F]" />
                  <span>Shared Catalog Architecture</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Every merchant operates an independent storefront with custom markup and inventory while pulling master products from the centralized database.
                </p>
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
