'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'sonner';

const asset = (name) => `/images/furniro/${name}.svg`;

export default function StorefrontNavbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, isShopOwner, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { totalWishlistCount, setIsWishlistOpen } = useWishlist();
  const account = isAdmin ? '/admin/dashboard' : isShopOwner ? '/shop-owner/dashboard' : '/login';

  return (
    <header className="storefront-header">
      <Link className="storefront-logo" href="/" aria-label="Furniro home">
        <span className="storefront-logo-mark">
          <img src="/images/furniro/imgMeubelHouseLogos05.png" alt="Furniro Logo" />
        </span>
        Furniro
      </Link>

      <nav className={`storefront-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        {[
          ['Home', '/'],
          ['Shop', '/shop'],
          ['About', '/#about'],
          ['Contact', '/contact'],
        ].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="storefront-actions">
        <Link
          href={account}
          aria-label={user ? 'Your dashboard' : 'Sign in'}
          title={user ? user.name : 'Sign in'}
          className="action-icon-link"
        >
          <img src={asset('imgMdiAccountAlertOutline')} alt="Account" />
        </Link>

        <Link
          href="/shop"
          aria-label="Search catalog"
          className="action-icon-link"
        >
          <img src={asset('imgAkarIconsSearch')} alt="Search" />
        </Link>

        <button
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          aria-label={`Open wishlist, ${totalWishlistCount} items`}
          className="action-icon-link relative"
        >
          <img src={asset('iconNavHeart')} alt="Wishlist" />
          {totalWishlistCount > 0 && (
            <span className="cart-count !bg-rose-500 !text-white">{totalWishlistCount}</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Open shopping cart, ${totalCount} items`}
          className="action-icon-link relative"
        >
          <img src={asset('imgAntDesignShoppingCartOutlined')} alt="Cart" />
          {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
        </button>

        {user && (
          <button onClick={logout} aria-label="Sign out" className="action-icon-link text-slate-700 hover:text-amber-700">
            <LogOut size={22} />
          </button>
        )}

        <button
          className="mobile-menu"
          aria-expanded={open}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
