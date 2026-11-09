'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Store, Save, ExternalLink, AlertCircle, Image, Globe, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useMyShopQuery, useUpdateMyShopMutation } from '../../../hooks/useShopOwner';
import { useAuth } from '../../../context/AuthContext';
import DashFileUpload from '../../../components/dashboard/DashFileUpload';

const shopSettingsSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  address: z.string().optional(),
});

export default function ShopSettingsPage() {
  const { updateUserShop } = useAuth();

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoCleared, setLogoCleared] = useState(false);
  const [bannerCleared, setBannerCleared] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shopSettingsSchema),
    defaultValues: {
      name: '',
      description: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  // Query settings via custom hook
  const {
    data: shopData,
    isLoading,
  } = useMyShopQuery();

  useEffect(() => {
    if (shopData) {
      reset({
        name: shopData.name || '',
        description: shopData.description || '',
        phone: shopData.phone || '',
        email: shopData.email || '',
        address: shopData.address || '',
      });
      setLogoFile(null);
      setBannerFile(null);
      setLogoCleared(false);
      setBannerCleared(false);
    }
  }, [shopData, reset]);

  // Mutation via custom hook
  const mutation = useUpdateMyShopMutation({
    onSuccess: (data) => {
      updateUserShop(data.shop);
      toast.success('Store Settings Updated', {
        description: 'Your storefront details and branding have been saved successfully.',
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error('Update Failed', {
        description: err.response?.data?.message || 'Could not save store settings.',
      });
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.address) formData.append('address', data.address);

    if (logoFile) {
      formData.append('logo', logoFile);
    } else if (logoCleared) {
      formData.append('logo', '');
    }

    if (bannerFile) {
      formData.append('banner', bannerFile);
    } else if (bannerCleared) {
      formData.append('banner', '');
    }

    mutation.mutate(formData);
  };

  const previewSlug = shopData?.slug;
  const currentBanner = bannerCleared
    ? null
    : bannerFile
    ? URL.createObjectURL(bannerFile)
    : shopData?.banner_url;
  const currentLogo = logoCleared
    ? null
    : logoFile
    ? URL.createObjectURL(logoFile)
    : shopData?.logo_url;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#343C6A] font-inter">Store Identity & Branding</h2>
          <p className="text-xs text-[#718EBF] mt-0.5">
            Configure your independent merchant profile, public branding, and contact details.
          </p>
        </div>

        {previewSlug && (
          <Link
            href={`/shop/${previewSlug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-[#FAF3EA] hover:bg-[#F4E8D3] text-[#B88E2F] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Preview Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Live Branding Preview */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B88E2F] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#718EBF]">
              Live Storefront Header Preview
            </span>
          </div>
          {previewSlug && (
            <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-[#FAF3EA] text-[#B88E2F] font-semibold border border-[#E8DEC8]/60">
              /{previewSlug}
            </span>
          )}
        </div>

        <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-[#E6EFF5] bg-[#F5F7FA] shadow-xs">
          {currentBanner ? (
            <img
              src={currentBanner}
              alt="Banner Preview"
              className="w-full h-full object-cover filter brightness-[0.88]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FAF3EA] via-[#F4EDE2] to-[#EAE0D0] flex flex-col items-center justify-center text-[#718EBF]">
              <Store className="w-10 h-10 text-[#B88E2F]/40 mb-2" />
              <span className="text-xs font-medium text-[#8BA3CB]">No banner uploaded · Default warm aesthetic applied</span>
            </div>
          )}

          {/* Dark gradient overlay for text readability (matches MerchantHeader) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />

          {/* Content inside the banner */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-xl border border-white/60 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-[#B88E2F]" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md truncate">
                  {watch('name') || 'Your Store Name'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-1 max-w-md mt-0.5 drop-shadow">
                  {watch('description') || 'Welcome to our independent boutique storefront.'}
                </p>
              </div>
            </div>

            {/* Dynamic chips for contact info */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              {watch('address') && (
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-200 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#B88E2F]" />
                  <span className="truncate max-w-[180px]">{watch('address')}</span>
                </div>
              )}
              {watch('phone') && (
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-200 border border-white/10">
                  <Phone className="w-3.5 h-3.5 text-[#B88E2F]" />
                  <span>{watch('phone')}</span>
                </div>
              )}
              {watch('email') && (
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-200 border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-[#B88E2F]" />
                  <span className="truncate max-w-[180px]">{watch('email')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[25px] border-0 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Store / Business Name <span className="text-[#B88E2F]">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none transition-all ${
                errors.name ? 'ring-2 ring-rose-400 bg-rose-50/20' : 'focus:ring-2 focus:ring-[#B88E2F]/30 focus:bg-white'
              }`}
              placeholder="e.g. Apex Tech Essentials"
            />
            {errors.name && (
              <span className="text-[11px] text-rose-600 flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.name.message}</span>
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">Storefront Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full p-3.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all resize-none"
              placeholder="Tell customers what your store is about..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#718EBF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">Contact Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#718EBF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full h-11 pl-10 pr-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none transition-all ${
                    errors.email ? 'ring-2 ring-rose-400 bg-rose-50/20' : 'focus:ring-2 focus:ring-[#B88E2F]/30 focus:bg-white'
                  }`}
                  placeholder="support@mystore.com"
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-rose-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email.message}</span>
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">Physical Address / Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#718EBF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('address')}
                className="w-full h-11 pl-10 pr-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
                placeholder="123 Innovation Way, Suite 400, Austin, TX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <DashFileUpload
              label="Store Logo"
              helperText="PNG, JPG, WebP. Recommended 500x500px square."
              currentUrl={logoCleared ? null : (logoFile ? URL.createObjectURL(logoFile) : shopData?.logo_url)}
              onFileSelect={(file) => {
                setLogoFile(file);
                setLogoCleared(false);
              }}
              onRemove={() => {
                setLogoFile(null);
                setLogoCleared(true);
              }}
              aspect="square"
            />

            <DashFileUpload
              label="Storefront Banner"
              helperText="PNG, JPG, WebP. Recommended 1920x600px widescreen."
              currentUrl={bannerCleared ? null : (bannerFile ? URL.createObjectURL(bannerFile) : shopData?.banner_url)}
              onFileSelect={(file) => {
                setBannerFile(file);
                setBannerCleared(false);
              }}
              onRemove={() => {
                setBannerFile(null);
                setBannerCleared(true);
              }}
              aspect="banner"
            />
          </div>

          <div className="pt-4 border-t border-[#F5F7FA] flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-sm flex items-center space-x-2 border-0 outline-none cursor-pointer"
            >
              {mutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
