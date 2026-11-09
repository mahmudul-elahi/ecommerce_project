import api from '../client';

export const shopsService = {
  /**
   * Fetch all active merchant shops
   */
  async getShops(params = {}) {
    const res = await api.get('/customer/shops', { params });
    return res.data;
  },

  /**
   * Fetch all distinct categories with active products
   */
  async getCategories() {
    const res = await api.get('/customer/categories');
    return res.data;
  },

  /**
   * Fetch a specific shop profile by slug or id
   */
  async getShopDetail(slugOrId) {
    const res = await api.get(`/customer/shops/${slugOrId}`);
    return res.data;
  },

  /**
   * Fetch products assigned to a specific shop
   */
  async getShopProducts(slugOrId, params = {}) {
    const res = await api.get(`/customer/shops/${slugOrId}/products`, { params });
    return res.data?.data || [];
  },

  /**
   * Fetch product detail within a specific shop
   */
  async getShopProductDetail(slugOrId, shopProductId) {
    const res = await api.get(`/customer/shops/${slugOrId}/products/${shopProductId}`);
    return res.data;
  },

  /**
   * Fetch customer-visible products across all shops (with filters, pagination)
   */
  async getAllProducts(params = {}) {
    const res = await api.get('/customer/products', { params });
    return res.data;
  },

  /**
   * Fetch a single product detail across any active shop
   */
  async getSingleProductDetail(shopProductId) {
    const res = await api.get(`/customer/products/${shopProductId}`);
    return res.data;
  },

  /**
   * Customer checkout
   */
  async checkout(payload) {
    const res = await api.post('/customer/checkout', payload);
    return res.data;
  },
};

export default shopsService;
