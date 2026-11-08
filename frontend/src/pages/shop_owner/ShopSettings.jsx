import React, { useState, useEffect } from 'react';
import { Store, Save, ExternalLink } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function ShopSettings() {
  const { addToast } = useToast();
  const { updateUserShop } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    logo: '',
    banner: '',
    slug: '',
  });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const res = await api.get('/shop-owner/my-shop');
        const s = res.data.shop;
        setFormData({
          name: s.name || '',
          description: s.description || '',
          phone: s.phone || '',
          email: s.email || '',
          address: s.address || '',
          logo: s.logo_url || '',
          banner: s.banner_url || '',
          slug: s.slug || '',
        });
      } catch (err) {
        console.error(err);
        addToast('Failed to load store settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put('/shop-owner/my-shop', formData);
      updateUserShop(res.data.shop);
      addToast('Store settings updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update store', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Store className="w-6 h-6 text-emerald-600" />
            <span>Store Settings & Branding</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize your store identity, contact info, logo, and banner shown to customers.
          </p>
        </div>

        {formData.slug && (
          <a
            href={`/shop/${formData.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Store Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Apex Tech Essentials"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Store Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Tell customers what your store is about..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="support@mystore.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address / City</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="123 Innovation Way, Suite 400, Austin, TX"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Logo Image URL</label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Image URL</label>
              <input
                type="text"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors shadow-sm flex items-center space-x-1.5"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Store Information</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
