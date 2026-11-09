'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductCard from './ProductCard';
import { toast } from 'sonner';

export default function ProductDetailView({ product, relatedProducts = [] }) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Combine all product images: images array, images_urls, and thumbnail, deduplicated
  const rawImages = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(Array.isArray(product.images_urls) ? product.images_urls : []),
    product.thumbnail,
  ].filter(Boolean);

  const imagesList = Array.from(new Set(rawImages));

  const [selectedImg, setSelectedImg] = useState(
    imagesList[0] || product.thumbnail || null
  );
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('gold');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (imagesList.length > 0 && (!selectedImg || !imagesList.includes(selectedImg))) {
      setSelectedImg(imagesList[0]);
    }
  }, [product.id, imagesList.join(',')]);

  const formatPrice = (val) => {
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  const handleAddToCart = () => {
    const shop = {
      id: product.shop?.id || product.shop_id || 1,
      name: product.shop?.name || product.shop_name || 'Furniro Flagship',
      slug: product.shop?.slug || product.shop_slug || 'furniro',
    };

    const cartProduct = {
      shop_product_id: product.shop_product_id || product.id,
      product_id: product.product_id || product.id,
      name: product.name,
      price: product.price,
      thumbnail: selectedImg || product.thumbnail,
      stock: product.stock ?? 10,
    };

    addToCart(shop, cartProduct, quantity);
    toast.success(`Added ${quantity} × ${product.name} to cart!`, {
      description: `Store: ${shop.name} · Size: ${selectedSize}`,
    });
  };

  const handleCompare = () => {
    toast.info('Comparison', {
      description: `${product.name} opened in comparison.`,
    });
    router.push('/comparison');
  };

  return (
    <div className="furniro-single-product-page">
      {/* 1. Breadcrumb Bar */}
      <nav className="product-breadcrumb-bar" aria-label="Breadcrumb">
        <div className="section-container breadcrumb-inner">
          <Link href="/" className="crumb-link">Home</Link>
          <img src="/images/furniro/iconBreadcrumbArrow.svg" alt="" className="crumb-arrow" />
          <Link href="/shop" className="crumb-link">Shop</Link>
          <img src="/images/furniro/iconBreadcrumbArrow.svg" alt="" className="crumb-arrow" />
          <div className="crumb-pipe" />
          <span className="crumb-current-product">{product.name}</span>
        </div>
      </nav>

      {/* 2. Main Product Hero Section */}
      <main className="section-container product-hero-section">
        <div className="product-hero-grid">
          {/* Gallery View */}
          <div className="product-gallery-layout">
            {imagesList.length > 0 && (
              <div className="thumb-column">
                {imagesList.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImg(src)}
                    className={`gallery-thumb-btn ${selectedImg === src ? 'active' : ''}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt="" className="thumb-img" />
                  </button>
                ))}
              </div>
            )}

            <div className="main-photo-box">
              {(selectedImg || product.thumbnail) ? (
                <img
                  src={selectedImg || product.thumbnail}
                  alt={product.name}
                  className="main-product-img"
                />
              ) : (
                <div className="w-full h-full bg-[#f4f5f7] flex items-center justify-center text-slate-400 font-medium">
                  {product.name}
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="product-details-column">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">{formatPrice(product.price)}</p>

            <div className="product-rating-row">
              <div className="stars-wrapper">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="#FFC700" color="#FFC700" />
                ))}
              </div>
              <div className="rating-divider" />
              <span className="reviews-count-text">5 Customer Review</span>
            </div>

            {product.description && (
              <p className="product-short-desc">{product.description}</p>
            )}

            {/* Size Selector */}
            <div className="option-group">
              <span className="option-label">Size</span>
              <div className="size-buttons-row">
                {['L', 'XL', 'XS'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="option-group">
              <span className="option-label">Color</span>
              <div className="color-swatches-row">
                {[
                  { id: 'purple', bg: '#816DFA' },
                  { id: 'black', bg: '#000000' },
                  { id: 'gold', bg: '#B88E2F' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={`color-swatch ${selectedColor === c.id ? 'active' : ''}`}
                    style={{ backgroundColor: c.bg }}
                    aria-label={`Color option ${c.id}`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="product-purchase-row">
              <div className="qty-picker">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="qty-picker-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-picker-num">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="qty-picker-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-add-to-cart"
              >
                Add To Cart
              </button>

              <button
                type="button"
                onClick={handleCompare}
                className="btn-compare"
              >
                + Compare
              </button>
            </div>

            <div className="product-meta-divider" />

            {/* Product Meta */}
            <div className="product-meta-info">
              <div className="meta-row">
                <span className="meta-key">SKU</span>
                <span className="meta-sep">:</span>
                <span className="meta-val">{product.sku || 'FUR-001'}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Category</span>
                <span className="meta-sep">:</span>
                <span className="meta-val">{product.category || 'Living'}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Store</span>
                <span className="meta-sep">:</span>
                <span className="meta-val text-[#B88E2F] font-semibold">
                  {product.shop?.name || product.shop_name || 'Furniro Flagship'}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Tags</span>
                <span className="meta-sep">:</span>
                <span className="meta-val">Furniture, Interior, Decor, Shop</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Share</span>
                <span className="meta-sep">:</span>
                <div className="meta-social-icons">
                  <a href="#share" aria-label="Share on Facebook" className="hover:text-[#B88E2F] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#share" aria-label="Share on LinkedIn" className="hover:text-[#B88E2F] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#share" aria-label="Share on Twitter" className="hover:text-[#B88E2F] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Description & Additional Info Tabs */}
      <section className="product-tabs-section">
        <div className="section-container">
          <div className="tabs-header">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`tab-title-btn ${activeTab === 'description' ? 'active' : ''}`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('additional')}
              className={`tab-title-btn ${activeTab === 'additional' ? 'active' : ''}`}
            >
              Additional Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`tab-title-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            >
              Reviews [5]
            </button>
          </div>

          <div className="tab-content-body">
            <p className="tab-para">
              {product.description || 'Thoughtful interior piece crafted with natural materials and timeless aesthetics for modern spaces.'}
            </p>

            {imagesList.length > 1 && (
              <div className="tab-gallery-duo">
                {imagesList.slice(1, 3).map((imgUrl, idx) => (
                  <div key={idx} className="tab-duo-card">
                    <img src={imgUrl} alt={product.name} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-container related-products-section">
          <h2 className="section-main-heading">Related Products</h2>
          <div className="furniro-products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.shop_product_id || p.id} product={p} />
            ))}
          </div>
          <div className="show-more-wrapper">
            <Link href="/shop" className="furniro-outline-btn">
              Show More
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
