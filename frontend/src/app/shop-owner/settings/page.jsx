'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Store, Save, ExternalLink, AlertCircle, Image, Globe, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useMyShopQuery, useUpdateMyShopMutation } from '../../../hooks/useShopOwner';
import { useAuth } from '../../../context/AuthContext';

const shopSettingsSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
});

export default function ShopSettingsPage() {
  const { updateUserShop } = useAuth();

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
      logo: '',
      banner: '',
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
        logo: shopData.logo_url || '',
        banner: shopData.banner_url || '',
      });
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

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  const previewSlug = shopData?.slug;
  const currentBanner = watch('banner') || shopData?.banner_url;
  const currentLogo = watch('logo') || shopData?.logo_url;

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
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-hidden space-y-4">
        <div className="relative h-36 bg-[#F5F7FA] rounded-2xl overflow-hidden border border-[#E6EFF5]">
          {currentBanner ? (
            <img src={currentBanner} alt="Banner Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[#718EBF] font-mono">
              Banner Image Preview
            </div>
          )}
          <div className="absolute inset-0 bg-slate-900/10" />
          <div className="absolute -bottom-2 left-6">
            <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
              {currentLogo ? (
                <img src={currentLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-[#718EBF]" />
              )}
            </div>
          </div>
        </div>
        <div className="pt-2 px-2 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase text-[#718EBF]">Live Header Preview</div>
            <div className="text-sm font-bold text-[#343C6A]">{watch('name') || 'Your Store Name'}</div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#FAF3EA] text-[#B88E2F] font-semibold">
            /{previewSlug}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[25px] border-0 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Store / Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-none border-0 ${
                errors.name ? 'ring-1 ring-rose-400' : 'focus:ring-1 focus:ring-[#B88E2F]'
              } focus:outline-none focus:bg-white text-slate-900`}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Storefront Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-none border-0 focus:outline-none focus:ring-1 focus:ring-[#B88E2F] focus:bg-white text-slate-900"
              placeholder="Tell customers what your store is about..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Phone</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-none border-0 focus:outline-none focus:ring-1 focus:ring-[#B88E2F] focus:bg-white text-slate-900"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-none border-0 ${
                    errors.email ? 'ring-1 ring-rose-400' : 'focus:ring-1 focus:ring-[#B88E2F]'
                  } focus:outline-none focus:bg-white text-slate-900`}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Physical Address / Location</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('address')}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-none border-0 focus:outline-none focus:ring-1 focus:ring-[#B88E2F] focus:bg-white text-slate-900"
                placeholder="123 Innovation Way, Suite 400, Austin, TX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Logo Image URL</label>
              <div className="relative">
                <Image className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('logo')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-none border-0 focus:outline-none focus:ring-1 focus:ring-[#B88E2F] focus:bg-white text-slate-900"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Banner Image URL</label>
              <div className="relative">
                <Image className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('banner')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-none border-0 focus:outline-none focus:ring-1 focus:ring-[#B88E2F] focus:bg-white text-slate-900"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2.5 rounded-none bg-[#B88E2F] hover:bg-[#967125] disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-none flex items-center space-x-2 border-0 outline-none cursor-pointer"
            >
              {mutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
