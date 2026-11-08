import React from 'react';
import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm tracking-tight">
                OmniShop
              </div>
              <p className="text-xs text-slate-500">
                A little marketplace for independent shops.
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-500">Discover a shop. Find something you love. Shop small.</div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>© 2026 OmniShop</div>
          <div>Made for good finds and the people who make them.</div>
        </div>
      </div>
    </footer>
  );
}
