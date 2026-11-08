'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { shopsService } from '../api/services/shopsService';

/**
 * Query hook to fetch public merchant stores
 */
export function useShopsQuery(search = '') {
  return useQuery({
    queryKey: queryKeys.shops.list(search),
    queryFn: () => shopsService.getShops({ search: search || undefined }),
  });
}

/**
 * Query hook to fetch a specific shop profile
 */
export function useShopDetailQuery(slugOrId) {
  return useQuery({
    queryKey: queryKeys.shops.detail(slugOrId),
    queryFn: () => shopsService.getShopDetail(slugOrId),
    enabled: !!slugOrId,
  });
}

/**
 * Query hook to fetch products in a specific storefront
 */
export function useShopProductsQuery(slugOrId, filters = {}) {
  const { search, category, sort } = filters;
  return useQuery({
    queryKey: queryKeys.shops.products(slugOrId, { search, category, sort }),
    queryFn: () =>
      shopsService.getShopProducts(slugOrId, {
        search: search || undefined,
        category: category || undefined,
        sort: sort || undefined,
      }),
    enabled: !!slugOrId,
  });
}

/**
 * Mutation hook for customer checkout
 */
export function useCheckoutMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => shopsService.checkout(payload),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant shop products to reflect decremented stock
      queryClient.invalidateQueries({ queryKey: queryKeys.shops.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}
