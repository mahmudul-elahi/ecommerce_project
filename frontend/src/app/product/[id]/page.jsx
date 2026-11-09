'use client';

import React, { use } from 'react';
import Link from 'next/link';
import ProductDetailView from '../../../components/product/ProductDetailView';
import { useSingleProductQuery, useAllProductsQuery } from '../../../hooks/useShops';
import { Store } from 'lucide-react';

export default function SingleProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const productId = params?.id;

  // Fetch real product details from Laravel backend API
  const { data: product, isLoading, isError } = useSingleProductQuery(productId);

  // Fetch real related products in the same category from backend API
  const { data: relatedResponse } = useAllProductsQuery({
    category: product?.category,
    per_page: 5,
  });

  const relatedProducts = (relatedResponse?.data || [])
    .filter((p) => String(p.shop_product_id) !== String(productId))
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-slate-500 max-w-md mt-2 text-sm">
          The requested product could not be found or is not currently listed in an active shop.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-6 py-2.5 rounded-full bg-[#B88E2F] text-white text-xs font-semibold hover:bg-[#967125] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
