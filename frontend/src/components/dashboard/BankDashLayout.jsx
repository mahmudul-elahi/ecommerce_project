'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Layers,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Bell,
  SlidersHorizontal,
  Menu,
  X,
  CreditCard,
  DollarSign,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function BankDashLayout({ children, title = 'Overview', role = 'admin' }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out successfully');
    router.push('/login');
  };

  const adminNavItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Merchant Stores', href: '/admin/shops', icon: Store },
    { label: 'Product Catalog', href: '/admin/products', icon: ShoppingBag },
    { label: 'Dynamic Categories', href: '/admin/categories', icon: Layers },
    { label: 'Users & Merchants', href: '/admin/users', icon: Users },
  ];

  const shopOwnerNavItems = [
    { label: 'Overview', href: '/shop-owner/dashboard', icon: LayoutDashboard },
    { label: 'My Products', href: '/shop-owner/products', icon: ShoppingBag },
    { label: 'Shared Catalog', href: '/shop-owner/catalog', icon: Layers },
    { label: 'Customer Orders', href: '/shop-owner/orders', icon: ShoppingCart },
    { label: 'Store Settings', href: '/shop-owner/settings', icon: Settings },
  ];

  const navItems = role === 'admin' ? adminNavItems : shopOwnerNavItems;

  const isActive = (href) => {
    if (href === '/admin/dashboard' || href === '/shop-owner/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex text-[#343C6A] font-sans antialiased">
      {/* 1. Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 2. BankDash Left Sidebar (250px) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[250px] bg-white border-r border-[#E6EFF5] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-[84px] px-8 flex items-center justify-between border-b border-[#F5F7FA]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3EA] border border-[#ebd9c5] flex items-center justify-center p-1.5 shadow-sm">
                <img
                  src="/images/furniro/imgMeubelHouseLogos05.png"
                  alt="Woodora Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight text-[#000000] font-montserrat">
                  Woodora<span className="text-[#B88E2F]">.</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B88E2F] -mt-1 font-inter">
                  {role === 'admin' ? 'Admin Hub' : 'Merchant Desk'}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-[#718EBF] hover:text-[#343C6A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="py-6 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group relative flex items-center gap-5 px-8 py-3.5 text-base font-medium transition-all ${
                    active
                      ? 'text-[#B88E2F] font-semibold bg-[#FAF3EA]'
                      : 'text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {/* Active Indicator Bar on Left - Furniro Gold */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#B88E2F] rounded-r-md" />
                  )}
                  <Icon
                    className={`w-5 h-5 ${
                      active ? 'text-[#B88E2F]' : 'text-[#718EBF] group-hover:text-[#343C6A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-6 border-t border-[#F5F7FA] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Content Container (Margin 250px on desktop) */}
      <div className="flex-1 lg:ml-[250px] flex flex-col min-h-screen min-w-0">
        {/* BankDash Top Header (84px) */}
        <header className="sticky top-0 z-30 h-[84px] bg-white border-b border-[#E6EFF5] px-6 lg:px-9 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#718EBF] hover:text-[#343C6A] rounded-xl hover:bg-[#F5F7FA]"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl lg:text-[28px] font-bold text-[#343C6A] font-inter">
              {title}
            </h1>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Pill */}
            <div className="hidden md:flex items-center relative w-64">
              <Search className="w-4 h-4 text-[#718EBF] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for something"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[#F5F7FA] text-sm text-[#343C6A] placeholder-[#8BA3CB] rounded-full border-0 outline-none focus:ring-1 focus:ring-[#B88E2F]/40 transition-all"
              />
            </div>

            {/* Circular Settings Pill */}
            <button
              type="button"
              className="hidden sm:flex w-11 h-11 rounded-full bg-[#F5F7FA] items-center justify-center text-[#718EBF] hover:text-[#343C6A] transition-colors border-0 outline-none"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Circular Notifications Pill */}
            <button
              type="button"
              className="w-11 h-11 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#FE5C73] relative hover:bg-[#F0F3F7] transition-colors border-0 outline-none"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#FE5C73]" />
              <span className="w-2 h-2 rounded-full bg-[#FE5C73] absolute top-2.5 right-2.5" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#B88E2F] to-[#D4AF37] text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-sm font-semibold text-[#343C6A] truncate max-w-[140px]">
                  {user?.name || 'Administrator'}
                </div>
                <div className="text-xs text-[#718EBF] capitalize">
                  {role === 'admin' ? 'Super Admin' : user?.shop?.name || 'Shop Owner'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BankDash Page Body Canvas */}
        <main className="flex-1 p-6 lg:p-9 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
