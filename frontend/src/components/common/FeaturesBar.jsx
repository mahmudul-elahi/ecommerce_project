import React from 'react';

const features = [
  {
    icon: '/images/furniro/featureTrophy.svg',
    title: 'High Quality',
    desc: 'crafted from top materials',
  },
  {
    icon: '/images/furniro/featureGuarantee.svg',
    title: 'Warranty Protection',
    desc: 'Over 2 years',
  },
  {
    icon: '/images/furniro/featureShipping.svg',
    title: 'Free Shipping',
    desc: 'Order over 150 $',
  },
  {
    icon: '/images/furniro/featureSupport.svg',
    title: '24 / 7 Support',
    desc: 'Dedicated support',
  },
];

export default function FeaturesBar() {
  return (
    <section className="furniro-features-bar" aria-label="Store Benefits">
      <div className="features-grid">
        {features.map((item) => (
          <div key={item.title} className="feature-item">
            <div className="feature-icon-wrapper">
              <img src={item.icon} alt="" className="feature-icon" />
            </div>
            <div className="feature-text">
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
