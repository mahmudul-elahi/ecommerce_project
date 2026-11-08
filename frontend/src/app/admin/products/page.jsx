'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useAdminProductsQuery,
  useSaveAdminProductMutation,
  useDeleteAdminProductMutation,
} from '../../../hooks/useAdmin';

const adminProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  base_price: z.string().min(1, 'Base price is required'),
  thumbnail: z.string().optional(),
  is_active: z.boolean().default(true),
});

export default function ProductManagementPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // TanStack React Query via custom hook
  const {
    data: products = [],
    isLoading,
  } = useAdminProductsQuery({ search: debouncedSearch, category });

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
      category: '',
      description: '',
      base_price: '',
      thumbnail: '',
      is_active: true,
    },
  });

  // Save Mutation via custom hook
  const saveMutation = useSaveAdminProductMutation({
    onSuccess: (_, vars) => {
      toast.success(vars.id ? 'Product Updated' : 'Product Added to Shared Catalog', {
        description: 'Changes are immediately synchronized across all store frontends.',
      });
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Save Failed', {
        description: err.response?.data?.message || 'Could not save catalog product.',
      });
    },
  });

  // Delete Mutation via custom hook
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
    reset({
      name: '',
      sku: '',
      category: '',
      description: '',
      base_price: '',
      thumbnail: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    reset({
      name: prod.name || '',
      sku: prod.sku || '',
      category: prod.category || '',
      description: prod.description || '',
      base_price: String(prod.base_price || ''),
      thumbnail: prod.thumbnail_url || '',
      is_active: prod.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const onFormSubmit = (data) => {
    const payload = {
      name: data.name,
      sku: data.sku || null,
      category: data.category || null,
      description: data.description || null,
      thumbnail: data.thumbnail || null,
      base_price: parseFloat(data.base_price),
      is_active: data.is_active,
    };
    saveMutation.mutate({ id: editingProduct?.id, payload });
  };

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-paper">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-mono uppercase tracking-wide mb-1.5">
            <Layers className="w-3 h-3 text-emerald-800" />
            <span>Platform Inventory Management</span>
          </div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Global Catalog Registry</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Centralized master product list available to all connected storefronts.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-subtle flex items-center space-x-1.5 transition-all active:scale-[0.99] self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Catalog Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 mb-6 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog by title, SKU, or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
            />
          </div>

          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-700"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs font-mono text-stone-500">
          Total: <span className="text-stone-900 font-bold">{products.length}</span> shared items
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Product Details</th>
                <th className="px-5 py-3">Base Price</th>
                <th className="px-5 py-3">Created By</th>
                <th className="px-5 py-3">Listed in Shops</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-stone-400">
                    <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading catalog...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-stone-500">
                    <Layers className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <div className="font-semibold text-stone-800">No products found</div>
                    <p className="text-xs text-stone-400 mt-1">Create master products to populate the shared catalog.</p>
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            prod.thumbnail_url ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
                          }
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover bg-stone-100 border border-stone-200 flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
                          }}
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-xs">{prod.name}</div>
                          <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-400 mt-0.5">
                            {prod.category && <span className="uppercase">{prod.category}</span>}
                            {prod.sku && <span>• SKU: {prod.sku}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-stone-900">
                      ${Number(prod.base_price).toFixed(2)}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="text-stone-800 font-medium text-xs">
                        {prod.creator ? prod.creator.name : 'System Admin'}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 uppercase">
                        {prod.creator ? prod.creator.role.replace('_', ' ') : 'Platform Default'}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-bold text-stone-800">
                        {prod.shop_products_count ?? 0}
                      </span>{' '}
                      <span className="text-[11px] text-stone-500">stores</span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${prod.is_active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                          }`}
                      >
                        {prod.is_active ? 'Active' : 'Archived'}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${prod.name}" from the global catalog?`)) {
                              deleteMutation.mutate(prod.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete from Catalog"
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

      {/* Modal: Create or Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Catalog Product: ${editingProduct.name}` : 'New Master Catalog Product'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-3 py-2 text-xs bg-stone-50 border ${errors.name ? 'border-rose-400' : 'border-stone-200'
                } rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900`}
              placeholder="e.g. Ergonomic Office Desk"
            />
            {errors.name && (
              <span className="text-[11px] text-rose-600 mt-1">{errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Base Wholesale Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('base_price')}
                className={`w-full px-3 py-2 text-xs bg-stone-50 border ${errors.base_price ? 'border-rose-400' : 'border-stone-200'
                  } rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-mono`}
                placeholder="199.99"
              />
              {errors.base_price && (
                <span className="text-[11px] text-rose-600 mt-1">{errors.base_price.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">SKU / Code</label>
              <input
                type="text"
                {...register('sku')}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-mono"
                placeholder="FURN-102"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <input
                type="text"
                {...register('category')}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
                placeholder="Furniture, Gadgets, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Thumbnail URL</label>
              <input
                type="text"
                {...register('thumbnail')}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Master Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
              placeholder="Standard specifications and description inherited by all shop owners by default..."
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="admin_prod_active"
              {...register('is_active')}
              className="rounded text-stone-900 focus:ring-stone-900"
            />
            <label htmlFor="admin_prod_active" className="text-xs font-semibold text-stone-800 cursor-pointer">
              Active in Shared Catalog
            </label>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-subtle active:scale-[0.99]"
            >
              {saveMutation.isPending ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Master Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
