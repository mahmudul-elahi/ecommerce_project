'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Store, Save, ExternalLink, AlertCircle, Image, Globe, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import api from '../../../api/client';
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
  const queryClient = useQueryClient();

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

  // Query settings via TanStack React Query
  const {
    data: shopData,
    isLoading,
  } = useQuery({
    queryKey: ['shop-settings'],
    queryFn: async () => {
      const res = await api.get('/shop-owner/my-shop');
      return res.data.shop;
    },
  });

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

  // Mutation via TanStack React Query
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.put('/shop-owner/my-shop', payload);
      return res.data;
    },
    onSuccess: (data) => {
      updateUserShop(data.shop);
      queryClient.invalidateQueries({ queryKey: ['shop-settings'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
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
      <div className="max-w-4xl mx-auto px-4 py-20 flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-paper">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 mb-6 gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-800" />
            <span>Storefront Settings & Identity</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure your independent merchant profile, public branding, and contact details.
          </p>
        </div>

        {previewSlug && (
          <Link
            href={`/shop/${previewSlug}`}
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center space-x-1.5 transition-colors shadow-subtle self-start sm:self-auto"
          >
            <span>Preview Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>
        )}
      </div>

      {/* Live Branding Preview */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-subtle">
        <div className="relative h-32 bg-stone-100 overflow-hidden">
          {currentBanner ? (
            <img src={currentBanner} alt="Banner Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-stone-400 font-mono">
              Banner Image Preview
            </div>
          )}
          <div className="absolute inset-0 bg-stone-900/10" />
          <div className="absolute -bottom-4 left-6">
            <div className="w-16 h-16 rounded-xl border-2 border-white shadow-craft bg-white overflow-hidden flex items-center justify-center">
              {currentLogo ? (
                <img src={currentLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-stone-400" />
              )}
            </div>
          </div>
        </div>
        <div className="pt-6 pb-4 px-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase text-stone-400">Live Header Preview</div>
            <div className="text-sm font-bold text-stone-900">{watch('name') || 'Your Store Name'}</div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
            slug: /{previewSlug}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-craft p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Store / Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border ${
                errors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-200 focus:ring-stone-900'
              } focus:outline-none focus:ring-1 focus:bg-white text-stone-900`}
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
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Storefront Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
              placeholder="Tell customers what your store is about..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Contact Phone</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Contact Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border ${
                    errors.email ? 'border-rose-400' : 'border-stone-200'
                  } focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900`}
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
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Physical Address / Location</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('address')}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
                placeholder="123 Innovation Way, Suite 400, Austin, TX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Logo Image URL</label>
              <div className="relative">
                <Image className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('logo')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Banner Image URL</label>
              <div className="relative">
                <Image className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('banner')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-subtle flex items-center space-x-2 active:scale-[0.99]"
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
