'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartShop, setCartShop] = useState(null);
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('cart_items');
      const savedShop = localStorage.getItem('cart_shop');
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedShop) setCartShop(JSON.parse(savedShop));
    } catch (e) {
      console.warn('Failed to parse cart from localStorage', e);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem('cart_items', JSON.stringify(items));
      if (items.length === 0) {
        setCartShop(null);
        localStorage.removeItem('cart_shop');
      } else if (cartShop) {
        localStorage.setItem('cart_shop', JSON.stringify(cartShop));
      }
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items, cartShop, initialized]);

  const addToCart = (shop, product, quantity = 1) => {
    if (cartShop && cartShop.id !== shop.id && items.length > 0) {
      const confirmSwitch = window.confirm(
        `Your cart already has items from "${cartShop.name}". Starting a new order with "${shop.name}" will clear existing items. Proceed?`
      );
      if (!confirmSwitch) return false;
      setItems([]);
    }

    setCartShop({ id: shop.id, name: shop.name, slug: shop.slug });

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.shop_product_id === product.shop_product_id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      }
      return [
        ...prev,
        {
          shop_product_id: product.shop_product_id,
          product_id: product.product_id,
          name: product.name,
          price: Number(product.price),
          thumbnail: product.thumbnail,
          stock: product.stock,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (shopProductId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(shopProductId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.shop_product_id === shopProductId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (shopProductId) => {
    setItems((prev) => prev.filter((i) => i.shop_product_id !== shopProductId));
  };

  const clearCart = () => {
    setItems([]);
    setCartShop(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart_items');
      localStorage.removeItem('cart_shop');
    }
  };

  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartShop,
        items,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
