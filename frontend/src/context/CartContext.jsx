import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartShop, setCartShop] = useState(() => {
    const saved = localStorage.getItem('cart_shop');
    return saved ? JSON.parse(saved) : null;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
    if (items.length === 0) {
      setCartShop(null);
      localStorage.removeItem('cart_shop');
    } else if (cartShop) {
      localStorage.setItem('cart_shop', JSON.stringify(cartShop));
    }
  }, [items, cartShop]);

  const addToCart = (shop, product, quantity = 1) => {
    // If cart has items from another shop, confirm replacement
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
    localStorage.removeItem('cart_items');
    localStorage.removeItem('cart_shop');
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
