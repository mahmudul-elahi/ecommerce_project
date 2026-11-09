'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const formatPrice = (val) => {
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shop = {
      id: product.shop_id || 1,
      name: product.shop_name || 'Furniro Flagship',
      slug: product.shop_slug || 'furniro',
    };

    const cartProduct = {
      shop_product_id: product.shop_product_id || product.id,
      product_id: product.product_id || product.id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      stock: product.stock ?? 10,
    };

    addToCart(shop, cartProduct, 1);
    toast.success(`Added ${product.name} to cart!`, {
      description: `${formatPrice(product.price)} · from ${shop.name}`,
    });
  };

  const handleAction = (e, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(actionName, {
      description: `${product.name} marked for ${actionName.toLowerCase()}.`,
    });
  };

  // Target route for clicking the card
  const productUrl = `/product/${product.shop_product_id || product.id}`;

  return (
    <article
      onClick={() => router.push(productUrl)}
      className="furniro-product-card group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') router.push(productUrl);
      }}
    >
      {/* Thumbnail & Badges */}
      <div className="product-card-media">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#eaedf1] flex items-center justify-center text-slate-400 p-4">
            <span className="text-xs font-medium text-center line-clamp-2">{product.name}</span>
          </div>
        )}

        {product.badge && (
          <div
            className={`product-badge ${
              product.badgeType === 'discount' || product.badge.startsWith('-')
                ? 'badge-discount'
                : 'badge-new'
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="product-card-overlay">
          <button
            type="button"
            onClick={handleAddToCart}
            className="product-card-add-btn"
          >
            Add to cart
          </button>

          <div className="product-card-actions">
            <button
              type="button"
              onClick={(e) => handleAction(e, 'Share')}
              className="product-action-btn"
            >
              <img
                src="/images/furniro/iconShare.svg"
                alt=""
                className="w-4 h-4"
              />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleAction(e, 'Compare')}
              className="product-action-btn"
            >
              <img
                src="/images/furniro/iconCompare.svg"
                alt=""
                className="w-4 h-4"
              />
              <span>Compare</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleAction(e, 'Like')}
              className="product-action-btn"
            >
              <img
                src="/images/furniro/iconHeart.svg"
                alt=""
                className="w-4 h-4"
              />
              <span>Like</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="product-card-body">
        <div className="product-card-info-top">
          <h3 className="product-card-title" title={product.name}>
            {product.name}
          </h3>
          <p
            className="product-card-subtitle"
            title={product.subtitle || product.category || 'Interior Design'}
          >
            {product.subtitle || product.category || 'Interior Design'}
          </p>
          <span
            className="product-card-shop"
            title={product.shop_name || 'Furniro Flagship'}
          >
            {product.shop_name || 'Furniro Flagship'}
          </span>
        </div>

        <div className="product-card-price-row">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.original_base_price && product.original_base_price > product.price && (
            <span className="product-card-old-price">
              {formatPrice(product.original_base_price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
