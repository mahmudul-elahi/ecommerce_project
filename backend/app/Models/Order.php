<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'total_amount',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
