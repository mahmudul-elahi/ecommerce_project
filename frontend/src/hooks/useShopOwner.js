'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { shopOwnerService } from '../api/services/shopOwnerService';

export function useShopOwnerDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.shopOwner.dashboard,
    queryFn: () => shopOwnerService.getDashboard(),
  });
}

export function useMyShopQuery() {
  return useQuery({
    queryKey: queryKeys.shopOwner.myShop,
    queryFn: () => shopOwnerService.getMyShop(),
  });
}

export function useUpdateMyShopMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => shopOwnerService.updateMyShop(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shopOwner.myShop });
      queryClient.invalidateQueries({ queryKey: queryKeys.shopOwner.settings });
      queryClient.invalidateQueries({ queryKey: queryKeys.shops.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useShopOwnerProductsQuery(search = '') {
  return useQuery({
    queryKey: queryKeys.shopOwner.products(search),
    queryFn: () => shopOwnerService.getProducts({ search: search || undefined, per_page: 50 }),
  });
}

export function useUpdateShopProductMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => shopOwnerService.updateProduct(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.shops.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useResetShopProductMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => shopOwnerService.resetProductToCatalog(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.shops.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useRemoveShopProductMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => shopOwnerService.removeProduct(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.shops.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

export function useShopOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.shopOwner.orders,
    queryFn: () => shopOwnerService.getOrders({ per_page: 50 }),
  });
}

export function useUpdateOrderStatusMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => shopOwnerService.updateOrderStatus(orderId, status),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shopOwner.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.shopOwner.dashboard });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}
