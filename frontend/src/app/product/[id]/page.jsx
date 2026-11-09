'use client';

import React, { use } from 'react';
import ProductDetailView from '../../../components/product/ProductDetailView';
import { useSingleProductQuery, useAllProductsQuery } from '../../../hooks/useShops';
import { furniroProducts } from '../../../data/furniroProducts';

export default function SingleProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const productId = params?.id;

  // Fetch real product details from backend
  const { data: remoteProduct, isLoading, isError } = useSingleProductQuery(productId);
  const { data: allProdsResponse } = useAllProductsQuery({ per_page: 8 });

  // Fallback to static furniro items if backend is loading or unavailable
  const fallbackProduct =
    furniroProducts.find((p) => String(p.id) === String(productId) || String(p.shop_product_id) === String(productId)) ||
    furniroProducts[0];

  const product = remoteProduct || fallbackProduct;

  const relatedProducts =
    (allProdsResponse?.data || furniroProducts)
      .filter((p) => String(p.shop_product_id || p.id) !== String(product.shop_product_id || product.id))
      .slice(0, 4);

  if (isLoading && !remoteProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
