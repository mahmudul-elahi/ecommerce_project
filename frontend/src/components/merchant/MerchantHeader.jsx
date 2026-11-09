'use client';

import React from 'react';
import Link from 'next/link';
import { Store, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';

export default function MerchantHeader({ shop }) {
  if (!shop) return null;

  return (
    <div className="merchant-storefront-header">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
        {shop.banner_url ? (
          <img
            src={shop.banner_url}
            alt={shop.name}
            className="w-full h-full object-cover filter brightness-90"
          />
        ) : (
          <div className="w-full h-full bg-[#FAF3EA] flex items-center justify-center">
            <Store className="w-16 h-16 text-[#B88E2F]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold backdrop-blur-sm shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Stores</span>
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-xl border border-white/50 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {shop.logo_url ? (
                <img
                  src={shop.logo_url}
                  alt={shop.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Store className="w-10 h-10 text-[#B88E2F]" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                {shop.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl line-clamp-2 mt-1 drop-shadow">
                {shop.description || 'Welcome to our independent boutique storefront.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md">
            {shop.address && (
              <div className="flex items-center gap-1.5 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{shop.address}</span>
              </div>
            )}
            {shop.phone && (
              <div className="flex items-center gap-1.5 text-slate-200">
                <Phone className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{shop.phone}</span>
              </div>
            )}
            {shop.email && (
              <div className="flex items-center gap-1.5 text-slate-200">
                <Mail className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{shop.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
