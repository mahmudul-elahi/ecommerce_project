'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Layers,
  Plus,
  Search,
  Check,
  Sparkles,
  ArrowRight,
  Package,
  Store,
  DollarSign,
  Tag,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useCategoriesQuery } from '../../../hooks/useShops';
import {
  useCatalogQuery,
  useAddToShopMutation,
  useCreateCatalogProductMutation,
} from '../../../hooks/useCatalog';
import Modal from '../../../components/common/Modal';

// Schema for adding existing catalog product to own shop
const addToShopSchema = z.object({
  custom_price: z.string().optional(),
  custom_title: z.string().optional(),
  custom_description: z.string().optional(),
  custom_thumbnail: z.string().optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative').default(100),
});

// Schema for creating new product in shared catalog
const createSharedProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(2, 'SKU is required'),
  category_id: z.string().optional(),
  category: z.string().optional(),
  base_price: z.string().min(1, 'Wholesale / base price is required'),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  custom_price: z.string().optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative').default(100),
});

export default function CatalogBrowsePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  // Dynamic Categories from database
  const { data: dbCategories = [] } = useCategoriesQuery();

  // Multiple Images State for Creation
  const [createImageFiles, setCreateImageFiles] = useState([]);
  const [createImagePreviews, setCreateImagePreviews] = useState([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Clean custom query hook
  const {
    data: catalogProducts = [],
    isLoading,
    isError,
  } = useCatalogQuery({ search: debouncedSearch, category, status: statusFilter });

  // React Hook Form: Add To Shop
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    watch: watchAdd,
    formState: { errors: errorsAdd, isSubmitting: isSubmittingAdd },
  } = useForm({
    resolver: zodResolver(addToShopSchema),
    defaultValues: {
      custom_price: '',
      custom_title: '',
      custom_description: '',
      custom_thumbnail: '',
      stock: 100,
    },
  });

  // React Hook Form: Create Shared Product
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
  } = useForm({
    resolver: zodResolver(createSharedProductSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      base_price: '',
      thumbnail: '',
      description: '',
      custom_price: '',
      stock: 100,
    },
  });

  // Clean custom mutations
  const addToShopMutation = useAddToShopMutation({
    onSuccess: () => {
      setIsAddModalOpen(false);
      resetAdd();
      toast.success('Product Added to Your Storefront!', {
        description: `"${productToAdd?.name}" is now live in your shop inventory.`,
      });
    },
    onError: (err) => {
      toast.error('Failed to add product', {
        description: err.response?.data?.message || 'Could not link this catalog item.',
      });
    },
  });

  const createSharedProductMutation = useCreateCatalogProductMutation({
    onSuccess: (res) => {
      setIsCreateModalOpen(false);
      resetCreate();
      setCreateImageFiles([]);
      setCreateImagePreviews([]);
      toast.success('Shared Product Created Successfully!', {
        description: `Created "${res.product?.name}" with optimized images in shared catalog and added to your shop.`,
      });
    },
    onError: (err) => {
      toast.error('Failed to create product', {
        description: err.response?.data?.message || 'Could not register shared product.',
      });
    },
  });

  const handleOpenCreateModal = () => {
    resetCreate({
      name: '',
      sku: '',
      category_id: dbCategories[0]?.id ? String(dbCategories[0].id) : '',
      category: dbCategories[0]?.name || '',
      base_price: '',
      custom_price: '',
      stock: 100,
      description: '',
    });
    setCreateImageFiles([]);
    setCreateImagePreviews([]);
    setIsCreateModalOpen(true);
  };

  const handleCreateFilesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setCreateImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setCreateImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCreateFile = (index) => {
    setCreateImageFiles((prev) => prev.filter((_, i) => i !== index));
    setCreateImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenAddModal = (product) => {
    setProductToAdd(product);
    resetAdd({
      custom_price: '',
      custom_title: '',
      custom_description: '',
      custom_thumbnail: '',
      stock: 100,
    });
    setIsAddModalOpen(true);
  };

  const onAddSubmit = (data) => {
    if (!productToAdd) return;
    addToShopMutation.mutate({ productId: productToAdd.id, data });
  };

  const onCreateSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sku', data.sku);
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.category) formData.append('category', data.category);
    formData.append('base_price', data.base_price);
    if (data.custom_price) formData.append('custom_price', data.custom_price);
    formData.append('stock', data.stock);
    if (data.description) formData.append('description', data.description);

    createImageFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    createSharedProductMutation.mutate(formData);
  };

  const categories = Array.from(
    new Set(catalogProducts.map((p) => p.category).filter(Boolean))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 mb-2">
            <Layers className="w-3 h-3 text-slate-600" />
            <span className="font-mono uppercase tracking-wider">Universal Shared Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Browse & Curate Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-normal">
            Every product in this catalog can be added to your personal storefront. You can maintain standard catalog pricing or set custom retail pricing, custom descriptions, and your own thumbnails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/shop-owner/products"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Package className="w-4 h-4 text-slate-600" />
            <span>Manage My Listings</span>
          </Link>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-50 text-xs font-semibold transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shared Product</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shared catalog by title, SKU, or keyword..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Categories ({catalogProducts.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Listing Statuses</option>
            <option value="in_shop">Already In My Shop</option>
            <option value="available">Not Yet In My Shop</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
              <div className="h-44 bg-slate-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">Could not load catalog items</h3>
          <p className="text-xs text-slate-400 mt-1">Please refresh the page or try again.</p>
        </div>
      ) : catalogProducts.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-slate-200">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No catalog products found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new product to add to the shared catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {catalogProducts.map((product) => {
            const alreadyInShop = !!product.in_shop;
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-craft transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-slate-50 overflow-hidden border-b border-slate-100">
                    <img
                      src={product.thumbnail_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                      }}
                    />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs border border-slate-200 text-[10px] font-mono uppercase text-slate-700 shadow-xs">
                      {product.category || 'General'}
                    </span>

                    {/* Status badge */}
                    {alreadyInShop && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-blue-600 text-slate-50 text-[10px] font-mono uppercase shadow-xs flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>In Store</span>
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>SKU: {product.sku}</span>
                      <span className="text-slate-500">
                        {product.creator ? `By ${product.creator.name}` : 'Platform Item'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description || 'Shared catalog product available for store distribution.'}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Catalog Base Price
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          ${Number(product.base_price).toFixed(2)}
                        </span>
                      </div>

                      {alreadyInShop && product.shop_listing && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-mono text-slate-500 block">
                            Your Active Price
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            ${Number(product.shop_listing.custom_price || product.base_price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-4 pt-0">
                  {alreadyInShop ? (
                    <Link
                      href="/shop-owner/products"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                      <span>Customized in Store</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleOpenAddModal(product)}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-50 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to My Store</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add to Shop */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add to Store: ${productToAdd?.name || ''}`}
      >
        {productToAdd && (
          <form onSubmit={handleSubmitAdd(onAddSubmit)} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3 text-xs">
              <img
                src={productToAdd.thumbnail_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120'}
                alt={productToAdd.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              />
              <div>
                <div className="font-semibold text-slate-900">{productToAdd.name}</div>
                <div className="text-slate-500">
                  Catalog Base Wholesale Price: <span className="font-bold text-slate-900">${Number(productToAdd.base_price).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Retail Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...registerAdd('custom_price')}
                  placeholder={`Default: $${productToAdd.base_price}`}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Leave blank to use catalog base (${Number(productToAdd.base_price).toFixed(2)})
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Store Stock
                </label>
                <input
                  type="number"
                  {...registerAdd('stock')}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errorsAdd.stock && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{errorsAdd.stock.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Title (Optional)
              </label>
              <input
                type="text"
                {...registerAdd('custom_title')}
                placeholder={`Leave blank to keep "${productToAdd.name}"`}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Description (Optional)
              </label>
              <textarea
                rows={3}
                {...registerAdd('custom_description')}
                placeholder="Shop-specific promotional copy or warranty notes..."
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Storefront Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                {...registerAdd('custom_thumbnail')}
                placeholder="https://example.com/custom-photo.jpg"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingAdd || addToShopMutation.isPending}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-50 text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isSubmittingAdd || addToShopMutation.isPending ? 'Adding to Store...' : 'Confirm & Add to Store'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal: Create Shared Product */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Shared Product"
      >
        <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-900 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">One product, more places to sell:</span> New products are added to the catalog for other shop owners to discover and are listed in your shop right away.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...registerCreate('name')}
                placeholder="e.g. Minimalist Ceramic Cup"
                className={`w-full px-3 py-2 text-xs bg-white rounded-xl border ${
                  errorsCreate.name ? 'border-rose-400' : 'border-slate-200'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errorsCreate.name && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errorsCreate.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stock Keeping Unit (SKU) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...registerCreate('sku')}
                placeholder="e.g. CERAMIC-001"
                className={`w-full px-3 py-2 text-xs bg-white rounded-xl border ${
                  errorsCreate.sku ? 'border-rose-400' : 'border-slate-200'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errorsCreate.sku && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errorsCreate.sku.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category (from Database Categories) <span className="text-rose-500">*</span>
              </label>
              <select
                {...registerCreate('category_id')}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200"
              >
                <option value="">-- Select Category --</option>
                {dbCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Price (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                {...registerCreate('base_price')}
                placeholder="2500000"
                className={`w-full px-3 py-2 text-xs bg-white rounded-xl border ${
                  errorsCreate.base_price ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errorsCreate.base_price && (
                <span className="text-[10px] text-rose-500 mt-1 block">{errorsCreate.base_price.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Storefront Retail Price (Rp)
              </label>
              <input
                type="number"
                min="0"
                {...registerCreate('custom_price')}
                placeholder="Optional (defaults to base price)"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                {...registerCreate('stock')}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Multiple Product Images Upload with Laravel 13 optimization */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Product Images (Multiple angles/shots - optimized to WebP)
              </label>
              <span className="text-[11px] text-slate-400">
                {createImageFiles.length} image(s) selected
              </span>
            </div>

            {createImagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                {createImagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#B88E2F] text-white text-[8px] text-center font-bold">
                        MAIN
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCreateFile(idx)}
                      className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Click to select product images</span>
              <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP. Laravel 13 automatically optimizes each photo.</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleCreateFilesSelect}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              {...registerCreate('description')}
              placeholder="Detailed description for the shared catalog..."
              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingCreate || createSharedProductMutation.isPending}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-50 text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {isSubmittingCreate || createSharedProductMutation.isPending
                ? 'Creating Product...'
                : 'Publish to Shared Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
