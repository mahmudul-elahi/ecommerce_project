# Furniro Multi-Tenant E-Commerce Platform

A multi-merchant e-commerce management system designed according to the **Small E-commerce Management Technical Assessment** specifications, paired with the modern **Furniro UI Kit & Design System**.

---

## 🚀 Key Functional Architecture

### 1. Shared Product Catalog & Merchant Listings
* **Unified Catalog:** Products can be created by the System Administrator or by individual Shop Owners. When created, products immediately join the global shared catalog.
* **Store Assignment:** Shop owners can browse the shared catalog and select items to list in their individual storefronts.
* **Independent Customization:** Shop owners can set custom retail pricing, custom descriptions, custom titles, and localized inventory stock without altering the base catalog product.
* **Strict Customer Scoping:** Customers only see products actively assigned to a valid shop. Unassigned catalog products are strictly filtered and never visible to public customers.

### 2. Furniro Design System & Public Storefront
* **Modular Component Architecture:** Divided cleanly into `components/product/` (`ProductCard`, `ProductGrid`, `ProductFilterBar`, `ProductDetailView`) and `components/merchant/` (`MerchantCard`, `MerchantGrid`, `MerchantHeader`).
* **Interactive Shopping Loop:**
  * **Homepage (`/`):** Furniro hero banner, category browsing (*Dining*, *Living*, *Bedroom*), live featured products grid with hover quick-actions, merchant store explorer, inspirations room carousel, and setup collage.
  * **Shop Catalog (`/shop`):** Advanced filter drawer, keyword search, merchant filter, grid/list view toggles, sort options, and pagination.
  * **Single Product View (`/product/[id]`):** Thumbnail gallery, high-res preview, size & color swatches, quantity stepper, rating stars, specification tabs, and related products.
  * **Merchant Storefront (`/shop/[slug]`):** Dedicated shop profile with banner, merchant details, and only products assigned to that specific store.
  * **Shopping Cart Drawer & Full Cart Page (`/cart`):** Live cart calculations, quantity adjustment, and subtotal calculation.
  * **Checkout (`/checkout`):** Billing address form, order summary, payment selection, and direct backend order creation.
  * **Contact Page (`/contact`):** Working hours, phone numbers, Coral Gables address, and inquiry form.

### 3. Management Hubs
* **Admin Hub (`/admin/dashboard`):** Manage stores, user accounts, and global catalog items.
* **Merchant Portal (`/shop-owner/dashboard`):** Manage shop profile, add products from shared catalog, create new listings, and view received customer orders.

---

## 🛠️ Tech Stack

* **Backend:** Laravel 12 (PHP 8.2+), Laravel Sanctum, SQLite / MySQL, Eloquent ORM.
* **Frontend:** Next.js 16 (React 19), Tailwind CSS, TanStack React Query, Lucide Icons, Sonner notifications.

---

## 📦 Getting Started

### Prerequisites
* PHP 8.2 or higher
* Composer
* Node.js 18+ and npm

---

### Step 1: Backend Setup (Laravel)

```bash
# Navigate to the backend folder
cd backend

# Install PHP dependencies
composer install

# Create environment configuration
cp .env.example .env

# Generate application encryption key
php artisan key:generate

# Prepare the SQLite database and seed initial data
touch database/database.sqlite
php artisan migrate:fresh --seed

# Run the test suite to verify all 10 tests pass
php artisan test

# Start the Laravel backend API server (runs on port 8000)
php artisan serve
```

---

### Step 2: Frontend Setup (Next.js)

```bash
# Navigate to the frontend folder
cd ../frontend

# Install JavaScript dependencies
npm install

# Verify configuration (points to http://127.0.0.1:8000/api)
cp .env.example .env.local

# Run production build check
npm run build

# Start the development server (runs on http://localhost:3000)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Account Credentials

Use the **1-click Demo Accounts** menu in the top navigation or log in manually at `/login`:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@ecommerce.com` | `password` | Global catalog control, store governance, and user provisioning |
| **Furniro Flagship Owner** | `furniro@ecommerce.com` | `password` | Furniro flagship interior collection & orders |
| **Tech Haven Owner** | `owner1@ecommerce.com` | `password` | Audio & electronics merchant store |
| **Urban Apparel Owner** | `owner2@ecommerce.com` | `password` | Apparel & travel lifestyle boutique |
| **Nordic Living Owner** | `owner3@ecommerce.com` | `password` | Scandinavian minimalist home decor store |

---

## 🧪 Automated Testing

Run the automated backend feature tests verifying catalog sharing, multi-tenancy, and customer visibility constraints:

```bash
cd backend
php artisan test
```

**Results:** `10 passed, 76 assertions (100% pass rate)`.
