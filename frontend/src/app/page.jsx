'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useShopsQuery, useAllProductsQuery } from '../hooks/useShops';
import ProductGrid from '../components/product/ProductGrid';
import MerchantGrid from '../components/merchant/MerchantGrid';
import { furniroProducts } from '../data/furniroProducts';

const image = (name) => `/images/furniro/${name}.png`;

const merchantCategories = [
  { id: 'all', label: 'All stores' },
  { id: 'furniture', label: 'Furniture & Living' },
  { id: 'tech', label: 'Audio & Tech' },
  { id: 'apparel', label: 'Apparel & Style' },
];

const rooms = [
  { image: 'imgRectangle24', title: 'Inner Peace', label: 'Bed Room' },
  { image: 'imgRectangle25', title: 'Everyday Light', label: 'Dining Room' },
  { image: 'imgRectangle26', title: 'A Quiet Corner', label: 'Living Room' },
];

const gallery = ['36', '38', '40', '39', '41', '44', '43', '45', '37'];

export default function HomePage() {
  const [storeSearch, setStoreSearch] = useState('');
  const [storeCategory, setStoreCategory] = useState('all');
  const [room, setRoom] = useState(0);

  const debouncedSearch = useDebounce(storeSearch, 250);

  // 1. Fetch live assigned products across active stores
  const {
    data: productsData,
    isLoading: loadingProducts,
    isError: errorProducts,
    refetch: refetchProducts,
  } = useAllProductsQuery({ per_page: 8 });

  // Use database products or graceful fallback to seeded items
  const featuredProducts = productsData?.data?.length
    ? productsData.data.slice(0, 8)
    : furniroProducts;

  // 2. Fetch live merchant stores
  const {
    data: rawShops = [],
    isLoading: loadingShops,
    isError: errorShops,
    refetch: refetchShops,
  } = useShopsQuery(debouncedSearch);

  const filteredShops = useMemo(() => {
    return rawShops.filter((shop) => {
      const text = `${shop.name} ${shop.description || ''}`.toLowerCase();
      return (
        storeCategory === 'all' ||
        (storeCategory === 'furniture'
          ? /furniro|home|studio|living|decor|nordic|artisan/.test(text)
          : storeCategory === 'tech'
          ? /tech|audio|electronics|gadget/.test(text)
          : /apparel|cloth|fashion|style|urban/.test(text))
      );
    });
  }, [rawShops, storeCategory]);

  return (
    <div className="furniro-home">
      {/* 1. Hero Section (Figma) */}
      <section className="collection-hero" aria-labelledby="hero-title">
        <img
          className="hero-photo"
          src={image('imgScandinavianInteriorMockupWallDecalBackground2')}
          alt="Light-filled interior mockup with warm wooden furniture"
          fetchPriority="high"
        />
        <div className="hero-content">
          <p className="eyebrow">New Arrival</p>
          <h1 id="hero-title">
            Discover Our
            <br />
            New Collection
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
          </p>
          <Link className="gold-button hero-button" href="/shop">
            BUY NOW
          </Link>
        </div>
      </section>

      {/* 2. Browse The Range (Figma) */}
      <section className="range-section section-container" aria-labelledby="range-title">
        <h2 id="range-title">Browse The Range</h2>
        <p className="section-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className="range-grid">
          {[
            ['Dining', 'imgImage106', 'dining'],
            ['Living', 'imgImage100', 'living'],
            ['Bedroom', 'imgImage101', 'bedroom'],
          ].map(([name, src, crop]) => (
            <Link href={`/shop?category=${name}`} className="range-card" key={name}>
              <div className={`range-photo ${crop}`}>
                <img src={image(src)} alt={`${name} interior`} loading="lazy" />
              </div>
              <h3>{name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Our Products (Figma Core Section - Modular Product Component) */}
      <section className="section-container products-section" aria-labelledby="products-title">
        <h2 id="products-title" className="section-main-heading">
          Our Products
        </h2>

        <ProductGrid
          products={featuredProducts}
          isLoading={loadingProducts && !featuredProducts.length}
          isError={errorProducts && !featuredProducts.length}
          onRetry={refetchProducts}
        />

        <div className="show-more-wrapper">
          <Link href="/shop" className="furniro-outline-btn">
            Show More
          </Link>
        </div>
      </section>

      {/* 4. Modular Merchant Store Component */}
      <MerchantGrid
        shops={filteredShops}
        isLoading={loadingShops}
        isError={errorShops}
        search={storeSearch}
        onSearchChange={setStoreSearch}
        category={storeCategory}
        onCategoryChange={setStoreCategory}
        categories={merchantCategories}
        onRetry={refetchShops}
      />

      {/* 5. Inspirations Section (Figma Carousel) */}
      <section className="inspiration-section" id="about" aria-labelledby="inspiration-title">
        <div className="inspiration-copy">
          <h2 id="inspiration-title">
            50+ Beautiful rooms
            <br />
            inspiration
          </h2>
          <p>
            Our designer already made a lot of beautiful prototipe of rooms that inspire you
          </p>
          <Link href="/shop" className="gold-button">
            Explore More
          </Link>
        </div>

        <div className="inspiration-main">
          <img src={image(rooms[room].image)} alt={rooms[room].label} loading="lazy" />
          <div className="room-caption">
            <p>
              0{room + 1} <span>—</span> {rooms[room].label}
            </p>
            <h3>{rooms[room].title}</h3>
          </div>
          <Link
            className="room-link"
            href={`/shop?category=${rooms[room].label.split(' ')[0]}`}
            aria-label={`Explore ${rooms[room].label} collection`}
          >
            <img src="/images/furniro/imgRight16Px.svg" alt="" />
          </Link>
        </div>

        <div className="inspiration-next">
          <img
            src={image(rooms[(room + 1) % rooms.length].image)}
            alt={rooms[(room + 1) % rooms.length].label}
            loading="lazy"
          />
          <button
            className="next-room"
            aria-label="Next room inspiration"
            onClick={() => setRoom((room + 1) % rooms.length)}
          >
            <ChevronRight />
          </button>
          <div className="room-dots">
            {rooms.map((item, i) => (
              <button
                key={item.image}
                aria-label={`Show ${item.label}`}
                aria-pressed={i === room}
                onClick={() => setRoom(i)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Setup Collage (#FuniroFurniture) */}
      <section className="setup-section" aria-labelledby="setup-title">
        <p>Share your setup with</p>
        <h2 id="setup-title">#FuniroFurniture</h2>
        <div className="setup-gallery">
          {gallery.map((number, i) => (
            <img
              key={number}
              className={`gallery-${i}`}
              src={image(`imgRectangle${number}`)}
              alt={[
                'Shelving and home accessories',
                'Creative workspace',
                'A welcoming dining space',
                'Minimalist console table',
                'Bedroom details',
                'Decorative wall display',
                'A warm bedroom',
                'Sunlit dining room',
                'A cozy accent chair',
              ][i]}
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
