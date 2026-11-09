'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Store,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import {
  useAdminCategoriesQuery,
  useSaveAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
} from '../../../hooks/useAdmin';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  is_active: z.boolean().default(true),
});

export default function CategoryManagementPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: categories = [], isLoading, isError } = useAdminCategoriesQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      is_active: true,
    },
  });

  const saveMutation = useSaveAdminCategoryMutation({
    onSuccess: (_, vars) => {
      toast.success(vars.id ? 'Category Updated' : 'Category Created', {
        description: 'Changes are reflected across all storefront browsing menus.',
      });
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Save Failed', {
        description: err.response?.data?.message || 'Could not save category.',
      });
    },
  });

  const deleteMutation = useDeleteAdminCategoryMutation({
    onSuccess: () => {
      toast.success('Category Deleted', {
        description: 'Category removed successfully.',
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error('Delete Failed', {
        description: err.response?.data?.message || 'Could not delete category.',
      });
    },
  });

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview(null);
    reset({
      name: '',
      description: '',
      image: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setImageFile(null);
    setImagePreview(cat.image_url || cat.image || null);
    reset({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      is_active: cat.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (data) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('image', imageFile);
      formData.append('is_active', data.is_active ? '1' : '0');
      saveMutation.mutate({ id: editingCategory?.id, payload: formData });
    } else {
      const payload = {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        is_active: data.is_active,
      };
      saveMutation.mutate({ id: editingCategory?.id, payload });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50 min-h-screen">
      {/* Navigation Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-slate-200">
        <Link
          href="/admin/dashboard"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Products
        </Link>
        <Link
          href="/admin/categories"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
        >
          Categories (Dynamic)
        </Link>
        <Link
          href="/admin/shops"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Shops
        </Link>
        <Link
          href="/admin/users"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Users
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono uppercase tracking-wide mb-1.5">
            <FolderTree className="w-3 h-3 text-blue-700" />
            <span>Database Category Registry</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dynamic Categories Table</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage dynamic categories shown on storefront (Browse The Range) with Laravel 13 optimized images.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-subtle flex items-center space-x-1.5 transition-all active:scale-[0.99]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-6 shadow-subtle flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {filteredCategories.length} categories
        </span>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No categories found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Products</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                      {cat.image_url || cat.image ? (
                        <img
                          src={cat.image_url || cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{cat.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{cat.slug}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{cat.description || '—'}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                      {cat.products_count ?? 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        cat.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Create or Edit Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Dynamic Category'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              placeholder="e.g. Dining, Living, Bedroom, Outdoor..."
            />
            {errors.name && (
              <span className="text-[11px] text-rose-600 mt-1">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              {...register('description')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              placeholder="Curated collections for modern homes..."
            />
          </div>

          {/* Image Upload with Laravel 13 Optimization */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category Image (Optimized to WebP automatically)
            </label>
            <div className="flex items-center gap-3">
              {imagePreview && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Laravel 13 automatically optimizes and converts uploaded images to WebP.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="cat_active"
              {...register('is_active')}
              className="rounded text-slate-900"
            />
            <label htmlFor="cat_active" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Active & Visible on Customer Storefront
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold shadow-subtle"
            >
              {saveMutation.isPending ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
