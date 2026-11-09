'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Tag,
  CheckCircle2,
  XCircle,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useShopOwnerProductsQuery,
  useUpdateShopProductMutation,
  useResetShopProductMutation,
  useRemoveShopProductMutation,
} from '../../../hooks/useShopOwner';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/common/Modal';

const customizeSchema = z.object({
  custom_price: z.string().optional(),
  custom_title: z.string().optional(),
  custom_description: z.string().optional(),
  custom_thumbnail: z.string().optional(),
  clear_custom_thumbnail: z.boolean().default(false),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  is_active: z.boolean().default(true),
});

export default function MyProductsPage() {
  const { shop } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  // Clean custom query hook
  const {
    data: listings = [],
    isLoading,
  } = useShopOwnerProductsQuery(debouncedSearch);

  // React Hook Form for Customize Modal
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customizeSchema),
    defaultValues: {
      custom_price: '',
      custom_title: '',
      custom_description: '',
      custom_thumbnail: '',
      clear_custom_thumbnail: false,
      stock: 100,
      is_active: true,
    },
  });

  // Custom Images State
  const [customFiles, setCustomFiles] = useState([]);
  const [customPreviews, setCustomPreviews] = useState([]);

  const handleOpenEditModal = (listing) => {
    setSelectedListing(listing);
    setCustomFiles([]);
    setCustomPreviews([]);
    reset({
      custom_price: listing.custom_price !== null ? String(listing.custom_price) : '',
      custom_title: listing.custom_title || '',
      custom_description: listing.custom_description || '',
      custom_thumbnail: listing.custom_thumbnail || '',
      clear_custom_thumbnail: false,
      stock: listing.stock ?? 100,
      is_active: listing.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleCustomFilesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setCustomFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCustomFile = (index) => {
    setCustomFiles((prev) => prev.filter((_, i) => i !== index));
    setCustomPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Custom Mutations
  const saveMutation = useUpdateShopProductMutation({
    onSuccess: () => {
      toast.success('Customizations Saved', {
        description: 'Shop pricing and product details updated successfully with optimized images.',
      });
      setIsModalOpen(false);
      setCustomFiles([]);
      setCustomPreviews([]);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Update Failed', {
        description: err.response?.data?.message || 'Could not update shop listing.',
      });
    },
  });

  const resetMutation = useResetShopProductMutation({
    onSuccess: () => {
      toast.success('Restored to Catalog', {
        description: 'Listing reverted to shared catalog default title, price, and thumbnail.',
      });
      setIsModalOpen(false);
      setCustomFiles([]);
      setCustomPreviews([]);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Reset Failed', {
        description: err.response?.data?.message || 'Could not reset listing.',
      });
    },
  });

  const removeMutation = useRemoveShopProductMutation({
    onSuccess: () => {
      toast.success('Product Removed', {
        description: 'The product was removed from your store but remains in the global catalog.',
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error('Remove Failed', {
        description: err.response?.data?.message || 'Could not remove product from shop.',
      });
    },
  });

  const onModalSubmit = (data) => {
    if (!selectedListing) return;
    const formData = new FormData();
    if (data.custom_price !== '' && data.custom_price !== null) {
      formData.append('custom_price', data.custom_price);
    }
    if (data.custom_title) {
      formData.append('custom_title', data.custom_title);
    }
    if (data.custom_description) {
      formData.append('custom_description', data.custom_description);
    }
    if (data.clear_custom_thumbnail) {
      formData.append('clear_custom_thumbnail', '1');
    }
    formData.append('stock', data.stock);
    formData.append('is_active', data.is_active ? '1' : '0');

    customFiles.forEach((file) => {
      formData.append('custom_images[]', file);
    });

    saveMutation.mutate({ id: selectedListing.id, payload: formData });
  };

  const currentPriceInput = watch('custom_price');
  const basePrice = selectedListing?.product?.base_price || 0;
  const marginDiff = currentPriceInput !== '' && !isNaN(parseFloat(currentPriceInput))
    ? (parseFloat(currentPriceInput) - basePrice).toFixed(2)
    : null;

  return (
    <div className="space-y-6">
      {/* BankDash Filter & Action Bar */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter listed products..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-full border-0 outline-none focus:ring-1 focus:ring-[#B88E2F]/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#718EBF]">
            Listed: <strong className="text-[#343C6A]">{listings.length}</strong> items
          </span>

          <Link
            href="/shop-owner/catalog"
            className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 border-0 outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add from Shared Catalog</span>
          </Link>
        </div>
      </div>

      {/* BankDash Listings Table Container */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#343C6A]">
            <thead className="border-b border-[#E6EFF5] text-[#718EBF] text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-4 font-inter">Product / Thumbnail</th>
                <th className="pb-4 font-inter">Your Retail Price</th>
                <th className="pb-4 font-inter">Stock</th>
                <th className="pb-4 font-inter">Custom Details</th>
                <th className="pb-4 font-inter">Visibility</th>
                <th className="pb-4 font-inter text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading inventory...</span>
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-14 text-center text-slate-500">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">No products assigned to your shop yet.</div>
                    <p className="text-xs text-slate-400 mt-0.5">Browse the shared catalog to assign and retail items.</p>
                    <Link
                      href="/shop-owner/catalog"
                      className="mt-3 inline-flex items-center space-x-1 text-xs font-semibold text-[#B88E2F] hover:underline"
                    >
                      <span>Explore Shared Catalog →</span>
                    </Link>
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              item.effective_thumbnail_url ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
                            }
                            alt={item.effective_title}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100';
                            }}
                          />
                          {item.custom_thumbnail && (
                            <span
                              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-700 rounded-full border border-white"
                              title="Custom store thumbnail applied"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs line-clamp-1">{item.effective_title}</div>
                          {item.custom_title && (
                            <div className="text-[10px] text-slate-400 font-mono line-clamp-1">
                              Catalog title: {item.product?.name}
                            </div>
                          )}
                          <div className="text-[10px] font-mono uppercase text-slate-400 mt-0.5">
                            {item.product?.category || 'General'} • SKU: {item.product?.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Store Price */}
                    <td className="px-5 py-3.5 font-mono">
                      <div className="font-bold text-xs text-slate-900">
                        ${Number(item.effective_price).toFixed(2)}
                      </div>
                      {item.custom_price !== null && (
                        <span className="text-[10px] font-bold text-[#B88E2F] bg-[#FAF3EA] px-2 py-0.5 rounded-md inline-block mt-0.5">
                          Custom Markup
                        </span>
                      )}
                    </td>

                    {/* Catalog Base Price */}
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">
                      ${Number(item.product?.base_price || 0).toFixed(2)}
                    </td>

                    {/* Customizations Badges */}
                    <td className="px-5 py-3.5">
                      {item.is_customized ? (
                        <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                          {item.custom_price !== null && (
                            <span className="px-2 py-0.5 rounded-md bg-[#FAF3EA] text-[#B88E2F]">
                              Price
                            </span>
                          )}
                          {item.custom_title && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Title
                            </span>
                          )}
                          {item.custom_thumbnail && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Image
                            </span>
                          )}
                          {item.custom_description && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">
                              Desc
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Catalog Default</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">
                      {item.stock}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          item.is_active
                            ? 'bg-[#FAF3EA] text-[#B88E2F]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.is_active ? 'Live' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1 rounded-lg text-slate-800 hover:bg-slate-100 border border-slate-200 text-xs font-semibold transition-colors flex items-center space-x-1"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          <span>Customize</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove "${item.effective_title}" from your storefront?`)) {
                              removeMutation.mutate(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove from shop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Customize Listing */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Customize Store Listing`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onModalSubmit)} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500">Shared Catalog Base Price:</span>{' '}
              <span className="font-mono font-bold text-slate-900">${Number(basePrice).toFixed(2)}</span>
            </div>
            {selectedListing?.is_customized && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all customizations back to shared catalog defaults?')) {
                    resetMutation.mutate(selectedListing.id);
                  }
                }}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Catalog</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Store Retail Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('custom_price')}
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all font-mono"
                placeholder={basePrice ? String(basePrice) : 'Leave blank for default'}
              />
              {marginDiff !== null && (
                <div className="text-[10px] font-mono mt-1 text-[#718EBF]">
                  Margin: <span className={Number(marginDiff) >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                    {Number(marginDiff) >= 0 ? `+$${marginDiff}` : `-$${Math.abs(Number(marginDiff)).toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Store Inventory Units
              </label>
              <input
                type="number"
                min="0"
                {...register('stock')}
                className={`w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none transition-all font-mono ${
                  errors.stock ? 'ring-2 ring-rose-400 bg-rose-50/20' : 'focus:ring-2 focus:ring-[#B88E2F]/30 focus:bg-white'
                }`}
              />
              {errors.stock && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.stock.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Custom Title for this Store
            </label>
            <input
              type="text"
              {...register('custom_title')}
              className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
              placeholder={selectedListing?.product?.name || 'Leave blank for catalog title'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Custom Product Description
            </label>
            <textarea
              rows={2}
              {...register('custom_description')}
              className="w-full p-3.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all resize-none"
              placeholder="Leave blank to use default shared catalog description"
            />
          </div>

          {/* Custom Multiple Images Upload with Laravel 13 optimization */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#343C6A]">
                Custom Storefront Images (Optional shop-specific photo angles)
              </label>
              <span className="text-[11px] text-[#718EBF]">
                {customFiles.length} new image(s)
              </span>
            </div>

            {customPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-2.5 p-3 bg-[#F5F7FA] rounded-xl border-0">
                {customPreviews.map((src, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shadow-xs group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#B88E2F] text-white text-[8px] text-center font-bold">
                        MAIN
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCustomFile(idx)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="border-2 border-dashed border-[#DFEAF2] hover:border-[#B88E2F] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F5F7FA] hover:bg-[#FAF3EA]/50">
              <Upload className="w-5 h-5 text-[#718EBF] mb-1" />
              <span className="text-xs font-semibold text-[#343C6A]">Upload shop-specific product images</span>
              <span className="text-[10px] text-[#718EBF] mt-0.5">Optimized to WebP automatically with Laravel 13 Image facade.</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleCustomFilesSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="rounded-md border-0 text-[#B88E2F] focus:ring-[#B88E2F]"
            />
            <label htmlFor="is_active" className="text-xs font-semibold text-[#343C6A] cursor-pointer">
              Visible on Customer Storefront
            </label>
          </div>

          <div className="pt-4 border-t border-[#F5F7FA] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-[#FAF3EA] text-xs font-semibold text-[#343C6A] hover:text-[#B88E2F] transition-colors border-0 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending || isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-sm border-0 outline-none cursor-pointer"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Customizations'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
