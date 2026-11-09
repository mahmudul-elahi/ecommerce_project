'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('furniro_wishlist');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse wishlist from localStorage', e);
    }
    setInitialized(true);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem('furniro_wishlist', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [favorites, initialized]);

  const getItemKey = (item) => {
    if (!item) return '';
    return String(item.shop_product_id || item.product_id || item.id);
  };

  const isFavorite = (idOrItem) => {
    if (!idOrItem) return false;
    const targetKey = typeof idOrItem === 'object' ? getItemKey(idOrItem) : String(idOrItem);
    return favorites.some((fav) => getItemKey(fav) === targetKey);
  };

  const addToWishlist = (product) => {
    if (!product) return false;
    const key = getItemKey(product);
    if (!key) return false;

    setFavorites((prev) => {
      if (prev.some((f) => getItemKey(f) === key)) {
        return prev;
      }
      return [
        {
          id: product.id,
          shop_product_id: product.shop_product_id || product.id,
          product_id: product.product_id || product.id,
          name: product.name,
          price: Number(product.price || 0),
          thumbnail: product.thumbnail || product.effective_thumbnail_url || product.thumbnail_url || '',
          stock: product.stock ?? 10,
          category: product.category || '',
          shop: product.shop || {
            id: product.shop_id || 1,
            name: product.shop_name || 'Furniro Flagship',
            slug: product.shop_slug || 'furniro',
          },
        },
        ...prev,
      ];
    });

    return true;
  };

  const removeFromWishlist = (idOrItem) => {
    if (!idOrItem) return;
    const targetKey = typeof idOrItem === 'object' ? getItemKey(idOrItem) : String(idOrItem);
    setFavorites((prev) => prev.filter((fav) => getItemKey(fav) !== targetKey));
  };

  const toggleWishlist = (product) => {
    if (!product) return false;
    const key = getItemKey(product);
    const exists = favorites.some((f) => getItemKey(f) === key);

    if (exists) {
      removeFromWishlist(key);
      return false; // removed
    } else {
      addToWishlist(product);
      return true; // added
    }
  };

  const clearWishlist = () => {
    setFavorites([]);
  };

  const totalWishlistCount = favorites.length;

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        totalWishlistCount,
        isWishlistOpen,
        setIsWishlistOpen,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isFavorite,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
