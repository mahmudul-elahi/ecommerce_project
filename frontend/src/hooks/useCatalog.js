'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { catalogService } from '../api/services/catalogService';

/**
 * Query hook for shared product catalog
 */
export function useCatalogQuery(filters = {}) {
  const { search, category, status } = filters;
  return useQuery({
    queryKey: queryKeys.catalog.list({ search, category, status }),
    queryFn: () =>
      catalogService.getCatalog({
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        per_page: 50,
      }),
  });
}

/**
 * Mutation hook to add a product from catalog to merchant's shop
 */
export function useAddToShopMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => catalogService.addToShop(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}

/**
 * Mutation hook to create and share a new product in the catalog
 */
export function useCreateCatalogProductMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => catalogService.createAndShare(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: options.onError,
  });
}
