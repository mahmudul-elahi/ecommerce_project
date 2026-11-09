# Furniro & Woodora E-Commerce API (Laravel Backend)

RESTful API backend powering the multi-tenant Furniro & Woodora e-commerce platform.

---

## 🛠️ Stack & Specifications

* **Framework:** Laravel 13 (PHP 8.2+)
* **Authentication:** Laravel Sanctum (Bearer Token)
* **Image Processing:** Intervention Image with WebP optimization & memory management
* **Database:** SQLite / MySQL with Eloquent ORM
* **Testing:** PHPUnit / Pest Feature Test Suite (15 tests, 111 assertions)

---

## 🚀 Setup & Execution

```bash
# 1. Install dependencies
composer install

# 2. Environment configuration
cp .env.example .env
php artisan key:generate

# 3. Database initialization & dynamic seeding
touch database/database.sqlite
php artisan migrate:fresh --seed

# 4. Storage symlink (Serves seeded category, product, and shop imagery)
php artisan storage:link

# 5. Run tests
php artisan test

# 6. Start API server
php artisan serve
```

---

## 🧪 Test Suite

Run the full automated test suite:

```bash
php artisan test
```

Verifies:
* Multi-tenant shop creation & isolated scoping.
* Shared catalog creation, discovery, and merchant store listing.
* Exclusion of already-added items from the shared catalog by default.
* Duplicate listing prevention (HTTP 422).
* Strict customer visibility constraint: unassigned catalog products are never visible to customers.
* Product details multiple-image gallery and pricing calculations.

---

## 🔑 Default Seeded Accounts

* **Administrator:** `admin@ecommerce.com` / `password`
* **Woodora Flagship Owner:** `woodora@ecommerce.com` / `password`
* **Studio Artisan Boutique:** `partner@ecommerce.com` / `password`
