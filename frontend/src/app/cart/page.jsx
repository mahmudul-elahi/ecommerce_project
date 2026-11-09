'use client';

import React from 'react';
import Link from 'next/link';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const formatPrice = (val) => {
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  return (
    <div className="furniro-cart-page">
      <PageBanner title="Cart" breadcrumb={[{ label: 'Cart' }]} />

      <main className="section-container cart-content-section">
        {items.length === 0 ? (
          <div className="cart-empty-state">
            <div className="w-20 h-20 rounded-full bg-[#FAF3EA] flex items-center justify-center mx-auto mb-5 text-[#B88E2F]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2>Your cart is currently empty</h2>
            <p>Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/shop" className="furniro-gold-btn mt-6">
              Return to Shop
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Left: Cart Items Table */}
            <div className="cart-table-wrapper">
              <table className="cart-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th aria-label="Remove item" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.shop_product_id}>
                      <td className="product-col">
                        <div className="product-thumb-wrapper">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="product-thumb-img"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#FAF3EA] flex items-center justify-center text-[#B88E2F]">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <span className="product-name-text">{item.name}</span>
                      </td>

                      <td className="price-col">
                        <span className="muted-price-text">{formatPrice(item.price)}</span>
                      </td>

                      <td className="quantity-col">
                        <div className="qty-control-box">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.shop_product_id, item.quantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.shop_product_id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="subtotal-col">
                        <span className="row-subtotal-text">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </td>

                      <td className="remove-col">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.shop_product_id)}
                          className="cart-remove-btn"
                          title="Remove item"
                        >
                          <img
                            src="/images/furniro/iconTrash.svg"
                            alt="Delete"
                            className="w-5 h-5 text-[#B88E2F]"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: Cart Totals Box */}
            <aside className="cart-totals-card">
              <h2 className="cart-totals-title">Cart Totals</h2>

              <div className="cart-totals-rows">
                <div className="totals-row">
                  <span className="totals-label">Subtotal</span>
                  <span className="totals-sub-val">{formatPrice(subtotal)}</span>
                </div>

                <div className="totals-row">
                  <span className="totals-label">Total</span>
                  <span className="totals-grand-val">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="checkout-btn-wrapper">
                <Link href="/checkout" className="furniro-checkout-btn">
                  Check Out
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      <FeaturesBar />
    </div>
  );
}
