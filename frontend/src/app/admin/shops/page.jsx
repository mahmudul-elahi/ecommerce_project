'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Store,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  User,
  Phone,
  Mail,
  AlertCircle,
  Building2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import api from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import Modal from '../../../components/common/Modal';

const shopSchema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters'),
  user_id: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  logo: z.string().optional(),
  banner: z.string().optional(),
});

export default function ShopManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  // TanStack Query: Shops
  const {
    data: shops = [],
    isLoading: loadingShops,
    isError,
  } = useQuery({
    queryKey: queryKeys.admin.shops(search),
    queryFn: async () => {
      const res = await api.get('/admin/shops', {
        params: { search: search || undefined, per_page: 50 },
      });
      return res.data.data || [];
    },
  });

  // TanStack Query: Shop Owners
  const { data: owners = [] } = useQuery({
    queryKey: ['admin-owners'],
    queryFn: async () => {
      const res = await api.get('/admin/users', {
        params: { role: 'shop_owner', per_page: 100 },
      });
      return res.data.data || [];
    },
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: '',
      user_id: '',
      description: '',
      phone: '',
      email: '',
      address: '',
      status: 'active',
      logo: '',
      banner: '',
    },
  });

  // Mutation: Save Shop (Create or Update)
  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        name: formData.name,
        user_id: formData.user_id ? parseInt(formData.user_id, 10) : null,
        description: formData.description || null,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        status: formData.status,
        logo: formData.logo || null,
        banner: formData.banner || null,
      };

      if (editingShop) {
        return (await api.put(`/admin/shops/${editingShop.id}`, payload)).data;
      } else {
        return (await api.post('/admin/shops', payload)).data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      setIsModalOpen(false);
      toast.success(editingShop ? 'Shop Updated Successfully' : 'Shop Created Successfully');
    },
    onError: (err) => {
      toast.error('Failed to save shop', {
        description: err.response?.data?.message || 'Please check your inputs and try again.',
      });
    },
  });

  // Mutation: Delete Shop
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/shops/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast.success('Shop deleted successfully');
    },
    onError: (err) => {
      toast.error('Failed to delete shop', {
        description: err.response?.data?.message || 'Could not delete shop.',
      });
    },
  });

  const handleOpenCreateModal = () => {
    setEditingShop(null);
    reset({
      name: '',
      user_id: '',
      description: '',
      phone: '',
      email: '',
      address: '',
      status: 'active',
      logo: '',
      banner: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (shop) => {
    setEditingShop(shop);
    reset({
      name: shop.name || '',
      user_id: shop.user_id ? String(shop.user_id) : '',
      description: shop.description || '',
      phone: shop.phone || '',
      email: shop.email || '',
      address: shop.address || '',
      status: shop.status || 'active',
      logo: shop.logo_url || '',
      banner: shop.banner_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteShop = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const onFormSubmit = (data) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200 mb-2">
            <Store className="w-3.5 h-3.5 text-stone-700" />
            <span className="font-mono uppercase tracking-wider">Multi-Tenant Store Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Manage Shops & Storefronts
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl font-normal">
            Create new merchant stores, configure assignments to registered shop owners, or update storefront branding.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold transition-colors shadow-xs flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Shop</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores by name, city, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
          />
        </div>

        <div className="text-xs font-mono text-stone-500">
          Total Stores: <span className="font-bold text-stone-900">{shops.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Store / Brand</th>
                <th className="px-5 py-3.5">Shop Owner</th>
                <th className="px-5 py-3.5">Catalog Items</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loadingShops ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-stone-400">
                    <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading stores...</span>
                  </td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-stone-400">
                    <Store className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <div className="font-semibold text-stone-700 text-sm">No shops found</div>
                    <div className="text-xs text-stone-400 mt-0.5">Try a different search or create a new store.</div>
                  </td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100'}
                          alt={shop.name}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 bg-stone-50"
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-xs">{shop.name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">/{shop.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {shop.owner ? (
                        <div>
                          <div className="font-semibold text-stone-800">{shop.owner.name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{shop.owner.email}</div>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] border border-stone-200 font-semibold">
                        {shop.products_count || 0} products
                      </span>
                    </td>

                    <td className="px-5 py-4 text-stone-600">
                      <div>{shop.phone || 'No phone'}</div>
                      <div className="text-[11px] text-stone-400">{shop.email || 'No email'}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${
                        shop.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : shop.status === 'inactive'
                          ? 'bg-stone-100 text-stone-600 border-stone-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {shop.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/shop/${shop.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="View Customer Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(shop)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Edit Shop"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteShop(shop.id, shop.name)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Shop"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: Create/Edit Shop */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShop ? `Edit Shop: ${editingShop.name}` : 'Create New Merchant Store'}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Shop Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Skyline Craft Studio"
                className={`w-full px-3 py-2 text-xs bg-white rounded-xl border ${
                  errors.name ? 'border-rose-400' : 'border-stone-200'
                } focus:outline-none focus:ring-1 focus:ring-stone-900`}
              />
              {errors.name && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Assigned Shop Owner
              </label>
              <select
                {...register('user_id')}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="">Select an owner (optional)</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Description
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Store background, mission, and specialty..."
              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="store@domain.com"
                className={`w-full px-3 py-2 text-xs bg-white rounded-xl border ${
                  errors.email ? 'border-rose-400' : 'border-stone-200'
                } focus:outline-none focus:ring-1 focus:ring-stone-900`}
              />
              {errors.email && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Physical Location / City
            </label>
            <input
              type="text"
              {...register('address')}
              placeholder="e.g. Austin, Texas"
              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                {...register('logo')}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Banner URL
              </label>
              <input
                type="url"
                {...register('banner')}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {isSubmitting || saveMutation.isPending
                ? 'Saving...'
                : editingShop
                ? 'Update Shop'
                : 'Create Shop'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
