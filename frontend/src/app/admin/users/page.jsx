'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Store,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useAdminUsersQuery,
  useAdminShopsLookupQuery,
  useSaveAdminUserMutation,
  useDeleteAdminUserMutation,
} from '../../../hooks/useAdmin';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['shop_owner', 'admin']).default('shop_owner'),
  shop_id: z.string().optional(),
  shop_name: z.string().optional(),
  is_active: z.boolean().default(true),
});

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // TanStack Query: Users & Shops lookup via custom hooks
  const {
    data: users = [],
    isLoading,
    isError,
  } = useAdminUsersQuery(debouncedSearch);

  const { data: shops = [] } = useAdminShopsLookupQuery();

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'shop_owner',
      shop_id: '',
      shop_name: '',
      is_active: true,
    },
  });

  // Mutations via custom hooks
  const saveMutation = useSaveAdminUserMutation({
    onSuccess: () => {
      setIsModalOpen(false);
      toast.success(
        editingUser
          ? 'Account Updated Successfully'
          : 'Shop Owner Account Created Successfully'
      );
    },
    onError: (err) => {
      toast.error('Failed to save user', {
        description: err.response?.data?.message || 'Please check inputs and try again.',
      });
    },
  });

  const deleteMutation = useDeleteAdminUserMutation({
    onSuccess: () => {
      toast.success('User account removed');
    },
    onError: (err) => {
      toast.error('Failed to delete user', {
        description: err.response?.data?.message || 'Could not delete user account.',
      });
    },
  });

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    reset({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'shop_owner',
      shop_id: '',
      shop_name: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    reset({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      role: user.role || 'shop_owner',
      shop_id: user.shop?.id ? String(user.shop.id) : '',
      shop_name: '',
      is_active: user.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const onFormSubmit = (data) => {
    if (!editingUser && !data.password) {
      toast.error('Password is required for new accounts');
      return;
    }
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      shop_id: data.shop_id ? parseInt(data.shop_id, 10) : null,
      shop_name: data.shop_name || null,
      is_active: data.is_active,
    };

    if (data.password) {
      payload.password = data.password;
    }

    saveMutation.mutate({ id: editingUser?.id, payload });
  };

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
            placeholder="Search accounts by name or email..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-full border-0 outline-none focus:ring-1 focus:ring-[#B88E2F]/40"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#718EBF]">
            Total Accounts: <strong className="text-[#343C6A]">{users.length}</strong>
          </span>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#B88E2F] hover:bg-[#967125] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 border-0 outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Merchant Account</span>
          </button>
        </div>
      </div>

      {/* BankDash Users Table Container */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#343C6A]">
            <thead className="border-b border-[#E6EFF5] text-[#718EBF] text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-4 font-inter">User / Contact</th>
                <th className="pb-4 font-inter">System Role</th>
                <th className="pb-4 font-inter">Assigned Shop</th>
                <th className="pb-4 font-inter">Status</th>
                <th className="pb-4 font-inter">Registered</th>
                <th className="pb-4 font-inter text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading accounts...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-700 text-sm">No accounts found</div>
                    <div className="text-xs text-slate-400 mt-0.5">Try a different search or create an account.</div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        {u.phone && <div className="text-[11px] text-slate-500">{u.phone}</div>}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${
                        u.role === 'admin'
                          ? 'bg-[#B88E2F] text-white border-[#B88E2F]'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {u.role === 'admin' ? (
                          <>
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            <span>Administrator</span>
                          </>
                        ) : (
                          <>
                            <Store className="w-3 h-3 mr-1" />
                            <span>Shop Owner</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {u.shop ? (
                        <div className="flex items-center space-x-2">
                          <Store className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-semibold text-slate-800">{u.shop.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No shop assigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${
                        u.is_active
                          ? 'bg-[#FAF3EA] text-[#B88E2F] border-[#ebd9c5]'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                      {u.created_at ? u.created_at.slice(0, 10) : '—'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete User"
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

      {/* Modal: Create/Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit Account: ${editingUser.name}` : 'Provision New Shop Owner Account'}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Full Name <span className="text-[#B88E2F]">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Eleanor Vance"
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
                Email Address <span className="text-[#B88E2F]">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="eleanor@domain.com"
                className={`w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none transition-all ${
                  errors.email ? 'ring-2 ring-rose-400 bg-rose-50/20' : 'focus:ring-2 focus:ring-[#B88E2F]/30 focus:bg-white'
                }`}
              />
              {errors.email && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Password {editingUser && '(Leave blank to keep current)'}
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                System Role
              </label>
              <div className="relative">
                <select
                  {...register('role')}
                  className="w-full h-11 px-4 pr-10 text-sm bg-[#F5F7FA] text-[#343C6A] rounded-xl border-0 outline-none font-medium cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all appearance-none"
                >
                  <option value="shop_owner">Shop Owner</option>
                  <option value="admin">Platform Administrator</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#718EBF] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Assign Existing Shop
              </label>
              <div className="relative">
                <select
                  {...register('shop_id')}
                  className="w-full h-11 px-4 pr-10 text-sm bg-[#F5F7FA] text-[#343C6A] rounded-xl border-0 outline-none font-medium cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all appearance-none"
                >
                  <option value="">No existing shop (or create new below)</option>
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#718EBF] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {!editingUser && (
            <div>
              <label className="block text-xs font-semibold text-[#343C6A] mb-1.5">
                Or Create Initial Store for this Merchant
              </label>
              <input
                type="text"
                {...register('shop_name')}
                placeholder="e.g. Eleanor's Curated Living"
                className="w-full h-11 px-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 transition-all"
              />
              <span className="text-[10px] text-[#718EBF] mt-1 block">
                If specified, a brand new storefront will be automatically created and assigned.
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active_user"
              {...register('is_active')}
              className="rounded-md border-0 text-[#B88E2F] focus:ring-[#B88E2F]"
            />
            <label htmlFor="is_active_user" className="text-xs font-semibold text-[#343C6A] cursor-pointer">
              Account Active & Permitted to Sign In
            </label>
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
                : editingUser
                ? 'Update Account'
                : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
