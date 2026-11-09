'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import Modal from '../../../components/common/Modal';
import DashFileUpload from '../../../components/dashboard/DashFileUpload';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useAdminShopsQuery,
  useAdminOwnersQuery,
  useSaveAdminShopMutation,
  useDeleteAdminShopMutation,
} from '../../../hooks/useAdmin';

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
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoCleared, setLogoCleared] = useState(false);
  const [bannerCleared, setBannerCleared] = useState(false);

  // TanStack Query: Shops & Owners via custom hooks
  const {
    data: shops = [],
    isLoading: loadingShops,
    isError,
  } = useAdminShopsQuery(debouncedSearch);

  const { data: owners = [] } = useAdminOwnersQuery();

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

  // Mutations via custom hooks
  const saveMutation = useSaveAdminShopMutation({
    onSuccess: () => {
      setIsModalOpen(false);
      toast.success(editingShop ? 'Shop Updated Successfully' : 'Shop Created Successfully');
    },
    onError: (err) => {
      toast.error('Failed to save shop', {
        description: err.response?.data?.message || 'Please check your inputs and try again.',
      });
    },
  });

  const deleteMutation = useDeleteAdminShopMutation({
    onSuccess: () => {
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
    setLogoFile(null);
    setBannerFile(null);
    setLogoCleared(false);
    setBannerCleared(false);
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
    setLogoFile(null);
    setBannerFile(null);
    setLogoCleared(false);
    setBannerCleared(false);
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
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.user_id) formData.append('user_id', data.user_id);
    if (data.description) formData.append('description', data.description);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.address) formData.append('address', data.address);
    formData.append('status', data.status);

    if (logoFile) {
      formData.append('logo', logoFile);
    } else if (logoCleared) {
      formData.append('remove_logo', '1');
    }

    if (bannerFile) {
      formData.append('banner', bannerFile);
    } else if (bannerCleared) {
      formData.append('remove_banner', '1');
    }

    saveMutation.mutate({ id: editingShop?.id, payload: formData });
  };

  return (
    <div className="space-y-6">
      {/* BankDash Header Action Bar */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores by name or email..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-full border-0 outline-none focus:ring-1 focus:ring-[#B88E2F]/40"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#718EBF]">
            Total Stores: <strong className="text-[#343C6A]">{shops.length}</strong>
          </span>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 border-0 outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Store</span>
          </button>
        </div>
      </div>

      {/* BankDash Table Container */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#343C6A]">
            <thead className="border-b border-[#E6EFF5] text-[#718EBF] text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-4 font-inter">Store / Brand</th>
                <th className="pb-4 font-inter">Shop Owner</th>
                <th className="pb-4 font-inter">Catalog Items</th>
                <th className="pb-4 font-inter">Contact Details</th>
                <th className="pb-4 font-inter">Status</th>
                <th className="pb-4 font-inter text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {loadingShops ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading stores...</span>
                  </td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-slate-400">
                    <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-700 text-sm">No shops found</div>
                    <div className="text-xs text-slate-400 mt-0.5">Try a different search or create a new store.</div>
                  </td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100'}
                          alt={shop.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{shop.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">/{shop.slug}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {shop.owner ? (
                        <div>
                          <div className="font-semibold text-slate-800">{shop.owner.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{shop.owner.email}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] border border-slate-200 font-semibold">
                        {shop.products_count || 0} products
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <div>{shop.phone || 'No phone'}</div>
                      <div className="text-[11px] text-slate-400">{shop.email || 'No email'}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${
                        shop.status === 'active'
                          ? 'bg-[#FAF3EA] text-[#B88E2F] border-[#ebd9c5]'
                          : shop.status === 'inactive'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
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
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Customer Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(shop)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit Shop"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteShop(shop.id, shop.name)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Shop Name <span className="text-[#B88E2F]">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Skyline Craft Studio"
                className={`w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none transition-all ${
                  errors.name ? 'ring-2 ring-rose-400 bg-rose-50/20' : 'focus:ring-2 focus:ring-[#B88E2F]/30 focus:bg-white'
                }`}
              />
              {errors.name && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Assigned Shop Owner
              </label>
              <select
                {...register('user_id')}
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] rounded-xl border-0 outline-none font-medium cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
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
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Store Description
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Store background, mission, and specialty..."
              className="w-full p-3.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="store@domain.com"
                className={`w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none transition-all ${
                  errors.email ? 'ring-2 ring-rose-400 bg-rose-50/20' : 'focus:ring-2 focus:ring-[#B88E2F]/30 focus:bg-white'
                }`}
              />
              {errors.email && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Store Status
              </label>
              <select
                {...register('status')}
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] rounded-xl border-0 outline-none font-medium cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
              Physical Location / City
            </label>
            <input
              type="text"
              {...register('address')}
              placeholder="e.g. Austin, Texas"
              className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashFileUpload
              label="Shop Logo"
              aspect="square"
              currentUrl={logoCleared ? null : (logoFile ? URL.createObjectURL(logoFile) : editingShop?.logo_url)}
              onFileSelect={(file) => {
                setLogoFile(file);
                setLogoCleared(false);
              }}
              onRemove={() => {
                setLogoFile(null);
                setLogoCleared(true);
              }}
              helperText="Square image up to 10MB"
            />

            <DashFileUpload
              label="Shop Banner"
              aspect="banner"
              currentUrl={bannerCleared ? null : (bannerFile ? URL.createObjectURL(bannerFile) : editingShop?.banner_url)}
              onFileSelect={(file) => {
                setBannerFile(file);
                setBannerCleared(false);
              }}
              onRemove={() => {
                setBannerFile(null);
                setBannerCleared(true);
              }}
              helperText="Wide cover up to 10MB"
            />
          </div>

          <div className="pt-4 border-t border-[#F5F7FA] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-[#FAF3EA] text-xs font-semibold text-[#343C6A] hover:text-[#B88E2F] transition-colors border-0 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || saveMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] text-white text-xs font-semibold shadow-sm disabled:opacity-50 transition-all border-0 outline-none cursor-pointer"
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
