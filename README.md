# Woodora & Furniro Multi-Tenant E-Commerce Platform

A production-ready multi-merchant e-commerce management system designed according to the **Small E-commerce Management Technical Assessment** specifications, paired with the modern **Furniro UI Kit & Design System** and **BankDash Management Console**.

---

## 🚀 Key Functional Architecture

### 1. Shared Product Catalog & Merchant Distribution
* **Unified Master Catalog:** Products can be created centrally by the System Administrator or by individual Shop Owners. When created, products immediately join the global shared catalog.
* **Smart Store Listing (No Duplicate Copies):**
  * By default, the Shared Catalog displays only items that are **Available to Add** (`whereNotIn('id', $myShopProductIds)`), preventing merchants from seeing redundant copies of products already in their store.
  * Interactive view tabs allow toggling between **Available to Add**, **Already in Store**, and **All Catalog**.
  * Products already in the merchant's store clearly display an `In Store` badge with a direct `Manage in My Products` shortcut instead of duplicate `+ Add to My Store` buttons.
  * Backend API enforces duplicate listing guards returning HTTP 422 if an already-assigned product is submitted.
* **Independent Storefront Customization:** Shop owners can set custom retail pricing, custom descriptions, custom titles, and localized inventory stock without altering the base catalog product.
* **Strict Customer Scoping:** Customers only see products actively assigned to a valid active shop. Unassigned catalog products are strictly filtered and never visible to public customers.

### 2. Furniro Design System & Public Storefront
* **Sticky Navigation Bar:** Modern blur backdrop (`backdrop-blur-md`) with soft border and shadow that stays pinned to the top of the viewport during scrolling.
* **Dynamic Media & Storage:**
  * Category images, product gallery images, and shop logos/banners are seeded directly into Laravel's public disk (`storage/app/public/`) and served dynamically via the public storage symlink (`/storage/...`).
  * Full WebP optimization support and resilient memory handling.
* **Modular Component Architecture:** Divided cleanly into `components/product/` (`ProductCard`, `ProductGrid`, `ProductFilterBar`, `ProductDetailView`) and `components/merchant/` (`MerchantCard`, `MerchantGrid`, `MerchantHeader`).
* **Interactive Shopping Loop:**
  * **Homepage (`/`):** Hero banner, dynamic category browsing (*Dining*, *Living*, *Bedroom*), live featured products grid with hover quick-actions, merchant store explorer, inspirations room carousel, and setup collage.
  * **Shop Catalog (`/shop`):** Advanced filter drawer, keyword search, merchant filter, grid/list view toggles, sort options, and pagination.
  * **Single Product View (`/product/[id]`):** Multiple image thumbnail gallery with high-res active preview, dynamic pricing, quantity stepper, rating stars, specification tabs, and related products.
  * **Merchant Storefront (`/shop/[slug]`):** Dedicated shop profile with banner, merchant details, and only products assigned to that specific store.
  * **Shopping Cart Drawer & Full Cart Page (`/cart`):** Live cart calculations, quantity adjustment, and subtotal calculation.
  * **Checkout (`/checkout`):** Billing address form, order summary, payment selection, and direct backend order creation.
  * **Contact Page (`/contact`):** Working hours, phone numbers, Coral Gables address, and inquiry form.

### 3. Management Hubs
* **Admin Hub (`/admin/dashboard`):** Clean e-commerce dashboard with real KPIs (revenue, active stores, orders, products), live recent orders, and quick management links.
* **Merchant Portal (`/shop-owner/dashboard`):** BankDash-style merchant dashboard displaying active listings, available catalog items ready to add, customer orders, revenue, and quick actions.

---

## 🛠️ Tech Stack

* **Backend:** Laravel 13 (PHP 8.2+), Laravel Sanctum, SQLite / MySQL, Eloquent ORM, Intervention Image.
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

# Create storage symlink (essential for public images)
php artisan storage:link

# Run the test suite to verify all 15 tests pass
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

Use the **1-click Demo Logins** on the login page (`/login`) or log in manually:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@ecommerce.com` | `password` | Global catalog control, store governance, and user provisioning |
| **Woodora Flagship Owner** | `woodora@ecommerce.com` | `password` | Woodora flagship interior collection, orders & listings |
| **Studio Artisan Boutique** | `partner@ecommerce.com` | `password` | Multi-tenant partner boutique browsing & retailing shared catalog items |

---

## 🧪 Automated Testing

Run the automated backend feature tests verifying catalog sharing, multi-tenancy, duplicate prevention, and customer visibility constraints:

```bash
cd backend
php artisan test
```

**Results:** `15 passed, 111 assertions (100% pass rate)`.
