'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function ShopOwnerLayout({ children }) {
  const { user, loading, isShopOwner, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (!isShopOwner && !isAdmin))) {
      router.push('/login');
    }
  }, [user, loading, isShopOwner, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (!isShopOwner && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
