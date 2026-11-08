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
  Store as StoreIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function Navbar() {
  const { user, isAdmin, isShopOwner, shop, logout, login } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully', 'info');
    router.push('/');
  };

  const handleQuickLogin = async (email, password, roleLabel) => {
    try {
      setDemoMenuOpen(false);
      await login(email, password);
      addToast(`Logged in as ${roleLabel}`, 'success');
      if (email === 'admin@ecommerce.com') {
        router.push('/admin/dashboard');
      } else {
        router.push('/shop-owner/dashboard');
      }
    } catch (err) {
      addToast('Quick login failed', 'error');
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight">
                  Omni<span className="text-emerald-600">Shop</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Shared Catalog Engine
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Browse Shops
              </Link>

              {/* Admin Links */}
              {isAdmin && (
                <>
                  <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/dashboard')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/admin/shops"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/shops')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Manage Shops</span>
                  </Link>
                  <Link
                    href="/admin/products"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/products')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Catalog Products</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/users')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Shop Owners</span>
                  </Link>
                </>
              )}

              {/* Shop Owner Links */}
              {isShopOwner && (
                <>
                  <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                  <Link
                    href="/shop-owner/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/dashboard')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Store</span>
                  </Link>
                  <Link
                    href="/shop-owner/products"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/products')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>My Listed Products</span>
                  </Link>
                  <Link
                    href="/shop-owner/catalog"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/catalog')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Shared Catalog</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors"
                title="Switch demo accounts instantly"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Role:
                  </div>
                  <button
                    onClick={() => handleQuickLogin('admin@ecommerce.com', 'password', 'System Administrator')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Admin Account</div>
                      <div className="text-[10px] text-slate-400">admin@ecommerce.com</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('owner1@ecommerce.com', 'password', 'Alex (Tech Haven)')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                  >
                    <StoreIcon className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Alex (Tech Haven Owner)</div>
                      <div className="text-[10px] text-slate-400">owner1@ecommerce.com</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('owner2@ecommerce.com', 'password', 'Sophia (Urban Apparel)')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                  >
                    <StoreIcon className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Sophia (Urban Apparel)</div>
                      <div className="text-[10px] text-slate-400">owner2@ecommerce.com</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('owner3@ecommerce.com', 'password', 'Marcus (Nordic Living)')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                  >
                    <StoreIcon className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Marcus (Nordic Living)</div>
                      <div className="text-[10px] text-slate-400">owner3@ecommerce.com</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User profile / Auth buttons */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900">{user.name}</span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {isAdmin ? 'System Admin' : shop?.name || 'Shop Owner'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                >
                  Open a Shop
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
