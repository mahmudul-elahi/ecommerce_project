import api from '../client';

export const shopOwnerService = {
  /**
   * Get shop owner dashboard summary metrics & recent orders
   */
  async getDashboard() {
    const res = await api.get('/shop-owner/dashboard');
    return res.data;
  },

  /**
   * Get current authenticated user's shop profile
   */
  async getMyShop() {
    const res = await api.get('/shop-owner/my-shop');
    return res.data?.shop || null;
  },

  /**
   * Update shop profile settings
   */
  async updateMyShop(payload) {
    const res = await api.put('/shop-owner/my-shop', payload);
    return res.data;
  },

  /**
   * Get products currently listed in merchant's shop
   */
  async getProducts(params = {}) {
    const res = await api.get('/shop-owner/products', { params });
    return res.data?.data || [];
  },

  /**
   * Update customizations for a shop listing
   */
  async updateProduct(id, payload) {
    const res = await api.put(`/shop-owner/products/${id}`, payload);
    return res.data;
  },

  /**
   * Reset customizations back to shared catalog defaults
   */
  async resetProductToCatalog(id) {
    const res = await api.put(`/shop-owner/products/${id}`, { reset_to_catalog: true });
    return res.data;
  },

  /**
   * Remove a product from merchant's shop (remains in catalog)
   */
  async removeProduct(id) {
    const res = await api.delete(`/shop-owner/products/${id}`);
    return res.data;
  },

  /**
   * Get customer orders for merchant's shop
   */
  async getOrders(params = {}) {
    const res = await api.get('/shop-owner/orders', { params });
    return res.data?.data || [];
  },

  /**
   * Update fulfillment status of an order
   */
  async updateOrderStatus(orderId, status) {
    const res = await api.put(`/shop-owner/orders/${orderId}/status`, { status });
    return res.data;
  },
};

export default shopOwnerService;
