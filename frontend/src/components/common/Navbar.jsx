'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Store,
  Layers,
  Users,
  LayoutDashboard,
  Package,
  LogOut,
  LogIn,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  ExternalLink,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, isAdmin, isShopOwner, shop, logout, login } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out successfully');
    router.push('/');
  };

  const handleQuickLogin = async (email, password, roleLabel) => {
    try {
      setDemoMenuOpen(false);
      const loggedUser = await login(email, password);
      toast.success(`Signed in as ${roleLabel}`, {
        description: `Welcome back, ${loggedUser.name}!`,
      });
      if (email === 'admin@ecommerce.com') {
        router.push('/admin/dashboard');
      } else {
        router.push('/shop-owner/dashboard');
      }
    } catch (err) {
      toast.error('Quick sign-in failed', {
        description: err.response?.data?.message || 'Please check credentials',
      });
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f5]/95 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-stone-800 transition-colors">
                <Store className="w-4.5 h-4.5 text-stone-100" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-base text-stone-900 tracking-tight font-sans">
                    OmniShop
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                    Shared Catalog
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
                  Multi-Store Engine
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-stone-900 text-stone-50 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Explore Stores
              </Link>

              {/* Admin Links */}
              {isAdmin && (
                <>
                  <div className="h-4 w-[1px] bg-stone-200 mx-1.5" />
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/dashboard')
                        ? 'bg-stone-900 text-stone-50 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Overview</span>
                  </Link>
                  <Link
                    href="/admin/shops"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/shops')
                        ? 'bg-stone-900 text-stone-50 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Manage Shops</span>
                  </Link>
                  <Link
                    href="/admin/products"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/products')
                        ? 'bg-stone-900 text-stone-50 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Shared Catalog</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/users')
                        ? 'bg-stone-900 text-stone-50 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Shop Owners</span>
                  </Link>
                </>
              )}

              {/* Shop Owner Links */}
              {isShopOwner && (
                <>
                  <div className="h-4 w-[1px] bg-stone-200 mx-1.5" />
                  <Link
                    href="/shop-owner/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/dashboard')
                        ? 'bg-stone-900 text-stone-50 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Merchant Hub</span>
                  </Link>
                  <Link
                    href="/shop-owner/catalog"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/catalog')
                        ? 'bg-stone-900 text-stone-50 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Browse Catalog</span>
                  </Link>
                  <Link
                    href="/shop-owner/products"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/products')
                        ? 'bg-stone-900 text-stone-50 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>My Listings</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-medium transition-colors shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Demo Profiles</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {demoMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDemoMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                      Switch Role for Testing
                    </div>
                    <div className="p-1 space-y-1">
                      <button
                        onClick={() =>
                          handleQuickLogin('admin@ecommerce.com', 'password', 'System Admin')
                        }
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200 group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">Administrator</div>
                          <div className="text-[11px] text-stone-500">Manage all shops & shared catalog</div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          handleQuickLogin('sarah@apex.com', 'password', 'Sarah (Apex Goods)')
                        }
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">Apex Goods (Owner)</div>
                          <div className="text-[11px] text-stone-500">Electronics & audio curation</div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          handleQuickLogin('marcus@haven.com', 'password', 'Marcus (Haven Studio)')
                        }
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">Haven Studio (Owner)</div>
                          <div className="text-[11px] text-stone-500">Home & lifestyle artisan goods</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200 bg-white shadow-xs"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-stone-900 text-stone-50 text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Session Profile / Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-stone-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    {user.role === 'admin' ? 'Administrator' : shop?.name || 'Shop Owner'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200 bg-white"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Open Store
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
