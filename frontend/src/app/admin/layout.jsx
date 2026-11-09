'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import BankDashLayout from '../../components/dashboard/BankDashLayout';

export default function AdminLayout({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  // Derive title from pathname
  let pageTitle = 'Overview';
  if (pathname.includes('/admin/shops')) pageTitle = 'Merchant Stores';
  else if (pathname.includes('/admin/products')) pageTitle = 'Product Catalog';
  else if (pathname.includes('/admin/categories')) pageTitle = 'Dynamic Categories';
  else if (pathname.includes('/admin/users')) pageTitle = 'Users & Merchants';

  return (
    <BankDashLayout role="admin" title={pageTitle}>
      {children}
    </BankDashLayout>
  );
}
