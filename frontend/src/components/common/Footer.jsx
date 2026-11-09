'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const newsletterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

export default function Footer() {
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/shop-owner')) {
    return null;
  }

  const onSubscribe = (data) => {
    toast.success('Thank you for subscribing!', {
      description: `Updates will be sent to ${data.email}.`,
    });
    reset();
  };

  return (
    <footer className="storefront-footer">
      <div className="footer-columns">
        <div className="footer-col-brand">
          <Link className="footer-brand" href="/">
            Woodora.
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
          <form onSubmit={handleSubmit(onSubscribe)} className="footer-newsletter-form" noValidate>
            <div className="flex flex-col w-full">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                {...register('email')}
                className="footer-email-input"
                aria-label="Your email address"
              />
              {errors.email && (
                <span className="text-[10px] text-rose-500 mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            <button type="submit" className="footer-subscribe-btn">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">2026 Woodora. All rights reserved</p>
      </div>
    </footer>
  );
}
