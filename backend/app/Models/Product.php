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
        'category',
        'description',
        'base_price',
        'thumbnail',
        'is_active',
    ];

    protected $appends = ['thumbnail_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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
                'stock',
                'is_active',
            ])
            ->withTimestamps();
    }

    protected function thumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->thumbnail) {
                    return null;
                }
                if (filter_var($this->thumbnail, FILTER_VALIDATE_URL)) {
                    return $this->thumbnail;
                }

                return Storage::disk('public')->url($this->thumbnail);
            }
        );
    }
}
