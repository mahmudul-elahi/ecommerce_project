import api from '../client';

export const catalogService = {
  /**
   * Fetch shared catalog items
   */
  async getCatalog(params = {}) {
    const res = await api.get('/shop-owner/catalog', { params });
    return res.data?.data || [];
  },

  /**
   * Add a product from shared catalog to shop
   */
  async addToShop(payload) {
    const res = await api.post('/shop-owner/catalog/add-to-shop', payload);
    return res.data;
  },

  /**
   * Create a new product in shared catalog & add to shop
   */
  async createAndShare(payload) {
    const isFormData = payload instanceof FormData;
    const res = await api.post('/shop-owner/catalog/create', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },
};

export default catalogService;
