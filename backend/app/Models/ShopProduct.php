<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    protected $casts = [
        'custom_price' => 'decimal:2',
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'effective_price',
        'effective_title',
        'effective_description',
        'effective_thumbnail_url',
        'is_customized',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getEffectivePriceAttribute(): float
    {
        if ($this->custom_price !== null && $this->custom_price !== '') {
            return (float) $this->custom_price;
        }
        return $this->product ? (float) $this->product->base_price : 0.00;
    }

    public function getEffectiveTitleAttribute(): string
    {
        if ($this->custom_title) {
            return $this->custom_title;
        }
        return $this->product ? $this->product->name : '';
    }

    public function getEffectiveDescriptionAttribute(): ?string
    {
        if ($this->custom_description) {
            return $this->custom_description;
        }
        return $this->product ? $this->product->description : null;
    }

    public function getEffectiveThumbnailUrlAttribute(): ?string
    {
        $thumb = $this->custom_thumbnail ?: ($this->product ? $this->product->thumbnail : null);
        if (!$thumb) {
            return null;
        }
        if (str_starts_with($thumb, 'http')) {
            return $thumb;
        }
        return url(Storage::url($thumb));
    }

    public function getIsCustomizedAttribute(): bool
    {
        return ($this->custom_price !== null)
            || !empty($this->custom_title)
            || !empty($this->custom_description)
            || !empty($this->custom_thumbnail);
    }
}
