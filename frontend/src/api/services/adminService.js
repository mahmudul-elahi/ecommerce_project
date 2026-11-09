import api from '../client';

export const adminService = {
  /**
   * Get administrative platform dashboard metrics
   */
  async getDashboard() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  /**
   * List all stores
   */
  async getShops(params = {}) {
    const res = await api.get('/admin/shops', { params });
    return res.data?.data || [];
  },

  /**
   * Create a new store
   */
  async createShop(payload) {
    const isFormData = payload instanceof FormData;
    const res = await api.post('/admin/shops', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  /**
   * Update an existing store
   */
  async updateShop(id, payload) {
    const isFormData = payload instanceof FormData;
    const res = isFormData
      ? await api.post(`/admin/shops/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      : await api.put(`/admin/shops/${id}`, payload);
    return res.data;
  },

  /**
   * Delete a store
   */
  async deleteShop(id) {
    const res = await api.delete(`/admin/shops/${id}`);
    return res.data;
  },

  /**
   * List all products in shared catalog
   */
  async getProducts(params = {}) {
    const res = await api.get('/admin/products', { params });
    return res.data?.data || [];
  },

  /**
   * Create a product in shared catalog
   */
  async createProduct(payload) {
    const isFormData = payload instanceof FormData;
    const res = await api.post('/admin/products', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  /**
   * Update a product in shared catalog
   */
  async updateProduct(id, payload) {
    const isFormData = payload instanceof FormData;
    if (isFormData) {
      payload.append('_method', 'PUT');
      const res = await api.post(`/admin/products/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await api.put(`/admin/products/${id}`, payload);
    return res.data;
  },

  /**
   * Delete a product from shared catalog
   */
  async deleteProduct(id) {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  /**
   * Dynamic categories management
   */
  async getCategories() {
    const res = await api.get('/admin/categories');
    return res.data || [];
  },

  async createCategory(payload) {
    const isFormData = payload instanceof FormData;
    const res = await api.post('/admin/categories', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  async updateCategory(id, payload) {
    const isFormData = payload instanceof FormData;
    if (isFormData) {
      payload.append('_method', 'PUT');
      const res = await api.post(`/admin/categories/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await api.put(`/admin/categories/${id}`, payload);
    return res.data;
  },

  async deleteCategory(id) {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  /**
   * List all users
   */
  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data?.data || [];
  },

  /**
   * Create a user account
   */
  async createUser(payload) {
    const res = await api.post('/admin/users', payload);
    return res.data;
  },

  /**
   * Update a user account
   */
  async updateUser(id, payload) {
    const res = await api.put(`/admin/users/${id}`, payload);
    return res.data;
  },

  /**
   * Delete a user account
   */
  async deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};

export default adminService;
