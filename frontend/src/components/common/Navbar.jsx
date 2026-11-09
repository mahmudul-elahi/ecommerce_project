'use client';

import React from 'react';
import StorefrontNavbar from './StorefrontNavbar';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // For Admin and Shop Owner pages, the Furniro dashboard layout provides its own sidebar and header
  if (pathname.startsWith('/admin') || pathname.startsWith('/shop-owner')) {
    return null;
  }

  return <StorefrontNavbar />;
}
