<?php

namespace Database\Seeders;

use App\Models\Category;
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
     * Clean, authentic Furniro products and merchants with dynamic categories and multiple product images.
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

        // 2. Create Furniro Flagship Owner
        $furniroOwner = User::create([
            'name' => 'Furniro Design Studio',
            'email' => 'furniro@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'phone' => '+(84) 546-6789',
            'is_active' => true,
        ]);

        // 3. Create Multi-Tenant Partner Shop Owner (for marketplace catalog sharing)
        $partnerOwner = User::create([
            'name' => 'Studio Artisan Boutique',
            'email' => 'partner@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'phone' => '+1 (555) 345-6789',
            'is_active' => true,
        ]);

        // 4. Create Flagship Furniro Store
        $furniroShop = Shop::create([
            'user_id' => $furniroOwner->id,
            'name' => 'Furniro Flagship Store',
            'slug' => 'furniro',
            'description' => 'Thoughtful interior collections, artisanal wooden furniture, and designer accents for modern spaces.',
            'logo' => '/images/furniro/imgMeubelHouseLogos05.png',
            'banner' => '/images/furniro/pageBanner.png',
            'email' => 'hello@furniro.store',
            'phone' => '+(84) 546-6789',
            'address' => '400 University Drive Suite 200 Coral Gables, FL 33134 USA',
            'status' => 'active',
        ]);

        // 5. Create Partner Boutique Store (Demonstrates multi-tenancy requirement)
        $partnerShop = Shop::create([
            'user_id' => $partnerOwner->id,
            'name' => 'Artisan Living Boutique',
            'slug' => 'artisan-living',
            'description' => 'Handcrafted Scandinavian home essentials, ergonomic chairs, and sustainable accents.',
            'logo' => '/images/furniro/imgMeubelHouseLogos05.png',
            'banner' => '/images/furniro/pageBanner.png',
            'email' => 'partner@furniro.store',
            'phone' => '+1 (555) 345-6789',
            'address' => '120 Broadway Ave, New York, NY',
            'status' => 'active',
        ]);

        // 6. Create Dynamic Categories Table Records (Figma Browse The Range)
        $categoriesData = [
            [
                'name' => 'Dining',
                'slug' => 'dining',
                'description' => 'Curated dining tables, artisanal chairs, and dining sets.',
                'image' => '/images/furniro/imgImage106.png',
                'is_active' => true,
            ],
            [
                'name' => 'Living',
                'slug' => 'living',
                'description' => 'Handcrafted sofas, lounge chairs, and cozy living essentials.',
                'image' => '/images/furniro/imgImage100.png',
                'is_active' => true,
            ],
            [
                'name' => 'Bedroom',
                'slug' => 'bedroom',
                'description' => 'Peaceful bed sets, ambient night lamps, and bedroom storage.',
                'image' => '/images/furniro/imgImage101.png',
                'is_active' => true,
            ],
        ];

        $categoriesMap = [];
        foreach ($categoriesData as $c) {
            $cat = Category::create($c);
            $categoriesMap[$c['name']] = $cat;
        }

        // 7. Create Real Furniro Signature Collection with Multiple Product Images
        $furniroCatalog = [
            [
                'name' => 'Syltherine',
                'sku' => 'FUR-SYL-001',
                'category' => 'Dining',
                'description' => 'Stylish cafe chair crafted from premium oak with minimalist curves and durable ergonomic frame.',
                'base_price' => 3500000,
                'custom_price' => 2500000, // -30%
                'thumbnail' => '/images/furniro/imgSyltherine.png',
                'images' => [
                    '/images/furniro/imgSyltherine.png',
                    '/images/furniro/imgLeviosa.png',
                    '/images/furniro/imgOutdoorSofa.png',
                    '/images/furniro/imgAsgaardSofa.png',
                ],
                'stock' => 35,
            ],
            [
                'name' => 'Leviosa',
                'sku' => 'FUR-LEV-002',
                'category' => 'Living',
                'description' => 'Stylish cafe chair with contemporary backrest and smooth natural finish.',
                'base_price' => 2500000,
                'custom_price' => null,
                'thumbnail' => '/images/furniro/imgLeviosa.png',
                'images' => [
                    '/images/furniro/imgLeviosa.png',
                    '/images/furniro/imgSyltherine.png',
                    '/images/furniro/imgLolito.png',
                    '/images/furniro/imgOutdoorSofa.png',
                ],
                'stock' => 50,
            ],
            [
                'name' => 'Lolito',
                'sku' => 'FUR-LOL-003',
                'category' => 'Living',
                'description' => 'Luxury big sofa upholstered in water-repellent performance fabric with deep feather-down cushions.',
                'base_price' => 14000000,
                'custom_price' => 7000000, // -50%
                'thumbnail' => '/images/furniro/imgLolito.png',
                'images' => [
                    '/images/furniro/imgLolito.png',
                    '/images/furniro/imgAsgaardSofa.png',
                    '/images/furniro/imgOutdoorSofa.png',
                ],
                'stock' => 12,
            ],
            [
                'name' => 'Respira',
                'sku' => 'FUR-RES-004',
                'category' => 'Dining',
                'description' => 'Outdoor bar table and stool set built with weather-resistant teak and powder-coated steel.',
                'base_price' => 500000,
                'custom_price' => null,
                'thumbnail' => '/images/furniro/imgRespira.png',
                'images' => [
                    '/images/furniro/imgRespira.png',
                    '/images/furniro/imgSyltherine.png',
                    '/images/furniro/imgMuggo.png',
                ],
                'stock' => 45,
            ],
            [
                'name' => 'Grifo',
                'sku' => 'FUR-GRI-005',
                'category' => 'Bedroom',
                'description' => 'Night lamp with warm ambient diffused illumination, touch-dimming base, and brass accents.',
                'base_price' => 1500000,
                'custom_price' => null,
                'thumbnail' => '/images/furniro/imgGrifo.png',
                'images' => [
                    '/images/furniro/imgGrifo.png',
                    '/images/furniro/imgPotty.png',
                ],
                'stock' => 60,
            ],
            [
                'name' => 'Muggo',
                'sku' => 'FUR-MUG-006',
                'category' => 'Dining',
                'description' => 'Small artisan ceramic mug with matte handcrafted glaze and comfortable wide grip.',
                'base_price' => 150000,
                'custom_price' => null,
                'thumbnail' => '/images/furniro/imgMuggo.png',
                'images' => [
                    '/images/furniro/imgMuggo.png',
                    '/images/furniro/imgImage106.png',
                ],
                'stock' => 150,
            ],
            [
                'name' => 'Pingky',
                'sku' => 'FUR-PIN-007',
                'category' => 'Bedroom',
                'description' => 'Cute bed set made of 100% breathable organic bamboo linen in soft muted rose.',
                'base_price' => 14000000,
                'custom_price' => 7000000, // -50%
                'thumbnail' => '/images/furniro/imgPingky.png',
                'images' => [
                    '/images/furniro/imgPingky.png',
                    '/images/furniro/imgRectangle24.png',
                    '/images/furniro/imgImage101.png',
                ],
                'stock' => 18,
            ],
            [
                'name' => 'Potty',
                'sku' => 'FUR-POT-008',
                'category' => 'Living',
                'description' => 'Minimalist flower pot engineered from lightweight composite stone with built-in drainage reservoir.',
                'base_price' => 500000,
                'custom_price' => null,
                'thumbnail' => '/images/furniro/imgPotty.png',
                'images' => [
                    '/images/furniro/imgPotty.png',
                    '/images/furniro/imgGrifo.png',
                ],
                'stock' => 80,
            ],
        ];

        foreach ($furniroCatalog as $item) {
            $cat = $categoriesMap[$item['category']] ?? null;

            $product = Product::create([
                'created_by' => $furniroOwner->id,
                'name' => $item['name'],
                'slug' => Str::slug($item['name']),
                'sku' => $item['sku'],
                'category_id' => $cat ? $cat->id : null,
                'category' => $item['category'],
                'description' => $item['description'],
                'base_price' => $item['base_price'],
                'thumbnail' => $item['thumbnail'],
                'images' => $item['images'],
                'is_active' => true,
            ]);

            // Assign to Furniro Flagship Store
            ShopProduct::create([
                'shop_id' => $furniroShop->id,
                'product_id' => $product->id,
                'custom_price' => $item['custom_price'],
                'custom_title' => $item['name'],
                'custom_description' => $item['description'],
                'custom_thumbnail' => $item['thumbnail'],
                'custom_images' => $item['images'],
                'stock' => $item['stock'],
                'is_active' => true,
            ]);
        }

        // 8. Assign a shared catalog item to Partner Store to demonstrate multi-tenant listing customization
        $sharedSyltherine = Product::where('sku', 'FUR-SYL-001')->first();
        ShopProduct::create([
            'shop_id' => $partnerShop->id,
            'product_id' => $sharedSyltherine->id,
            'custom_price' => 2700000, // custom price in partner boutique
            'custom_title' => 'Artisan Living Syltherine Cafe Chair',
            'custom_description' => 'Specially selected natural oak edition curated for Artisan Living.',
            'custom_thumbnail' => $sharedSyltherine->thumbnail,
            'custom_images' => $sharedSyltherine->images,
            'stock' => 20,
            'is_active' => true,
        ]);

        // 9. Unassigned Catalog Product (Strictly unassigned to verify requirement:
        // "Products that are not assigned to any shop must not be visible to customers.")
        Product::create([
            'created_by' => $admin->id,
            'name' => 'Confidential Artisan Prototype Drafting Table',
            'slug' => 'confidential-artisan-prototype-drafting-table',
            'sku' => 'CAT-UNASSIGNED-999',
            'category_id' => null,
            'category' => 'Prototypes',
            'description' => 'Internal studio prototype. Strictly unassigned to test that customers never see unassigned catalog products!',
            'base_price' => 9999999,
            'thumbnail' => '/images/furniro/imgSyltherine.png',
            'images' => ['/images/furniro/imgSyltherine.png'],
            'is_active' => true,
        ]);
    }
}
