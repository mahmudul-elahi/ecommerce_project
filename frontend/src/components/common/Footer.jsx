import React from 'react';
import { Store, ShieldCheck, Layers, GitFork } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 mt-auto py-10 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm tracking-tight">
                OmniShop Engine
              </div>
              <p className="text-xs text-stone-500">
                Shared Product Catalog & Multi-Tenant E-commerce Management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-500">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-700" />
              <span>Unified Global Catalog</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center space-x-1.5">
              <GitFork className="w-3.5 h-3.5 text-stone-700" />
              <span>Independent Shop Pricing & Listings</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              <span>Isolated Storefront Boundaries</span>
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <div>
            Built with Laravel 12 API + Next.js 16 (React 19, Turbopack, TanStack Query, React Hook Form, Zod)
          </div>
          <div className="font-mono text-stone-400">
            Candidate Task · Submission 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
