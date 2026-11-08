<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function shopProducts()
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function products()
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

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo) {
            return null;
        }
        if (str_starts_with($this->logo, 'http')) {
            return $this->logo;
        }
        return url(Storage::url($this->logo));
    }

    public function getBannerUrlAttribute(): ?string
    {
        if (!$this->banner) {
            return null;
        }
        if (str_starts_with($this->banner, 'http')) {
            return $this->banner;
        }
        return url(Storage::url($this->banner));
    }
}
