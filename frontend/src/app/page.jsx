'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useShopsQuery, useAllProductsQuery, useCategoriesQuery } from '../hooks/useShops';
import ProductGrid from '../components/product/ProductGrid';
import MerchantGrid from '../components/merchant/MerchantGrid';

const image = (name) => `/images/furniro/${name}.png`;

const merchantCategories = [
  { id: 'all', label: 'All stores' },
  { id: 'flagship', label: 'Flagship Studios' },
  { id: 'artisan', label: 'Artisan & Boutiques' },
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
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [room, setRoom] = useState(0);

  const debouncedSearch = useDebounce(storeSearch, 250);

  // 1. Fetch live assigned products across active stores from Laravel backend
  const {
    data: productsData,
    isLoading: loadingProducts,
    isError: errorProducts,
    refetch: refetchProducts,
  } = useAllProductsQuery({ per_page: 8 });

  const featuredProducts = productsData?.data || [];

  // 2. Fetch live merchant stores from Laravel backend
  const {
    data: rawShops = [],
    isLoading: loadingShops,
    isError: errorShops,
    refetch: refetchShops,
  } = useShopsQuery(debouncedSearch);

  // 3. Fetch dynamic customer categories from Laravel backend
  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useCategoriesQuery();

  const filteredShops = useMemo(() => {
    return rawShops.filter((shop) => {
      const text = `${shop.name} ${shop.description || ''}`.toLowerCase();
      if (storeCategory === 'all') return true;
      if (storeCategory === 'flagship') return /flagship|furniro/.test(text);
      if (storeCategory === 'artisan') return /artisan|boutique|studio/.test(text);
      return true;
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
            Thoughtful collections crafted with natural materials and timeless aesthetics. Explore unique pieces from verified independent shops.
          </p>
          <Link className="gold-button hero-button" href="/shop">
            BUY NOW
          </Link>
        </div>
      </section>

      {/* 2. Browse The Range (Dynamic backend categories from active shops) */}
      <section className="range-section section-container" aria-labelledby="range-title">
        <h2 id="range-title">Browse The Range</h2>
        <p className="section-subtitle">Curated collections for every corner of your home.</p>

        {loadingCategories ? (
          <div className="range-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="range-card animate-pulse">
                <div className="range-photo bg-slate-200" />
                <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mt-6" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="range-grid">
              {(showAllCategories ? categories : categories.slice(0, 3)).map((cat) => (
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="range-card group"
                  key={cat.slug || cat.name}
                >
                  <div className="range-photo">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#f4f5f7] flex items-center justify-center text-slate-400 font-medium p-4">
                        <span>{cat.name}</span>
                      </div>
                    )}
                  </div>
                  <h3>{cat.name}</h3>
                </Link>
              ))}
            </div>

            {categories.length > 3 && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  className="furniro-outline-btn text-sm py-2 px-6"
                >
                  {showAllCategories
                    ? 'Show Less'
                    : `View All Categories (${categories.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 3. Our Products (Dynamic backend products from active shops) */}
      <section className="section-container products-section" aria-labelledby="products-title">
        <h2 id="products-title" className="section-main-heading">
          Our Products
        </h2>

        <ProductGrid
          products={featuredProducts}
          isLoading={loadingProducts}
          isError={errorProducts}
          onRetry={refetchProducts}
        />

        <div className="show-more-wrapper">
          <Link href="/shop" className="furniro-outline-btn">
            Show More
          </Link>
        </div>
      </section>

      {/* 4. Modular Merchant Store Component (Dynamic from Laravel backend) */}
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
