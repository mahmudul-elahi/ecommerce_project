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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-sans font-bold text-xl text-slate-900 tracking-tight">
                    OmniShop
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Shops for every day
                </span>
              </div>
            </Link>

            {/* Main navigation */}
            <nav className="hidden md:flex items-center space-x-1.5">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                  ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Shops
              </Link>

              {/* Admin Links */}
              {isAdmin && (
                <>
                  <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                  <Link
                    href="/admin/dashboard"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/dashboard')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Hub</span>
                  </Link>
                  <Link
                    href="/admin/shops"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/shops')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Stores</span>
                  </Link>
                  <Link
                    href="/admin/products"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/products')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Catalog</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/admin/users')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Merchants</span>
                  </Link>
                </>
              )}

              {/* Shop Owner Links */}
              {isShopOwner && (
                <>
                  <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                  <Link
                    href="/shop-owner/dashboard"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/dashboard')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Merchant Portal</span>
                  </Link>
                  <Link
                    href="/shop-owner/catalog"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/catalog')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Add Products</span>
                  </Link>
                  <Link
                    href="/shop-owner/products"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/shop-owner/products')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>My Inventory</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {/* Demo role switcher for signed-in preview accounts */}
            {user && <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition-all"
                aria-label="Switch demo role profiles"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Demo accounts</span>
                <ChevronDown className="w-3 h-3 text-slate-500 transition-transform" />
              </button>

              {demoMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDemoMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 flex items-center justify-between">
                      <span>Instant Demo Roles</span>
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">1-click</span>
                    </div>
                    <div className="p-1 space-y-1 mt-1">
                      <button
                        onClick={() =>
                          handleQuickLogin('admin@ecommerce.com', 'password', 'System Admin')
                        }
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-start space-x-3 transition-colors group border border-transparent hover:border-slate-200"
                      >
                        <div className="p-2 rounded-full bg-slate-100 text-slate-800 border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Platform Administrator</div>
                          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Global catalog control, store governance & account provisioning</div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          handleQuickLogin('sarah@apex.com', 'password', 'Sarah (Apex Goods)')
                        }
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-start space-x-3 transition-colors group border border-transparent hover:border-slate-200"
                      >
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Apex Goods (Merchant)</div>
                          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Electronics & studio gear storefront with retail markups</div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          handleQuickLogin('marcus@haven.com', 'password', 'Marcus (Haven Studio)')
                        }
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-start space-x-3 transition-colors group border border-transparent hover:border-slate-200"
                      >
                        <div className="p-2 rounded-full bg-slate-100 text-slate-800 border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Haven Studio (Merchant)</div>
                          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Artisanal lifestyle goods, ceramic homeware & listings</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>}

            {/* Shopping cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Session Profile / Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {user.role === 'admin' ? 'Administrator' : shop?.name || 'Shop Owner'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Become a seller
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
