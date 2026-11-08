import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  Check,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  ArrowRight,
  Filter,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

export default function CatalogBrowse() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '', 'available', 'added'

  // Add To Shop Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null);
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    custom_price: '',
    custom_title: '',
    custom_description: '',
    custom_thumbnail: '',
    stock: 100,
  });

  // Create New Product Modal (Enters shared catalog + adds to shop)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    base_price: '',
    thumbnail: '',
    custom_price: '',
    stock: 100,
  });

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shop-owner/catalog', {
        params: {
          search: search || undefined,
          category: category || undefined,
          status: statusFilter || undefined,
          per_page: 50,
        },
      });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load shared product catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalog();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, statusFilter]);

  const handleOpenAddModal = (product) => {
    setProductToAdd(product);
    setAddForm({
      custom_price: '',
      custom_title: '',
      custom_description: '',
      custom_thumbnail: '',
      stock: 100,
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!productToAdd) return;

    try {
      setSubmittingAdd(true);
      const payload = {
        product_id: productToAdd.id,
        custom_price: addForm.custom_price ? parseFloat(addForm.custom_price) : null,
        custom_title: addForm.custom_title || null,
        custom_description: addForm.custom_description || null,
        custom_thumbnail: addForm.custom_thumbnail || null,
        stock: parseInt(addForm.stock || 100, 10),
      };

      await api.post('/shop-owner/catalog/add-to-shop', payload);
      addToast(`Added "${productToAdd.name}" to your store!`, 'success');
      setIsAddModalOpen(false);
      fetchCatalog();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to add product to shop', 'error');
    } finally {
      setSubmittingAdd(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.base_price) {
      addToast('Name and base price are required', 'error');
      return;
    }

    try {
      setSubmittingCreate(true);
      const payload = {
        ...createForm,
        base_price: parseFloat(createForm.base_price),
        custom_price: createForm.custom_price ? parseFloat(createForm.custom_price) : null,
        stock: parseInt(createForm.stock || 100, 10),
      };

      await api.post('/shop-owner/catalog/create', payload);
      addToast('Product created and added to shared catalog and your shop!', 'success');
      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        sku: '',
        category: '',
        description: '',
        base_price: '',
        thumbnail: '',
        custom_price: '',
        stock: 100,
      });
      fetchCatalog();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to create product', 'error');
    } finally {
      setSubmittingCreate(false);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Shared Product Catalog</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Browse & Add Shared Products</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Select products created by admins or fellow shop owners to sell in your shop, or create your own products to share globally.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto text-xs">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              statusFilter === '' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              statusFilter === 'available' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available to Add
          </button>
          <button
            onClick={() => setStatusFilter('added')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              statusFilter === 'added' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Already in My Shop
          </button>
        </div>

        {/* Search & Category */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shared catalog..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
              <div className="h-44 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or create a new product above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                item.is_in_my_shop ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={item.thumbnail_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                  }}
                />

                {/* Creator Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                      item.is_created_by_me
                        ? 'bg-purple-600 text-white'
                        : item.creator?.role === 'admin'
                        ? 'bg-slate-900/80 backdrop-blur-sm text-white'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    {item.is_created_by_me
                      ? 'Created by You'
                      : item.creator?.role === 'admin'
                      ? 'Admin Product'
                      : `Shared by ${item.creator?.name || 'Owner'}`}
                  </span>
                </div>

                {/* In My Shop Badge */}
                {item.is_in_my_shop && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>In Your Shop</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400 mb-1">
                    {item.category && <span className="text-emerald-700 uppercase tracking-wider">{item.category}</span>}
                    {item.sku && <span>• SKU: {item.sku}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description || 'Global shared catalog product.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Catalog Base:</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ${Number(item.base_price).toFixed(2)}
                    </span>
                  </div>

                  {item.is_in_my_shop ? (
                    <Link
                      to="/shop-owner/products"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors flex items-center space-x-1"
                    >
                      <span>Edit Listing</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleOpenAddModal(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center space-x-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to My Shop</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Product to My Shop with optional customizations */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add to My Shop: ${productToAdd?.name || ''}`}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
            Catalog Base Price: <span className="font-bold text-slate-900">${Number(productToAdd?.base_price || 0).toFixed(2)}</span>.
            You can customize the price, title, and thumbnail for your store below, or leave them empty to inherit catalog defaults.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Shop Price ($) (Optional override)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={addForm.custom_price}
                onChange={(e) => setAddForm({ ...addForm, custom_price: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={`Leave empty for default ($${Number(productToAdd?.base_price || 0).toFixed(2)})`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Stock Count <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={addForm.stock}
                onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Title for Your Store (Optional override)
            </label>
            <input
              type="text"
              value={addForm.custom_title}
              onChange={(e) => setAddForm({ ...addForm, custom_title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder={productToAdd?.name || 'Leave blank to use catalog title'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Description for Your Store (Optional override)
            </label>
            <textarea
              rows={2}
              value={addForm.custom_description}
              onChange={(e) => setAddForm({ ...addForm, custom_description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Store-specific notes, warranty, or promotion..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Thumbnail Image URL (Optional override)
            </label>
            <input
              type="text"
              value={addForm.custom_thumbnail}
              onChange={(e) => setAddForm({ ...addForm, custom_thumbnail: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Leave blank to use shared catalog thumbnail"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingAdd}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors shadow-sm flex items-center space-x-1.5"
            >
              {submittingAdd ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Add to My Shop</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create New Product (Shared Catalog + Added to My Shop) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Product for Shared Catalog & My Shop"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs text-sky-800 leading-relaxed">
            <span className="font-bold">Shared Catalog Architecture:</span> Any product you create here will automatically be listed in your shop and also shared to the global catalog so other shop owners can list it.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Ultra Slim MagSafe Battery Pack"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shared Catalog Base Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={createForm.base_price}
                onChange={(e) => setCreateForm({ ...createForm, base_price: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="49.99"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Store Price ($) (Optional initial override)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={createForm.custom_price}
                onChange={(e) => setCreateForm({ ...createForm, custom_price: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Leave blank to use base price"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Electronics, Apparel, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SKU / Code</label>
              <input
                type="text"
                value={createForm.sku}
                onChange={(e) => setCreateForm({ ...createForm, sku: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                placeholder="PROD-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail Image URL</label>
            <input
              type="text"
              value={createForm.thumbnail}
              onChange={(e) => setCreateForm({ ...createForm, thumbnail: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Product details, specs, and highlights..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock Count</label>
            <input
              type="number"
              min="0"
              value={createForm.stock}
              onChange={(e) => setCreateForm({ ...createForm, stock: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="100"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingCreate}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors shadow-sm flex items-center space-x-1.5"
            >
              {submittingCreate ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              <span>Create & Add to Store</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
