# 🛍️ Small E-commerce Management System (Shared Catalog Engine)

A full-stack multi-vendor e-commerce management platform built with **Laravel 12** and **React 18 (Vite + Tailwind CSS)**.

This system implements a **Shared Product Catalog** architecture where administrators and shop owners collaborate on a shared global catalog. Shop owners can curate products for their independent storefronts with customized pricing, tailored titles/descriptions, and exclusive thumbnails. Customers only see products assigned to each specific shop.

---

## 🌟 Key Features & Requirements Matrix

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Admin Authentication** | Secure Sanctum token authentication with protected routes and role middleware. | ✅ Completed |
| **Shop Management (CRUD)** | Admins can create, view, update, delete, and reassign stores. | ✅ Completed |
| **Product Management (CRUD)** | Admins have full CRUD over the shared product catalog. | ✅ Completed |
| **Shop Owner Accounts** | Admins can create and manage shop owner credentials & assign stores. | ✅ Completed |
| **Shared Catalog Browsing** | Shop owners can browse global products created by Admin or other shop owners. | ✅ Completed |
| **Add Products to Shop** | Shop owners can select catalog products and list them in their own stores. | ✅ Completed |
| **Create Own Products** | Shop owners can create products that enter the shared catalog **and** their shop. | ✅ Completed |
| **Modify Shop Prices & Details** | Shop owners customize prices, descriptions, and thumbnails for their own shops. | ✅ Completed |
| **Customer Storefront Isolation** | Customers **only** see products assigned to a chosen shop. | ✅ Completed |
| **Display Shop-Specific Info** | Storefront displays customized prices, titles, and thumbnails with catalog fallbacks. | ✅ Completed |
| **Hidden Unassigned Products** | Catalog products not assigned to any shop are **strictly hidden** from customers. | ✅ Completed |
| **Customer Checkout** | Interactive shopping cart and order placement with instant order number generation. | ✅ Completed |

---

## 🏗️ Architecture & Shared Catalog Workflow

```
                        ┌────────────────────────────────────────┐
                        │      Shared Global Product Catalog     │
                        │  (Admin Created + Shop Owner Created)  │
                        └──────────────────┬─────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌────────────────────────┐                    ┌────────────────────────┐
       │   Store 1: Tech Haven  │                    │ Store 2: Urban Apparel │
       ├────────────────────────┤                    ├────────────────────────┤
       │ • AcousticPro Headset  │                    │ • Organic Cotton Tee   │
       │   (Custom: $249.99)    │                    │   (Catalog: $38.00)    │
       │ • Chronos Smartwatch   │                    │ • Chronos Smartwatch   │
       │   (Catalog: $199.99)   │                    │   (Custom: $185.00)    │
       └────────────┬───────────┘                    └────────────┬───────────┘
                    ▼                                             ▼
       Customer View (Tech Haven)                    Customer View (Urban Apparel)
       * Only Tech Haven products                    * Only Urban Apparel products
       * Tech Haven custom prices                    * Urban Apparel custom prices
```

---

## 💻 Technology Stack

- **Backend:**
  - PHP 8.2+ / 8.5
  - Laravel Framework 12 (v13.40.0)
  - Laravel Sanctum (API Token Authentication)
  - Database: SQLite (default zero-config) or MySQL
  - Pest / PHPUnit test suite (54 assertions)
- **Frontend:**
  - React 18 + Vite 6
  - Tailwind CSS 3.4
  - React Router DOM 6
  - Lucide React Icons
  - Axios (with auth interceptors & proxy)

---

## 🚀 Quick Start Guide (Fresh Setup)

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **PHP** >= 8.2 with `pdo_sqlite` (or `pdo_mysql`), `mbstring`, `fileinfo`, `gd`
- **Composer** (v2+)
- **Node.js** (v18+ or v20+) and **NPM**

---

### 2. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the environment configuration file:
   ```bash
   cp .env.example .env
   ```

3. Ensure the SQLite database file exists (zero configuration needed):
   ```bash
   touch database/database.sqlite
   ```
   *(Note: If you prefer MySQL, simply update `DB_CONNECTION=mysql`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `.env`)*

4. Install Composer dependencies:
   ```bash
   composer install
   ```

5. Generate the application encryption key:
   ```bash
   php artisan key:generate
   ```

6. Link the public storage directory:
   ```bash
   php artisan storage:link
   ```

7. Run database migrations and seeders:
   ```bash
   php artisan migrate:fresh --seed
   ```

8. Start the backend development server:
   ```bash
   php artisan serve --port=8000
   ```
   *The API will be live at `http://127.0.0.1:8000`.*

---

### 3. Frontend Setup

1. Open a **new terminal window** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the frontend environment file:
   ```bash
   cp .env.example .env
   ```

3. Install NPM dependencies:
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at: **`http://localhost:5173`**.*

---

### 4. Alternative 1-Command Startup

For evaluator convenience, you can start both servers simultaneously from the root folder:

```bash
# Make helper script executable (if needed)
chmod +x run.sh

# Run both backend and frontend servers together
./run.sh
```

---

## 🔑 Pre-Seeded Demo Accounts

The database seeder creates realistic demo data with accounts for immediate testing. You can also use the **Demo Switcher** dropdown in the top navigation bar to switch accounts in 1 click!

