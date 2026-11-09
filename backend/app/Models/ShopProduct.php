<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ShopProduct extends Model
{
    use HasFactory;

    protected $table = 'shop_products';

    protected $fillable = [
        'shop_id',
        'product_id',
        'custom_price',
        'custom_title',
        'custom_description',
        'custom_thumbnail',
        'custom_images',
        'stock',
        'is_active',
    ];

    protected $appends = [
        'effective_price',
        'effective_title',
        'effective_description',
        'effective_thumbnail_url',
        'effective_images_urls',
        'is_customized',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'custom_price' => 'decimal:2',
            'custom_images' => 'array',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected function effectivePrice(): Attribute
    {
        return Attribute::make(
            get: function (): float {
                if ($this->custom_price !== null && $this->custom_price !== '') {
                    return (float) $this->custom_price;
                }

                return $this->product ? (float) $this->product->base_price : 0.00;
            }
        );
    }

    protected function effectiveTitle(): Attribute
    {
        return Attribute::make(
            get: function (): string {
                if ($this->custom_title) {
                    return (string) $this->custom_title;
                }

                return $this->product ? (string) $this->product->name : '';
            }
        );
    }

    protected function effectiveDescription(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                if ($this->custom_description) {
                    return $this->custom_description;
                }

                return $this->product ? $this->product->description : null;
            }
        );
    }

    protected function effectiveThumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                $raw = $this->custom_thumbnail;
                if (!$raw && !empty($this->custom_images) && is_array($this->custom_images)) {
                    $raw = $this->custom_images[0] ?? null;
                }
                if (!$raw) {
                    $raw = $this->product ? $this->product->thumbnail_url : null;
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

    protected function effectiveImagesUrls(): Attribute
    {
        return Attribute::make(
            get: function (): array {
                if (is_array($this->custom_images) && !empty($this->custom_images)) {
                    return array_map(function ($img) {
                        if (str_starts_with($img, '/') || str_starts_with($img, 'images/')) {
                            return $img;
                        }
                        if (filter_var($img, FILTER_VALIDATE_URL)) {
                            return $img;
                        }
                        return Storage::disk('public')->url($img);
                    }, $this->custom_images);
                }

                return $this->product ? $this->product->images_urls : [];
            }
        );
    }

    protected function isCustomized(): Attribute
    {
        return Attribute::make(
            get: function (): bool {
                return $this->custom_price !== null
                    || ! empty($this->custom_title)
                    || ! empty($this->custom_description)
                    || ! empty($this->custom_thumbnail)
                    || ! empty($this->custom_images);
            }
        );
    }
}
