import React from 'react';
import Link from 'next/link';

export default function PageBanner({ title, breadcrumb = [] }) {
  return (
    <div className="furniro-page-banner">
      <div className="banner-bg-wrapper">
        <img
          src="/images/furniro/pageBanner.png"
          alt=""
          className="banner-bg-img"
        />
        <div className="banner-overlay" />
      </div>
      <div className="banner-content">
        <img
          src="/images/furniro/imgMeubelHouseLogos05.png"
          alt=""
          className="banner-logo"
        />
        <h1 className="banner-title">{title}</h1>
        <nav className="banner-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="crumb-link">Home</Link>
          <img
            src="/images/furniro/iconBreadcrumbArrow.svg"
            alt=""
            className="crumb-arrow"
          />
          {breadcrumb.map((crumb, idx) => (
            <React.Fragment key={crumb.label || crumb}>
              {idx > 0 && (
                <img
                  src="/images/furniro/iconBreadcrumbArrow.svg"
                  alt=""
                  className="crumb-arrow"
                />
              )}
              {crumb.href ? (
                <Link href={crumb.href} className="crumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="crumb-current">{crumb.label || crumb}</span>
              )}
            </React.Fragment>
          ))}
          {breadcrumb.length === 0 && (
            <span className="crumb-current">{title}</span>
          )}
        </nav>
      </div>
    </div>
  );
}
