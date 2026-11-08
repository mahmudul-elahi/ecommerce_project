<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    protected $casts = [
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $appends = ['thumbnail_url'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function shopProducts()
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function shops()
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

    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            return null;
        }
        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }
        return url(Storage::url($this->thumbnail));
    }
}
