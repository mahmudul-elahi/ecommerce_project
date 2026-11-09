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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Clean, authentic Furniro products and merchants with dynamic categories and multiple product images.
     */
    public function run(): void
    {
        // 0. Seed Spatie Roles for Multi-Role authorization
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'sanctum']);
        $shopOwnerRole = Role::firstOrCreate(['name' => 'shop_owner', 'guard_name' => 'sanctum']);
        $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'sanctum']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'sanctum']);

        // 1. Create Administrator
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1 (555) 019-2834',
            'is_active' => true,
        ]);
        $admin->assignRole($adminRole);

        // 2. Create Woodora Flagship Owner
        $furniroOwner = User::create([
            'name' => 'Woodora Design Studio',
            'email' => 'woodora@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'phone' => '+(84) 546-6789',
            'is_active' => true,
        ]);
        $furniroOwner->assignRole($shopOwnerRole);

        // 3. Create Multi-Tenant Partner Shop Owner (for marketplace catalog sharing)
        $partnerOwner = User::create([
            'name' => 'Studio Artisan Boutique',
            'email' => 'partner@ecommerce.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'phone' => '+1 (555) 345-6789',
            'is_active' => true,
        ]);
        $partnerOwner->assignRole($shopOwnerRole);

        // Helper to copy a source image asset directly into the public storage disk
        $storeAsset = function (string $sourceFileName, string $destinationPath): ?string {
            $sourceCandidates = [
                base_path('../frontend/public/images/furniro/' . $sourceFileName),
                public_path('images/furniro/' . $sourceFileName),
                base_path('public/images/furniro/' . $sourceFileName),
            ];

            $foundSource = null;
            foreach ($sourceCandidates as $candidate) {
                if (file_exists($candidate)) {
                    $foundSource = $candidate;
                    break;
                }
            }

            if ($foundSource) {
                Storage::disk('public')->put($destinationPath, file_get_contents($foundSource));
                return $destinationPath;
            }

            return null;
        };

        // Pre-store shop branding into storage/app/public/shops
        $woodoraLogo = $storeAsset('imgMeubelHouseLogos05.png', 'shops/logos/woodora.png');
        $woodoraBanner = $storeAsset('pageBanner.png', 'shops/banners/woodora.png');
        $artisanLogo = $storeAsset('imgMeubelHouseLogos05.png', 'shops/logos/artisan-living.png');
        $artisanBanner = $storeAsset('pageBanner.png', 'shops/banners/artisan-living.png');

        // 4. Create Flagship Woodora Store
        $furniroShop = Shop::create([
            'user_id' => $furniroOwner->id,
            'name' => 'Woodora Flagship Store',
            'slug' => 'woodora',
            'description' => 'Thoughtful interior collections, artisanal wooden furniture, and designer accents for modern spaces by Woodora.',
            'logo' => $woodoraLogo,
            'banner' => $woodoraBanner,
            'email' => 'hello@woodora.store',
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
            'logo' => $artisanLogo,
            'banner' => $artisanBanner,
            'email' => 'partner@furniro.store',
            'phone' => '+1 (555) 345-6789',
            'address' => '120 Broadway Ave, New York, NY',
            'status' => 'active',
        ]);

        // 6. Create Dynamic Categories Table Records stored in storage/app/public/categories
        $diningCatImg = $storeAsset('imgImage106.png', 'categories/dining.png');
        $livingCatImg = $storeAsset('imgImage100.png', 'categories/living.png');
        $bedroomCatImg = $storeAsset('imgImage101.png', 'categories/bedroom.png');

        $categoriesData = [
            [
                'name' => 'Dining',
                'slug' => 'dining',
                'description' => 'Curated dining tables, artisanal chairs, and dining sets.',
                'image' => $diningCatImg,
                'is_active' => true,
            ],
            [
                'name' => 'Living',
                'slug' => 'living',
                'description' => 'Handcrafted sofas, lounge chairs, and cozy living essentials.',
                'image' => $livingCatImg,
                'is_active' => true,
            ],
            [
                'name' => 'Bedroom',
                'slug' => 'bedroom',
                'description' => 'Peaceful bed sets, ambient night lamps, and bedroom storage.',
                'image' => $bedroomCatImg,
                'is_active' => true,
            ],
        ];

        $categoriesMap = [];
        foreach ($categoriesData as $c) {
            $cat = Category::create($c);
            $categoriesMap[$c['name']] = $cat;
        }

        // Pre-store product gallery imagery into storage/app/public/products
        $syltherineImg = $storeAsset('imgSyltherine.png', 'products/syltherine.png');
        $leviosaImg = $storeAsset('imgLeviosa.png', 'products/leviosa.png');
        $lolitoImg = $storeAsset('imgLolito.png', 'products/lolito.png');
        $respiraImg = $storeAsset('imgRespira.png', 'products/respira.png');
        $grifoImg = $storeAsset('imgGrifo.png', 'products/grifo.png');
        $muggoImg = $storeAsset('imgMuggo.png', 'products/muggo.png');
        $pingkyImg = $storeAsset('imgPingky.png', 'products/pingky.png');
        $pottyImg = $storeAsset('imgPotty.png', 'products/potty.png');
        $outdoorSofaImg = $storeAsset('imgOutdoorSofa.png', 'products/outdoor-sofa.png');
        $asgaardSofaImg = $storeAsset('imgAsgaardSofa.png', 'products/asgaard-sofa.png');
        $rectangle24Img = $storeAsset('imgRectangle24.png', 'products/rectangle24.png');

        // 7. Create Real Woodora Signature Collection stored in storage/app/public/products
        $furniroCatalog = [
            [
                'name' => 'Syltherine',
                'sku' => 'FUR-SYL-001',
                'category' => 'Dining',
                'description' => 'Stylish cafe chair crafted from premium oak with minimalist curves and durable ergonomic frame.',
                'base_price' => 3500000,
                'custom_price' => 2500000, // -30%
                'thumbnail' => $syltherineImg,
                'images' => array_values(array_filter([$syltherineImg, $leviosaImg, $outdoorSofaImg, $asgaardSofaImg])),
                'stock' => 35,
            ],
            [
                'name' => 'Leviosa',
                'sku' => 'FUR-LEV-002',
                'category' => 'Living',
                'description' => 'Stylish cafe chair with contemporary backrest and smooth natural finish.',
                'base_price' => 2500000,
                'custom_price' => null,
                'thumbnail' => $leviosaImg,
                'images' => array_values(array_filter([$leviosaImg, $syltherineImg, $lolitoImg, $outdoorSofaImg])),
                'stock' => 50,
            ],
            [
                'name' => 'Lolito',
                'sku' => 'FUR-LOL-003',
                'category' => 'Living',
                'description' => 'Luxury big sofa upholstered in water-repellent performance fabric with deep feather-down cushions.',
                'base_price' => 14000000,
                'custom_price' => 7000000, // -50%
                'thumbnail' => $lolitoImg,
                'images' => array_values(array_filter([$lolitoImg, $asgaardSofaImg, $outdoorSofaImg])),
                'stock' => 12,
            ],
            [
                'name' => 'Respira',
                'sku' => 'FUR-RES-004',
                'category' => 'Dining',
                'description' => 'Outdoor bar table and stool set built with weather-resistant teak and powder-coated steel.',
                'base_price' => 500000,
                'custom_price' => null,
                'thumbnail' => $respiraImg,
                'images' => array_values(array_filter([$respiraImg, $syltherineImg, $muggoImg])),
                'stock' => 45,
            ],
            [
                'name' => 'Grifo',
                'sku' => 'FUR-GRI-005',
                'category' => 'Bedroom',
                'description' => 'Night lamp with warm ambient diffused illumination, touch-dimming base, and brass accents.',
                'base_price' => 1500000,
                'custom_price' => null,
                'thumbnail' => $grifoImg,
                'images' => array_values(array_filter([$grifoImg, $pottyImg])),
                'stock' => 60,
            ],
            [
                'name' => 'Muggo',
                'sku' => 'FUR-MUG-006',
                'category' => 'Dining',
                'description' => 'Small artisan ceramic mug with matte handcrafted glaze and comfortable wide grip.',
                'base_price' => 150000,
                'custom_price' => null,
                'thumbnail' => $muggoImg,
                'images' => array_values(array_filter([$muggoImg, $grifoImg])),
                'stock' => 150,
            ],
            [
                'name' => 'Pingky',
                'sku' => 'FUR-PIN-007',
                'category' => 'Bedroom',
                'description' => 'Cute bed set made of 100% breathable organic bamboo linen in soft muted rose.',
                'base_price' => 14000000,
                'custom_price' => 7000000, // -50%
                'thumbnail' => $pingkyImg,
                'images' => array_values(array_filter([$pingkyImg, $rectangle24Img])),
                'stock' => 18,
            ],
            [
                'name' => 'Potty',
                'sku' => 'FUR-POT-008',
                'category' => 'Living',
                'description' => 'Minimalist flower pot engineered from lightweight composite stone with built-in drainage reservoir.',
                'base_price' => 500000,
                'custom_price' => null,
                'thumbnail' => $pottyImg,
                'images' => array_values(array_filter([$pottyImg, $grifoImg])),
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
            'thumbnail' => $syltherineImg,
            'images' => array_values(array_filter([$syltherineImg])),
            'is_active' => true,
        ]);
    }
}
