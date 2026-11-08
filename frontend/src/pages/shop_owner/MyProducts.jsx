import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';

export default function MyProducts() {
  const { addToast } = useToast();
  const { shop } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customize Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    custom_price: '',
    custom_title: '',
    custom_description: '',
    custom_thumbnail: '',
    clear_custom_thumbnail: false,
    stock: 100,
    is_active: true,
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shop-owner/products', {
        params: { search: search || undefined, per_page: 50 },
      });
      setListings(res.data.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load shop listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenEditModal = (listing) => {
    setSelectedListing(listing);
    setFormData({
      custom_price: listing.custom_price !== null ? String(listing.custom_price) : '',
      custom_title: listing.custom_title || '',
      custom_description: listing.custom_description || '',
      custom_thumbnail: listing.custom_thumbnail || '',
      clear_custom_thumbnail: false,
      stock: listing.stock ?? 100,
      is_active: listing.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    if (!selectedListing) return;

    try {
      setSubmitting(true);
      const payload = {
        custom_price: formData.custom_price !== '' ? parseFloat(formData.custom_price) : null,
        custom_title: formData.custom_title || null,
        custom_description: formData.custom_description || null,
        custom_thumbnail: formData.custom_thumbnail || null,
        clear_custom_thumbnail: formData.clear_custom_thumbnail,
        stock: parseInt(formData.stock || 0, 10),
        is_active: formData.is_active,
      };

      await api.put(`/shop-owner/products/${selectedListing.id}`, payload);
      addToast('Shop product customizations updated!', 'success');
      setIsModalOpen(false);
      fetchListings();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetToCatalog = async () => {
    if (!selectedListing) return;
    if (!window.confirm('Reset all shop-specific price, title, and thumbnail customizations back to shared catalog defaults?'))
      return;

    try {
      setSubmitting(true);
      await api.put(`/shop-owner/products/${selectedListing.id}`, { reset_to_catalog: true });
      addToast('Listing restored to shared catalog defaults', 'success');
      setIsModalOpen(false);
      fetchListings();
    } catch (err) {
      console.error(err);
      addToast('Failed to reset listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveFromShop = async (id, title) => {
    if (!window.confirm(`Remove "${title}" from your store? (The product will remain safe in the shared catalog)`))
      return;

    try {
      await api.delete(`/shop-owner/products/${id}`);
      addToast(`"${title}" removed from your shop`, 'success');
      fetchListings();
    } catch (err) {
      console.error(err);
      addToast('Failed to remove product from shop', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold mb-1">
            <Package className="w-3 h-3" />
            <span>Storefront Inventory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage My Shop Listings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Override prices, details, and thumbnails exclusively for your shop. Customers only see products listed here.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {shop?.slug && (
            <Link
              to={`/shop/${shop.slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <Link
            to="/shop-owner/catalog"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add from Shared Catalog</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your listed products..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Listed in store: <span className="text-slate-900 font-bold">{listings.length}</span> products
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Product & Thumbnail</th>
                <th className="px-5 py-3.5">Store Price</th>
                <th className="px-5 py-3.5">Catalog Base Price</th>
                <th className="px-5 py-3.5">Customizations</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading your shop listings...</span>
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-700">No products assigned to your shop yet.</div>
                    <p className="text-xs text-slate-400 mt-1">Browse the shared catalog to select and list products.</p>
                    <Link
                      to="/shop-owner/catalog"
                      className="mt-3 inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:underline"
                    >
                      <span>Go to Shared Catalog →</span>
                    </Link>
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              item.effective_thumbnail_url ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
                            }
                            alt={item.effective_title}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100';
                            }}
                          />
                          {item.custom_thumbnail && (
                            <span
                              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 rounded-full border-2 border-white"
                              title="Custom store thumbnail applied"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">{item.effective_title}</div>
                          {item.custom_title && (
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              Catalog title: {item.product?.name}
                            </div>
                          )}
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            {item.product?.category || 'General'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Store Price */}
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-sm text-slate-900">
                        ${Number(item.effective_price).toFixed(2)}
                      </div>
                      {item.custom_price !== null && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                          Customized
                        </span>
                      )}
                    </td>

                    {/* Catalog Base Price */}
                    <td className="px-5 py-4 text-slate-500 font-medium">
                      ${Number(item.product?.base_price || 0).toFixed(2)}
                    </td>

                    {/* Customizations Badges */}
                    <td className="px-5 py-4">
                      {item.is_customized ? (
                        <div className="flex flex-wrap gap-1">
                          {item.custom_price !== null && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                              Price
                            </span>
                          )}
                          {item.custom_title && (
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
                              Title
                            </span>
                          )}
                          {item.custom_thumbnail && (
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                              Thumbnail
                            </span>
                          )}
                          {item.custom_description && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                              Details
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Catalog Defaults</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800">{item.stock}</span> units
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 text-xs font-semibold transition-colors flex items-center space-x-1"
                          title="Set or modify product prices, details, and thumbnails"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Customize</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFromShop(item.id, item.effective_title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove from your shop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Set or Modify Product Prices, Details, and Thumbnails */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Customize Store Listing: ${selectedListing?.product?.name || ''}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveListing} className="space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Shared Catalog Base Price:</span>{' '}
              <span className="font-bold text-emerald-700">
                ${Number(selectedListing?.product?.base_price || 0).toFixed(2)}
              </span>
            </div>
            {selectedListing?.is_customized && (
              <button
                type="button"
                onClick={handleResetToCatalog}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Catalog Defaults</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop-Specific Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.custom_price}
                onChange={(e) => setFormData({ ...formData, custom_price: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={`Default is $${Number(selectedListing?.product?.base_price || 0).toFixed(2)}`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Leave empty to inherit catalog base price.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shop-Specific Product Title (Override)
            </label>
            <input
              type="text"
              value={formData.custom_title}
              onChange={(e) => setFormData({ ...formData, custom_title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder={selectedListing?.product?.name || 'Leave empty to use catalog title'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shop-Specific Product Details / Description (Override)
            </label>
            <textarea
              rows={3}
              value={formData.custom_description}
              onChange={(e) => setFormData({ ...formData, custom_description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder={selectedListing?.product?.description || 'Custom store description, bundle notes, or warranty terms...'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shop-Specific Thumbnail Image URL (Override)
            </label>
            <input
              type="text"
              value={formData.custom_thumbnail}
              onChange={(e) => setFormData({ ...formData, custom_thumbnail: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://images.unsplash.com/..."
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Provide a custom image URL for your shop, or leave empty to use catalog image.
            </span>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active_listing"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="is_active_listing" className="text-xs text-slate-700 font-semibold cursor-pointer">
              Active in My Shop (Visible to customers visiting your storefront)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors shadow-sm flex items-center space-x-1.5"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              <span>Save Shop Customizations</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
