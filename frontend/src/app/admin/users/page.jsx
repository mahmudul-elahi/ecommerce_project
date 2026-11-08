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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200 mb-2">
            <Users className="w-3.5 h-3.5 text-stone-700" />
            <span className="font-mono uppercase tracking-wider">Access & Identity Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Shop Owner Accounts
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl font-normal">
            Create and supervise merchant accounts, assign stores, and manage permissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold transition-colors shadow-xs flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Shop Owner</span>
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
            placeholder="Search accounts by name or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
          />
        </div>

        <div className="text-xs font-mono text-stone-500">
          Total Accounts: <span className="font-bold text-stone-900">{users.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User / Contact</th>
                <th className="px-5 py-3.5">System Role</th>
                <th className="px-5 py-3.5">Assigned Shop</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-stone-400">
                    <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading accounts...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-stone-400">
                    <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <div className="font-semibold text-stone-700 text-sm">No accounts found</div>
                    <div className="text-xs text-stone-400 mt-0.5">Try a different search or create an account.</div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-bold text-stone-900 text-xs">{u.name}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{u.email}</div>
                        {u.phone && <div className="text-[11px] text-stone-500">{u.phone}</div>}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${
                        u.role === 'admin'
                          ? 'bg-stone-900 text-stone-50 border-stone-900'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
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
                          <Store className="w-3.5 h-3.5 text-stone-500" />
                          <span className="font-semibold text-stone-800">{u.shop.name}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">No shop assigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${
                        u.is_active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-stone-500 font-mono text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Eleanor Vance"
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
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="eleanor@domain.com"
                className={`w-full px-3 py-2 text-xs bg-white rounded-xl border ${
                  errors.email ? 'border-rose-400' : 'border-stone-200'
                } focus:outline-none focus:ring-1 focus:ring-stone-900`}
              />
              {errors.email && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password {editingUser && '(Leave blank to keep current)'}
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                System Role
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="shop_owner">Shop Owner</option>
                <option value="admin">Platform Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Assign Existing Shop
              </label>
              <select
                {...register('shop_id')}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="">No existing shop (or create new below)</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!editingUser && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Or Create Initial Store for this Merchant
              </label>
              <input
                type="text"
                {...register('shop_name')}
                placeholder="e.g. Eleanor's Curated Living"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                If specified, a brand new storefront will be automatically created and assigned.
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active_user"
              {...register('is_active')}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
            />
            <label htmlFor="is_active_user" className="text-xs font-medium text-stone-700">
              Account Active & Permitted to Sign In
            </label>
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
