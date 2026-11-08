<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcommerceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_login_and_access_admin_dashboard(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@ecommerce.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user' => ['id', 'email', 'role']])
            ->assertJsonPath('user.role', 'admin');

        $token = $response->json('token');

        $dashboardResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard');

        $dashboardResponse->assertStatus(200)
            ->assertJsonStructure(['stats' => ['total_shops', 'total_products', 'total_orders']]);
    }

    public function test_admin_can_manage_shops_crud(): void
    {
        $admin = User::where('role', 'admin')->first();

        // 1. Create shop
        $createResponse = $this->actingAs($admin)
            ->postJson('/api/admin/shops', [
                'name' => 'Cyber Gadgets Emporium',
                'description' => 'Futuristic tech gear',
                'status' => 'active',
                'email' => 'contact@cybergadgets.com',
            ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('shop.name', 'Cyber Gadgets Emporium');

        $shopId = $createResponse->json('shop.id');

        // 2. Read shop
        $this->actingAs($admin)
            ->getJson("/api/admin/shops/{$shopId}")
            ->assertStatus(200)
            ->assertJsonPath('name', 'Cyber Gadgets Emporium');

        // 3. Update shop
        $this->actingAs($admin)
            ->putJson("/api/admin/shops/{$shopId}", [
                'name' => 'Cyber Gadgets & Beyond',
                'description' => 'Updated futuristic tech gear',
                'status' => 'active',
            ])
            ->assertStatus(200)
            ->assertJsonPath('shop.name', 'Cyber Gadgets & Beyond');

        // 4. Delete shop
        $this->actingAs($admin)
            ->deleteJson("/api/admin/shops/{$shopId}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('shops', ['id' => $shopId]);
    }

    public function test_admin_can_create_shop_owner_account(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)
            ->postJson('/api/admin/users', [
                'name' => 'New Partner',
                'email' => 'partner@test.com',
                'password' => 'secret123',
                'phone' => '+1 555-9999',
                'shop_name' => 'Partner Flagship Store',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('user.email', 'partner@test.com')
            ->assertJsonPath('user.role', 'shop_owner');

        $this->assertDatabaseHas('shops', ['name' => 'Partner Flagship Store']);
    }

    public function test_shop_owner_can_create_product_and_it_is_added_to_shared_catalog_and_shop(): void
    {
        $owner = User::where('email', 'owner1@ecommerce.com')->first();

        $response = $this->actingAs($owner)
            ->postJson('/api/shop-owner/catalog/create', [
                'name' => 'MagCharge Ultra Slim Powerbank',
                'sku' => 'MAG-10K',
                'category' => 'Electronics',
                'description' => 'Magnetic wireless power bank 10,000mAh with stand',
                'base_price' => 49.99,
                'custom_price' => 44.99, // Special introductory price for their own shop
                'stock' => 75,
            ]);

        $response->assertStatus(201);

        $productId = $response->json('product.id');

        // Verify product exists in shared catalog
        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'name' => 'MagCharge Ultra Slim Powerbank',
            'created_by' => $owner->id,
        ]);

        // Verify product is listed in the creator's shop
        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $owner->shop->id,
            'product_id' => $productId,
            'custom_price' => 44.99,
        ]);

        // Verify ANOTHER shop owner (owner2) sees it in the shared catalog!
        $owner2 = User::where('email', 'owner2@ecommerce.com')->first();
        $catalogResponse = $this->actingAs($owner2)
            ->getJson('/api/shop-owner/catalog?search=MagCharge');

        $catalogResponse->assertStatus(200);
        $this->assertTrue(collect($catalogResponse->json('data'))->contains('id', $productId));
    }

    public function test_shop_owner_can_add_shared_catalog_product_to_shop_and_customize_price_and_details(): void
    {
        $owner2 = User::where('email', 'owner2@ecommerce.com')->first();
        $shop = $owner2->shop;

        // Find a product created by admin that is not yet in owner2's shop
        $product = Product::where('sku', 'CAT-AP-001')->first();

        // 1. Add to shop
        $addResponse = $this->actingAs($owner2)
            ->postJson('/api/shop-owner/catalog/add-to-shop', [
                'product_id' => $product->id,
            ]);

        $addResponse->assertStatus(201);
        $shopProductId = $addResponse->json('shop_product.id');

        // 2. Customize price and title
        $updateResponse = $this->actingAs($owner2)
            ->putJson("/api/shop-owner/products/{$shopProductId}", [
                'custom_price' => 269.00,
                'custom_title' => 'Urban Sound AcousticPro Noise-Cancelling Headphones',
                'custom_description' => 'Specially selected for Urban Apparel audio lovers.',
            ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('listing.custom_price', '269.00')
            ->assertJsonPath('listing.custom_title', 'Urban Sound AcousticPro Noise-Cancelling Headphones');

        // 3. Customer sees the customized price and title in this shop!
        $customerResponse = $this->getJson("/api/customer/shops/{$shop->slug}/products");
        $customerResponse->assertStatus(200);

        $customerProduct = collect($customerResponse->json('data'))->firstWhere('shop_product_id', $shopProductId);
        $this->assertNotNull($customerProduct);
        $this->assertEquals('Urban Sound AcousticPro Noise-Cancelling Headphones', $customerProduct['name']);
        $this->assertEquals(269.00, $customerProduct['price']);
    }

    public function test_customer_view_never_shows_unassigned_catalog_products(): void
    {
        // Unassigned product SKU CAT-UNASSIGNED-999 is in shared catalog
        $unassigned = Product::where('sku', 'CAT-UNASSIGNED-999')->first();
        $this->assertNotNull($unassigned);

        // Fetch all active shops
        $shops = Shop::where('status', 'active')->get();

        foreach ($shops as $shop) {
            $response = $this->getJson("/api/customer/shops/{$shop->slug}/products");
            $response->assertStatus(200);

            $productIds = collect($response->json('data'))->pluck('product_id')->toArray();
            $this->assertNotContains($unassigned->id, $productIds, "Unassigned product should NEVER appear in shop: {$shop->name}");
        }
    }

    public function test_customer_can_checkout_and_place_order(): void
    {
        $shop = Shop::where('slug', 'tech-haven')->first();
        $shopProduct = ShopProduct::where('shop_id', $shop->id)->where('is_active', true)->first();

        $response = $this->postJson('/api/customer/checkout', [
            'shop_id' => $shop->id,
            'customer_name' => 'Alice Wonder',
            'customer_email' => 'alice@example.com',
            'customer_phone' => '+1 (555) 123-9999',
            'shipping_address' => '100 Sunset Blvd, Los Angeles, CA',
            'items' => [
                [
                    'shop_product_id' => $shopProduct->id,
                    'quantity' => 2,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'order' => ['id', 'order_number', 'total_amount', 'items']]);

        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Alice Wonder',
            'shop_id' => $shop->id,
        ]);
    }
}