| Role | Name | Email | Password | Assigned Shop |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | System Administrator | `admin@ecommerce.com` | `password` | *All Stores Access* |
| **Shop Owner** | Alex Rivera | `owner1@ecommerce.com` | `password` | Tech Haven |
| **Shop Owner** | Sophia Chen | `owner2@ecommerce.com` | `password` | Urban Apparel & Lifestyle |
| **Shop Owner** | Marcus Vance | `owner3@ecommerce.com` | `password` | Nordic Living Essentials |

---

## 🧪 Running Automated Tests

A comprehensive feature test suite validates all candidate requirements, including authorization, shared catalog cross-tenant isolation, price overrides, and unassigned product exclusion:

```bash
cd backend
php artisan test
```

### Test Suite Output:
```text
PASS  Tests\Feature\EcommerceApiTest
✓ admin can login and access admin dashboard
✓ admin can manage shops crud
✓ admin can create shop owner account
✓ shop owner can create product and it is added to shared catalog and shop
✓ shop owner can add shared catalog product to shop and customize price and details
✓ customer view never shows unassigned catalog products
✓ customer can checkout and place order

Tests:    9 passed (54 assertions)
Duration: 0.54s
```

---

## 📖 Step-by-Step Functional Walkthrough

### 1. Customer View
1. Visit `http://localhost:5173`.
2. Browse the active stores (e.g., **Tech Haven**, **Urban Apparel & Lifestyle**, **Nordic Living Essentials**).
3. Click on **Tech Haven**:
   - Notice that the **AcousticPro Wireless Studio Edition** is displayed at **$249.99** with a *"Store Special Price"* badge (customized from catalog base price of $299.99).
   - Notice that unassigned prototype products (`CAT-UNASSIGNED-999`) **never appear** in any customer store.
4. Add items to cart and click **Proceed to Checkout**. Fill in delivery details to place an order and receive an order confirmation number.

### 2. Shop Owner Management
1. Log in as `owner1@ecommerce.com` (Alex Rivera) or use the **Demo Switcher**.
2. Go to **Shared Catalog**:
   - Browse products created by Admin, by yourself, or by other shop owners.
   - Click **"Create New Product"**: create a product (e.g. *"MagSafe Ultra Powerbank"*). It is automatically listed in your shop **and** added to the shared catalog.
   - Log in as another owner (e.g. `owner2@ecommerce.com`) and observe that they can now also see and add your new product!
3. Go to **My Listed Products**:
   - Click **"Customize"** on any product.
   - Override the store-specific price, custom title, details, or thumbnail.
   - Click **"Reset to Catalog Defaults"** at any time to restore the original catalog values.

### 3. Admin Panel
1. Log in as `admin@ecommerce.com` or use the **Demo Switcher**.
2. Visit **Admin Dashboard** (`/admin/dashboard`):
   - View system-wide stats: active shops, total catalog products, total shop owners, and revenue.
3. Manage **Stores** (`/admin/shops`): Create, edit, assign owners, or delete stores.
4. Manage **Shared Catalog** (`/admin/products`): Add new products to the shared catalog or edit existing products.
5. Manage **Shop Owners** (`/admin/users`): Create new shop owner accounts and assign them to stores.

---

## 📡 API Endpoints Reference

### Public Authentication
- `POST /api/auth/login` - User sign-in
- `POST /api/auth/register` - Shop owner registration with instant store creation
- `GET /api/auth/me` - Authenticated user profile
- `POST /api/auth/logout` - Revoke token

### Customer Storefront
- `GET /api/customer/shops` - List active shops
- `GET /api/customer/shops/{slug}` - Get shop profile
- `GET /api/customer/shops/{slug}/products` - List **only** products assigned to this shop (with customized prices and thumbnails)
- `GET /api/customer/shops/{slug}/products/{id}` - Single shop product detail
- `POST /api/customer/checkout` - Customer checkout & order placement

### Shop Owner Panel (`auth:sanctum`, `shop_owner`)
- `GET /api/shop-owner/dashboard` - Shop statistics
- `GET /api/shop-owner/my-shop` - Shop profile
- `PUT /api/shop-owner/my-shop` - Update shop info
- `GET /api/shop-owner/catalog` - Browse shared catalog
- `POST /api/shop-owner/catalog/create` - Create product (shared catalog + added to shop)
- `POST /api/shop-owner/catalog/add-to-shop` - Add catalog product to shop
- `GET /api/shop-owner/products` - List products in shop
- `PUT /api/shop-owner/products/{id}` - Modify shop price, details, thumbnail, or reset
- `DELETE /api/shop-owner/products/{id}` - Remove product from shop
- `GET /api/shop-owner/orders` - View customer orders
- `PUT /api/shop-owner/orders/{id}/status` - Update order status

### Admin Panel (`auth:sanctum`, `admin`)
- `GET /api/admin/dashboard` - Global platform statistics
- `apiResource('shops')` - CRUD `/api/admin/shops`
- `apiResource('products')` - CRUD `/api/admin/products` (shared catalog)
- `apiResource('users')` - CRUD `/api/admin/users` (shop owners)

---

## 🛡️ License

This project is created for the Technical Candidate Evaluation Task. Open source under the [MIT License](LICENSE).
