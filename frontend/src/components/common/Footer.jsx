import React from 'react';
import { Store, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">
              Omni<span className="text-emerald-600">Shop</span> E-commerce Management
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center space-x-1">
            <span>Built with Laravel 12 & React 18 for multi-tenant shared catalog e-commerce</span>
          </p>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role-Based Access Control</span>
            </span>
            <span>•</span>
            <span>Shared Product Catalog</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
