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
        'stock',
        'is_active',
    ];

    protected $appends = [
        'effective_price',
        'effective_title',
        'effective_description',
        'effective_thumbnail_url',
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
                $raw = $this->custom_thumbnail ?: ($this->product ? $this->product->thumbnail : null);
                if (! $raw) {
                    return null;
                }
                if (filter_var($raw, FILTER_VALIDATE_URL)) {
                    return $raw;
                }

                return Storage::disk('public')->url($raw);
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
                    || ! empty($this->custom_thumbnail);
            }
        );
    }
}
