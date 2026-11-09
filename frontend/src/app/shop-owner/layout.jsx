'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import BankDashLayout from '../../components/dashboard/BankDashLayout';

export default function ShopOwnerLayout({ children }) {
  const { user, loading, isShopOwner, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || (!isShopOwner && !isAdmin))) {
      router.push('/login');
    }
  }, [user, loading, isShopOwner, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (!isShopOwner && !isAdmin)) {
    return null;
  }

  let pageTitle = 'Overview';
  if (pathname.includes('/shop-owner/products')) pageTitle = 'My Store Products';
  else if (pathname.includes('/shop-owner/catalog')) pageTitle = 'Shared Catalog';
  else if (pathname.includes('/shop-owner/orders')) pageTitle = 'Customer Orders';
  else if (pathname.includes('/shop-owner/settings')) pageTitle = 'Store Settings';

  return (
    <BankDashLayout role="shop-owner" title={pageTitle}>
      {children}
    </BankDashLayout>
  );
}
