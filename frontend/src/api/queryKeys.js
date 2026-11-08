/**
 * TanStack React Query Key Factory
 * Centralized key definitions for type safety, predictable invalidation, and deduplication.
 */
export const queryKeys = {
  shops: {
    all: ['shops'],
    list: (search) => ['shops', { search: search || '' }],
    detail: (slug) => ['shop', slug],
    products: (slug, filters = {}) => ['shop-products', slug, filters],
  },
  catalog: {
    all: ['shared-catalog'],
    list: (filters = {}) => ['shared-catalog', filters],
  },
  shopOwner: {
    dashboard: ['shop-owner-dashboard'],
    myShop: ['shop-owner-my-shop'],
    settings: ['shop-settings'],
    products: (search) => ['my-products', { search: search || '' }],
    orders: ['shop-orders'],
  },
  admin: {
    dashboard: ['admin-dashboard'],
    shops: (search) => ['admin-shops', { search: search || '' }],
    owners: ['admin-owners'],
    products: (filters = {}) => ['admin-products', filters],
    users: (search) => ['admin-users', { search: search || '' }],
  },
};
