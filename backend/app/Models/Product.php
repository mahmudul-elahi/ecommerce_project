<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'name',
        'slug',
        'sku',
        'category_id',
        'category',
        'description',
        'base_price',
        'thumbnail',
        'images',
        'is_active',
    ];

    protected $appends = ['thumbnail_url', 'images_urls'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'images' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function categoryRelation(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'shop_products')
            ->withPivot([
                'id',
                'custom_price',
                'custom_title',
                'custom_description',
                'custom_thumbnail',
                'custom_images',
                'stock',
                'is_active',
            ])
            ->withTimestamps();
    }

    protected function thumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                $raw = $this->thumbnail;
                if (!$raw && !empty($this->images) && is_array($this->images)) {
                    $raw = $this->images[0] ?? null;
                }

                if (! $raw) {
                    return null;
                }
                if (str_starts_with($raw, '/') || str_starts_with($raw, 'images/')) {
                    return $raw;
                }
                if (filter_var($raw, FILTER_VALIDATE_URL)) {
                    return $raw;
                }

                return Storage::disk('public')->url($raw);
            }
        );
    }

    protected function imagesUrls(): Attribute
    {
        return Attribute::make(
            get: function (): array {
                $list = $this->images;
                if (!is_array($list) || empty($list)) {
                    $thumb = $this->thumbnail_url;
                    return $thumb ? [$thumb] : [];
                }

                return array_map(function ($img) {
                    if (str_starts_with($img, '/') || str_starts_with($img, 'images/')) {
                        return $img;
                    }
                    if (filter_var($img, FILTER_VALIDATE_URL)) {
                        return $img;
                    }
                    return Storage::disk('public')->url($img);
                }, $list);
            }
        );
    }
}
