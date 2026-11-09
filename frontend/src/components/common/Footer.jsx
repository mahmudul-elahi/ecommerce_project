'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/shop-owner')) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing!', {
      description: 'You will receive our latest interior updates and offers.',
    });
    setEmail('');
  };

  return (
    <footer className="storefront-footer">
      <div className="footer-columns">
        <div className="footer-col-brand">
          <Link className="footer-brand" href="/">
            Funiro.
          </Link>
          <address className="footer-address">
            400 University Drive Suite 200 Coral Gables,
            <br />
            FL 33134 USA
          </address>
        </div>

        <div className="footer-col-links">
          <h4 className="footer-col-title">Links</h4>
          <ul className="footer-link-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col-help">
          <h4 className="footer-col-title">Help</h4>
          <ul className="footer-link-list">
            <li>
              <Link href="/#faq">Payment Options</Link>
            </li>
            <li>
              <Link href="/#returns">Returns</Link>
            </li>
            <li>
              <Link href="/#privacy">Privacy Policies</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col-newsletter">
          <h4 className="footer-col-title">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email Address"
              className="footer-email-input"
              aria-label="Your email address"
            />
            <button type="submit" className="footer-subscribe-btn">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">2023 furino. All rights reverved</p>
      </div>
    </footer>
  );
}
