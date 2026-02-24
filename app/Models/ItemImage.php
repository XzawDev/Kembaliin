<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemImage extends Model
{
    use HasFactory;

    protected $fillable = ['item_id', 'image_path'];

    /*
    |--------------------------------------------------------------------------
    | RELATION
    |--------------------------------------------------------------------------
    */

    // Gambar milik satu item
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER
    |--------------------------------------------------------------------------
    */

    // URL lengkap gambar
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }
}
