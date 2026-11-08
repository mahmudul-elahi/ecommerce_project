<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Administrator
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1 (555) 019-2834',
            'is_active' => true,
        ]);

        // 2. Create Shop Owners
        $owner1 = User::create([
            'name' => 'Alex Rivera',
            'email' => 'owner1@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'phone' => '+1 (555) 234-5678',
            'is_active' => true,
        ]);

        $owner2 = User::create([
            'name' => 'Sophia Chen',
            'email' => 'owner2@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'phone' => '+1 (555) 345-6789',
            'is_active' => true,
        ]);

        $owner3 = User::create([
            'name' => 'Marcus Vance',
            'email' => 'owner3@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'phone' => '+1 (555) 456-7890',
            'is_active' => true,
        ]);

        // 3. Create Shops
        $shop1 = Shop::create([
            'user_id' => $owner1->id,
            'name' => 'Tech Haven',
            'slug' => 'tech-haven',
            'description' => 'Your premier destination for high-end electronics, audio equipment, and smart computing accessories.',
            'logo' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
            'banner' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
            'email' => 'support@techhaven.store',
            'phone' => '+1 (555) 234-5678',
            'address' => '742 Evergreen Terrace, Silicon Valley, CA',
            'status' => 'active',
        ]);

        $shop2 = Shop::create([
            'user_id' => $owner2->id,
            'name' => 'Urban Apparel & Lifestyle',
            'slug' => 'urban-apparel',
            'description' => 'Curated modern fashion, sustainable everyday essentials, and urban travel accessories.',
            'logo' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
            'banner' => 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
            'email' => 'hello@urbanapparel.com',
            'phone' => '+1 (555) 345-6789',
            'address' => '120 Broadway Ave, New York, NY',
            'status' => 'active',
        ]);

        $shop3 = Shop::create([
            'user_id' => $owner3->id,
            'name' => 'Nordic Living Essentials',
            'slug' => 'nordic-living',
            'description' => 'Scandinavian minimalist home decor, ergonomic work gear, and aesthetic living goods.',
            'logo' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
            'banner' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
            'email' => 'care@nordicliving.co',
            'phone' => '+1 (555) 456-7890',
            'address' => '88 Fjord Way, Seattle, WA',
            'status' => 'active',
        ]);

        // 4. Create Shared Catalog Products
        // A) Created by Admin
        $prod1 = Product::create([
            'created_by' => $admin->id,
            'name' => 'AcousticPro Wireless Noise-Cancelling Headphones',
            'slug' => 'acousticpro-wireless-noise-cancelling-headphones',
            'sku' => 'CAT-AP-001',
            'category' => 'Electronics',
            'description' => 'Flagship active noise cancellation with 40-hour battery life, high-res audio codec support, and ultra-plush memory foam earcups.',
            'base_price' => 299.99,
            'thumbnail' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $prod2 = Product::create([
            'created_by' => $admin->id,
            'name' => 'Chronos Minimalist Smartwatch Series 4',
            'slug' => 'chronos-minimalist-smartwatch-series-4',
            'sku' => 'CAT-CH-002',
            'category' => 'Wearables',
            'description' => 'Sleek stainless steel chassis with AMOLED retina display, comprehensive health monitoring, ECG, and 7-day battery life.',
            'base_price' => 199.99,
            'thumbnail' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $prod3 = Product::create([
            'created_by' => $admin->id,
            'name' => 'Apex Mechanical Wireless Keyboard',
            'slug' => 'apex-mechanical-wireless-keyboard',
            'sku' => 'CAT-KB-003',
            'category' => 'Computing',
            'description' => 'Custom lubricated linear switches, CNC aluminum baseplate, PBT double-shot keycaps, and tri-mode Bluetooth / 2.4GHz connectivity.',
            'base_price' => 149.50,
            'thumbnail' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $prod4 = Product::create([
            'created_by' => $admin->id,
            'name' => 'ErgoStand Aircraft-Grade Aluminum Laptop Stand',
            'slug' => 'ergostand-aircraft-grade-aluminum-laptop-stand',
            'sku' => 'CAT-ST-004',
            'category' => 'Accessories',
            'description' => 'Foldable ergonomic riser engineered from sandblasted aerospace aluminum with dual silicone slip-guards and heat dissipation vents.',
            'base_price' => 49.99,
            'thumbnail' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        // B) Created by Shop Owner 1 (Alex Rivera) -> becomes available in shared catalog!
        $prod5 = Product::create([
            'created_by' => $owner1->id,
            'name' => 'VoltStream 100W GaN Fast Charger',
            'slug' => 'voltstream-100w-gan-fast-charger',
            'sku' => 'CAT-VS-005',
            'category' => 'Electronics',
            'description' => 'Compact gallium nitride charger capable of powering 4 devices simultaneously with dual 100W USB-C Power Delivery ports.',
            'base_price' => 59.99,
            'thumbnail' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $prod6 = Product::create([
            'created_by' => $owner1->id,
            'name' => 'Precision Glide RGB Gaming Mousepad (XXL)',
            'slug' => 'precision-glide-rgb-gaming-mousepad-xxl',
            'sku' => 'CAT-PG-006',
            'category' => 'Gaming',
            'description' => 'Extended desk mat with micro-woven cloth surface, anti-fray stitched borders, and customizable 14-mode RGB perimeter illumination.',
            'base_price' => 34.99,
            'thumbnail' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        // C) Created by Shop Owner 2 (Sophia Chen) -> also available in shared catalog!
        $prod7 = Product::create([
            'created_by' => $owner2->id,
            'name' => 'Heritage Heavyweight Organic Cotton Tee',
            'slug' => 'heritage-heavyweight-organic-cotton-tee',
            'sku' => 'CAT-HT-007',
            'category' => 'Apparel',
            'description' => '240 GSM organic ring-spun combed cotton. Boxy relaxed modern fit pre-shrunk for zero deformation wash after wash.',
            'base_price' => 38.00,
            'thumbnail' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $prod8 = Product::create([
            'created_by' => $owner2->id,
            'name' => 'AeroPack All-Weather Commuter Backpack',
            'slug' => 'aeropack-all-weather-commuter-backpack',
            'sku' => 'CAT-AP-008',
            'category' => 'Bags & Travel',
            'description' => 'Waterproof ballistic nylon construction with dedicated padded 16-inch laptop chamber, magnetic Fidlock buckles, and hidden passport pocket.',
            'base_price' => 119.00,
            'thumbnail' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        // D) Unassigned Product (in catalog but NOT in any shop!)
        // Critical requirement verification: "Products that are not assigned to any shop must not be visible to customers."
        $prodUnassigned = Product::create([
            'created_by' => $admin->id,
            'name' => 'Internal Prototype Holographic Display Device',
            'slug' => 'internal-prototype-holographic-display-device',
            'sku' => 'CAT-UNASSIGNED-999',
            'category' => 'Prototypes',
            'description' => 'Confidential lab prototype. This product is strictly unassigned to test that customers never see unassigned catalog products!',
            'base_price' => 9999.00,
            'thumbnail' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        // 5. Assign Products to Shops (with customizations to test requirements)

        // Shop 1 (Tech Haven):
        // 1. prod1 with CUSTOM price ($249.99 instead of $299.99) and custom title
        ShopProduct::create([
            'shop_id' => $shop1->id,
            'product_id' => $prod1->id,
            'custom_price' => 249.99,
            'custom_title' => 'Tech Haven Exclusive: AcousticPro Wireless Studio Edition',
            'custom_description' => 'Special holiday discounted edition with extra braided audio cable and premium hardshell travel case included exclusively at Tech Haven.',
            'custom_thumbnail' => null, // Inherits catalog thumbnail
            'stock' => 25,
            'is_active' => true,
        ]);

        // 2. prod2 (Smartwatch) with default catalog price
        ShopProduct::create([
            'shop_id' => $shop1->id,
            'product_id' => $prod2->id,
            'custom_price' => null,
            'custom_title' => null,
            'custom_description' => null,
            'custom_thumbnail' => null,
            'stock' => 40,
            'is_active' => true,
        ]);

        // 3. prod3 (Keyboard) with default catalog values
        ShopProduct::create([
            'shop_id' => $shop1->id,
            'product_id' => $prod3->id,
            'custom_price' => null,
            'custom_title' => null,
            'custom_description' => null,
            'custom_thumbnail' => null,
            'stock' => 15,
            'is_active' => true,
        ]);

        // 4. prod5 (VoltStream charger - created by owner1, listed in their shop)
        ShopProduct::create([
            'shop_id' => $shop1->id,
            'product_id' => $prod5->id,
            'custom_price' => null,
            'custom_title' => null,
            'custom_description' => null,
            'custom_thumbnail' => null,
            'stock' => 100,
            'is_active' => true,
        ]);

        // 5. prod6 (Mousepad - created by owner1, listed in their shop with custom promotional price)
        ShopProduct::create([
            'shop_id' => $shop1->id,
            'product_id' => $prod6->id,
            'custom_price' => 29.99, // discounted from 34.99
            'custom_title' => 'Precision Glide RGB XXL Desk Mat (Tech Haven Special)',
            'custom_description' => 'Tech Haven bundle: XXL gaming surface with high-speed woven texture and seamless RGB glow.',
            'custom_thumbnail' => null,
            'stock' => 50,
            'is_active' => true,
        ]);

        // Shop 2 (Urban Apparel):
        // 1. prod7 (Cotton Tee - created by owner2)
        ShopProduct::create([
            'shop_id' => $shop2->id,
            'product_id' => $prod7->id,
            'custom_price' => null,
            'custom_title' => null,
            'custom_description' => null,
            'custom_thumbnail' => null,
            'stock' => 80,
            'is_active' => true,
        ]);

        // 2. prod8 (AeroPack backpack - created by owner2)
        ShopProduct::create([
            'shop_id' => $shop2->id,
            'product_id' => $prod8->id,
            'custom_price' => null,
            'custom_title' => null,
            'custom_description' => null,
            'custom_thumbnail' => null,
            'stock' => 30,
            'is_active' => true,
        ]);

        // 3. prod2 (Smartwatch - added from shared catalog created by Admin, with custom shop price $185.00!)
        ShopProduct::create([
            'shop_id' => $shop2->id,
            'product_id' => $prod2->id,
            'custom_price' => 185.00,
            'custom_title' => 'Chronos Minimalist Watch (Urban Modern Edition)',
            'custom_description' => 'Paired with our genuine Italian leather band alternative, perfect for modern city professionals.',
            'custom_thumbnail' => null,
            'stock' => 20,
            'is_active' => true,
        ]);

        // Shop 3 (Nordic Living):
        // 1. prod4 (Laptop stand - created by Admin, customized in shop)
        ShopProduct::create([
            'shop_id' => $shop3->id,
            'product_id' => $prod4->id,
            'custom_price' => 45.00, // discounted from 49.99
            'custom_title' => 'Nordic ErgoStand Matte Silver Laptop Riser',
            'custom_description' => 'Aesthetic Scandinavian desk centerpiece crafted from satin-finish anodized aluminum.',
            'custom_thumbnail' => null,
            'stock' => 60,
            'is_active' => true,
        ]);

        // 2. prod7 (Cotton Tee - added from shared catalog created by Owner 2!)
        // Demonstrates requirement: cross-owner catalog sharing!
        ShopProduct::create([
            'shop_id' => $shop3->id,
            'product_id' => $prod7->id,
            'custom_price' => 42.00, // slightly higher price in Nordic boutique
            'custom_title' => 'Organic Loungewear Minimalist T-Shirt',
            'custom_description' => 'Ethically sourced organic cotton for slow living and cozy workspaces.',
            'custom_thumbnail' => null,
            'stock' => 25,
            'is_active' => true,
        ]);

        // 6. Create Demo Orders for realism
        $order1 = Order::create([
            'shop_id' => $shop1->id,
            'order_number' => 'ORD-'.strtoupper(Str::random(8)),
            'customer_name' => 'David Miller',
            'customer_email' => 'david.miller@gmail.com',
            'customer_phone' => '+1 (555) 789-0123',
            'shipping_address' => '450 Mission St, Suite 400, San Francisco, CA 94105',
            'total_amount' => 279.98,
            'status' => 'processing',
            'notes' => 'Please leave package at the front desk.',
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'shop_product_id' => 1,
            'product_name' => 'Tech Haven Exclusive: AcousticPro Wireless Studio Edition',
            'product_price' => 249.99,
            'quantity' => 1,
            'subtotal' => 249.99,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'shop_product_id' => 5,
            'product_name' => 'Precision Glide RGB XXL Desk Mat (Tech Haven Special)',
            'product_price' => 29.99,
            'quantity' => 1,
            'subtotal' => 29.99,
        ]);

        $order2 = Order::create([
            'shop_id' => $shop2->id,
            'order_number' => 'ORD-'.strtoupper(Str::random(8)),
            'customer_name' => 'Emily Watson',
            'customer_email' => 'emily.w@outlook.com',
            'customer_phone' => '+1 (555) 890-1234',
            'shipping_address' => '72 Park Ave, New York, NY 10016',
            'total_amount' => 157.00,
            'status' => 'completed',
            'notes' => 'Gift wrapping requested.',
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'shop_product_id' => 6,
            'product_name' => 'Heritage Heavyweight Organic Cotton Tee',
            'product_price' => 38.00,
            'quantity' => 1,
            'subtotal' => 38.00,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'shop_product_id' => 7,
            'product_name' => 'AeroPack All-Weather Commuter Backpack',
            'product_price' => 119.00,
            'quantity' => 1,
            'subtotal' => 119.00,
        ]);
    }
}
