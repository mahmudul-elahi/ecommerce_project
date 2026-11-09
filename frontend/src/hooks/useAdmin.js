'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { adminService } from '../api/services/adminService';

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: () => adminService.getDashboard(),
  });
}

export function useAdminShopsQuery(search = '') {
  return useQuery({
    queryKey: queryKeys.admin.shops(search),
    queryFn: () => adminService.getShops({ search: search || undefined, per_page: 50 }),
  });
}

export function useAdminOwnersQuery() {
  return useQuery({
    queryKey: queryKeys.admin.owners,
    queryFn: () => adminService.getUsers({ role: 'shop_owner', per_page: 100 }),
  });
}

export function useSaveAdminShopMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => {
      return id ? adminService.updateShop(id, payload) : adminService.createShop(payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shops() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shops.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useDeleteAdminShopMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.deleteShop(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shops() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shops.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useAdminProductsQuery(filters = {}) {
  const { search, category } = filters;
  return useQuery({
    queryKey: queryKeys.admin.products({ search, category }),
    queryFn: () =>
      adminService.getProducts({
        search: search || undefined,
        category: category || undefined,
        per_page: 50,
      }),
  });
}

export function useSaveAdminProductMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => {
      return id ? adminService.updateProduct(id, payload) : adminService.createProduct(payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useDeleteAdminProductMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.deleteProduct(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useAdminUsersQuery(search = '') {
  return useQuery({
    queryKey: queryKeys.admin.users(search),
    queryFn: () => adminService.getUsers({ search: search || undefined, per_page: 50 }),
  });
}

export function useAdminShopsLookupQuery() {
  return useQuery({
    queryKey: ['admin-shops-lookup'],
    queryFn: () => adminService.getShops({ per_page: 100 }),
  });
}

export function useSaveAdminUserMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => {
      return id ? adminService.updateUser(id, payload) : adminService.createUser(payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.owners });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useDeleteAdminUserMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.deleteUser(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.owners });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: () => adminService.getCategories(),
  });
}

export function useSaveAdminCategoryMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => {
      return id ? adminService.updateCategory(id, payload) : adminService.createCategory(payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useDeleteAdminCategoryMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.deleteCategory(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}
