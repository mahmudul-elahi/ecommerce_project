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
    <div className="space-y-6">
      {/* BankDash Filter & Action Bar */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-full border-0 outline-none focus:ring-1 focus:ring-[#B88E2F]/40"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#718EBF]">
            Total Categories: <strong className="text-[#343C6A]">{categories.length}</strong>
          </span>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 border-0 outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* BankDash Categories Table Container */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#343C6A]">
            <thead className="border-b border-[#E6EFF5] text-[#718EBF] text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-4 font-inter">Category</th>
                <th className="pb-4 font-inter">Slug</th>
                <th className="pb-4 font-inter">Description</th>
                <th className="pb-4 font-inter">Storefront (Browse The Range)</th>
                <th className="pb-4 font-inter">Status</th>
                <th className="pb-4 font-inter text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#718EBF]">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#718EBF]">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
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
                        className="p-1.5 text-slate-500 hover:text-[#B88E2F] hover:bg-slate-100 rounded-md"
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
                ))
              )}
            </tbody>
          </table>
        </div>
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
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Category Name <span className="text-[#B88E2F]">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
              placeholder="e.g. Dining, Living, Bedroom, Outdoor..."
            />
            {errors.name && (
              <span className="text-[11px] text-rose-600 mt-1 block">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">Description</label>
            <textarea
              rows={2}
              {...register('description')}
              className="w-full p-3.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all resize-none"
              placeholder="Curated collections for modern homes..."
            />
          </div>

          {/* Image Upload with Laravel 13 Optimization */}
          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Category Image (Optimized to WebP automatically)
            </label>
            <div className="flex items-center gap-3">
              {imagePreview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-xs">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FAF3EA] file:text-[#B88E2F] hover:file:bg-[#F4E8D3] cursor-pointer"
                />
                <p className="text-[10px] text-[#718EBF] mt-1">
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
              className="rounded-md border-0 text-[#B88E2F] focus:ring-[#B88E2F]"
            />
            <label htmlFor="cat_active" className="text-xs font-semibold text-[#343C6A] cursor-pointer">
              Active & Visible on Customer Storefront
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
              {saveMutation.isPending ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
