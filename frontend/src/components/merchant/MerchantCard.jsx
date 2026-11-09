'use client';

import React from 'react';
import Link from 'next/link';
import { Store, MapPin, ArrowRight } from 'lucide-react';

export default function MerchantCard({ shop }) {
  const shopUrl = `/shop/${shop.slug}`;

  return (
    <article className="merchant-card group" key={shop.id}>
      <Link href={shopUrl} className="merchant-photo" aria-label={`Explore ${shop.name}`}>
        {shop.banner_url ? (
          <img
            src={shop.banner_url}
            alt={shop.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#FAF3EA] flex items-center justify-center text-[#B88E2F]">
            <Store size={48} />
          </div>
        )}
        <span className="merchant-count">{shop.products_count || 0} items</span>
      </Link>

      <div className="merchant-details">
        <h3>
          <Link href={shopUrl}>{shop.name}</Link>
        </h3>
        <p>{shop.description || 'Discover a thoughtfully curated collection of everyday favorites.'}</p>
        <div className="merchant-location">
          <MapPin size={14} />
          <span>{shop.address || 'Independent online store'}</span>
        </div>
        <Link className="merchant-link" href={shopUrl}>
          Explore store <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
