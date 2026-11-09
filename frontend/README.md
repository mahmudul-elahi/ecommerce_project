# Furniro Storefront & Merchant Dashboard (Next.js Frontend)

Modern e-commerce storefront and multi-tenant management portal built with **Next.js 16 (React 19)**, **Tailwind CSS**, and **TanStack React Query**.

---

## 🛠️ Stack & Specifications

* **Framework:** Next.js 16 (App Router, Turbopack)
* **UI & Styling:** Tailwind CSS, Furniro Design System, BankDash Console Styling
* **Data Fetching:** TanStack React Query v5
* **Form Management:** React Hook Form + Zod
* **Icons & Notifications:** Lucide React, Sonner Toast Notifications

---

## 🚀 Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Environment configuration (Points to http://localhost:8000/api)
cp .env.example .env.local

# 3. Production build check
npm run build

# 4. Start development server (Runs on http://localhost:3000)
npm run dev
```

---

## 📂 Key Directory Structure

* `src/app/`: App router routes (Storefront, `/shop`, `/product/[id]`, `/cart`, `/checkout`, `/admin/*`, `/shop-owner/*`)
* `src/components/`: Modular UI components:
  * `product/`: Product cards, thumbnail galleries, specifications, filter bars
  * `merchant/`: Merchant cards, store headers, merchant grids
  * `dashboard/`: Reusable KPI cards, stats, tables
  * `common/`: Modals, drawers, navigation
* `src/hooks/`: Clean custom query & mutation hooks (`useCatalogQuery`, `useShopOwnerProductsQuery`, etc.)
* `src/api/`: Axios client & service layers with query invalidation

---

## 🔑 Demo Logins

Available as 1-click autofill buttons at `/login`:
* **Admin:** `admin@ecommerce.com` / `password`
* **Woodora Flagship:** `woodora@ecommerce.com` / `password`
* **Artisan Boutique:** `partner@ecommerce.com` / `password`
