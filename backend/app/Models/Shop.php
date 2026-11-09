<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'logo',
        'banner',
        'email',
        'phone',
        'address',
        'status',
    ];

    protected $appends = ['logo_url', 'banner_url'];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'shop_products')
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

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    protected function logoUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                if (! $this->logo) {
                    return null;
                }
                if (str_starts_with($this->logo, '/') || str_starts_with($this->logo, 'images/')) {
                    return $this->logo;
                }
                if (filter_var($this->logo, FILTER_VALIDATE_URL)) {
                    return $this->logo;
                }

                return Storage::disk('public')->url($this->logo);
            }
        );
    }

    protected function bannerUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                if (! $this->banner) {
                    return null;
                }
                if (str_starts_with($this->banner, '/') || str_starts_with($this->banner, 'images/')) {
                    return $this->banner;
                }
                if (filter_var($this->banner, FILTER_VALIDATE_URL)) {
                    return $this->banner;
                }

                return Storage::disk('public')->url($this->banner);
            }
        );
    }
}
