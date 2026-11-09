'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleWishlist } = useWishlist();
  const router = useRouter();

  const favorited = isFavorite(product.shop_product_id || product.id);

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

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleWishlist(product);
    if (added) {
      toast.success(`Saved "${product.name}" to favorites!`);
    } else {
      toast.info(`Removed "${product.name}" from favorites.`);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/product/${product.shop_product_id || product.id}`
      : `/product/${product.shop_product_id || product.id}`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!', {
        description: `Direct storefront link for ${product.name}`,
      });
    } else {
      toast.info('Share product', { description: url });
    }
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

        {/* Floating Quick-Favorite Button (Mobile & Desktop) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            favorited
              ? 'bg-white text-rose-500 shadow-md opacity-100 scale-100'
              : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white shadow-xs opacity-0 group-hover:opacity-100 max-sm:opacity-90'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

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
              onClick={handleShare}
              className="product-action-btn hover:text-[#B88E2F] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`product-action-btn transition-colors ${
                favorited ? '!text-rose-400 font-semibold' : 'hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{favorited ? 'Liked' : 'Like'}</span>
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
