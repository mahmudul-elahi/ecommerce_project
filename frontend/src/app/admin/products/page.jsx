'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  Store,
  AlertCircle,
  Tag,
  Check,
  CheckCircle2,
  ShieldCheck,
  FolderTree,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useAdminProductsQuery,
  useAdminCategoriesQuery,
  useSaveAdminProductMutation,
  useDeleteAdminProductMutation,
} from '../../../hooks/useAdmin';

const adminProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().optional(),
  category_id: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  base_price: z.string().min(1, 'Base price is required'),
  is_active: z.boolean().default(true),
});

export default function ProductManagementPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Multiple Images State
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Dynamic Categories from database
  const { data: dbCategories = [] } = useAdminCategoriesQuery();

  // Products Query
  const {
    data: products = [],
    isLoading,
  } = useAdminProductsQuery({ search: debouncedSearch, category: selectedCategory });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: '',
      sku: '',
      category_id: '',
      category: '',
      description: '',
      base_price: '',
      is_active: true,
    },
  });

  // Save Mutation
  const saveMutation = useSaveAdminProductMutation({
    onSuccess: (_, vars) => {
      toast.success(vars.id ? 'Product Updated' : 'Product Added to Shared Catalog', {
        description: 'Changes with optimized images are immediately synchronized across all stores.',
      });
      setIsModalOpen(false);
      setNewImageFiles([]);
      setNewImagePreviews([]);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Save Failed', {
        description: err.response?.data?.message || 'Could not save catalog product.',
      });
    },
  });

  // Delete Mutation
  const deleteMutation = useDeleteAdminProductMutation({
    onSuccess: () => {
      toast.success('Catalog Product Deleted', {
        description: 'Product removed from global inventory and store listings.',
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error('Delete Failed', {
        description: err.response?.data?.message || 'Could not delete product.',
      });
    },
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    reset({
      name: '',
      sku: '',
      category_id: dbCategories[0]?.id ? String(dbCategories[0].id) : '',
      category: '',
      description: '',
      base_price: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    const prodImages = Array.isArray(prod.images) ? prod.images : (prod.images_urls || [prod.thumbnail_url].filter(Boolean));
    setExistingImages(prodImages);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    reset({
      name: prod.name || '',
      sku: prod.sku || '',
      category_id: prod.category_id ? String(prod.category_id) : '',
      category: prod.category || '',
      description: prod.description || '',
      base_price: String(prod.base_price || ''),
      is_active: prod.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.sku) formData.append('sku', data.sku);
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.category) formData.append('category', data.category);
    if (data.description) formData.append('description', data.description);
    formData.append('base_price', data.base_price);
    formData.append('is_active', data.is_active ? '1' : '0');

    // Existing images to keep
    existingImages.forEach((img) => {
      formData.append('images[]', img);
    });

    // New image files to optimize via Laravel 13 Image facade
    newImageFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    saveMutation.mutate({ id: editingProduct?.id, payload: formData });
  };

  return (
    <div className="space-y-6">
      {/* BankDash Filter & Action Bar */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog by name or SKU..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-full border-0 outline-none focus:ring-1 focus:ring-[#B88E2F]/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#718EBF]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-4 text-xs bg-[#F5F7FA] text-[#343C6A] rounded-xl border-0 outline-none font-medium cursor-pointer"
            >
              <option value="">All Categories</option>
              {dbCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-[#718EBF]">
            Showing <strong className="text-[#343C6A]">{products.length}</strong> items
          </span>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 border-0 outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* BankDash Product Table Container */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#343C6A]">
            <thead className="border-b border-[#E6EFF5] text-[#718EBF] text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-4 font-inter">Product Details & Images</th>
                <th className="pb-4 font-inter">Category</th>
                <th className="pb-4 font-inter">Base Price</th>
                <th className="pb-4 font-inter">Created By</th>
                <th className="pb-4 font-inter">Listed in Shops</th>
                <th className="pb-4 font-inter">Status</th>
                <th className="pb-4 font-inter text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Loading shared catalog products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No products found in master catalog.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const images = Array.isArray(prod.images) ? prod.images : (prod.images_urls || [prod.thumbnail_url].filter(Boolean));
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                            {prod.thumbnail_url ? (
                              <img
                                src={prod.thumbnail_url}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            )}
                            {images.length > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] px-1 rounded font-mono">
                                +{images.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">
                              {prod.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {prod.sku || 'No SKU'} · {images.length} image{images.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-200">
                          {prod.category_relation?.name || prod.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-900 font-semibold">
                        Rp {Number(prod.base_price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {prod.creator?.name || 'Administrator'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono">
                          <Store className="w-3 h-3 text-slate-500" />
                          <span>{prod.shops_count || 0} shops</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            prod.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {prod.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 text-slate-500 hover:text-[#B88E2F] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(prod.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit Product with Multiple Images & Dynamic Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Catalog Product: ${editingProduct.name}` : 'New Master Catalog Product'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Product Title <span className="text-[#B88E2F]">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
              placeholder="e.g. Syltherine Cafe Chair"
            />
            {errors.name && (
              <span className="text-[11px] text-rose-600 mt-1 block">{errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Base Price (Rp) <span className="text-[#B88E2F]">*</span>
              </label>
              <input
                type="number"
                min="0"
                {...register('base_price')}
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] font-mono placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
                placeholder="2500000"
              />
              {errors.base_price && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.base_price.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">SKU / Code</label>
              <input
                type="text"
                {...register('sku')}
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] font-mono placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
                placeholder="FUR-001"
              />
            </div>
          </div>

          {/* Dynamic Category Dropdown from Database */}
          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Category (from Dynamic Categories Table)
            </label>
            <select
              {...register('category_id')}
              className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] rounded-xl border-0 outline-none font-medium cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
            >
              <option value="">-- Select Category --</option>
              {dbCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Multiple Images Upload & Gallery Management */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#343C6A]">
                Product Images (Multiple angles/shots - optimized to WebP)
              </label>
              <span className="text-[11px] text-[#718EBF]">
                {existingImages.length + newImageFiles.length} image(s) selected
              </span>
            </div>

            {/* Existing Images preview */}
            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
              <div className="flex flex-wrap gap-2.5 mb-2.5 p-3 bg-[#F5F7FA] rounded-xl border-0">
                {existingImages.map((src, idx) => (
                  <div key={`existing-${idx}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shadow-xs group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#B88E2F] text-white text-[8px] text-center font-bold">
                        MAIN
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {newImagePreviews.map((src, idx) => (
                  <div key={`new-${idx}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shadow-xs group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-[#B88E2F] text-white text-[8px] text-center font-bold">
                      NEW
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File Upload Trigger */}
            <label className="border-2 border-dashed border-[#DFEAF2] hover:border-[#B88E2F] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F5F7FA] hover:bg-[#FAF3EA]/50">
              <Upload className="w-6 h-6 text-[#718EBF] mb-1" />
              <span className="text-xs font-semibold text-[#343C6A]">Click or drop multiple images here</span>
              <span className="text-[10px] text-[#718EBF] mt-0.5">Supports PNG, JPG, WebP. Laravel 13 automatically optimizes each image.</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesSelect}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">Product Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full p-3.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all resize-none"
              placeholder="Specifications, materials, dimensions, and craft details..."
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="admin_prod_active"
              {...register('is_active')}
              className="rounded-md border-0 text-[#B88E2F] focus:ring-[#B88E2F]"
            />
            <label htmlFor="admin_prod_active" className="text-xs font-semibold text-[#343C6A] cursor-pointer">
              Active in Shared Catalog
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
              disabled={saveMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] disabled:opacity-60 text-white text-xs font-semibold shadow-sm transition-all border-0 outline-none cursor-pointer"
            >
              {saveMutation.isPending ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Master Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
