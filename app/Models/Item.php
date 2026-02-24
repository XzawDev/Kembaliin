<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\ItemStatus;
class Item extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'category_id', 'type', 'name', 'description', 'location', 'date', 'qr_code', 'status', 'verified_by'];

    protected $casts = [
        'status' => ItemStatus::class,
    ];
    
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    // Pemilik laporan (siswa yang membuat laporan)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Kategori barang
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Banyak gambar
    public function images()
    {
        return $this->hasMany(ItemImage::class);
    }

    // Banyak klaim
    public function claims()
    {
        return $this->hasMany(Claim::class);
    }

    // Petugas yang memverifikasi
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // History aktivitas
    public function histories()
    {
        return $this->hasMany(ItemHistory::class);
    }

    /*
    |--------------------------------------------------------------------------
    | STATUS HELPERS
    |--------------------------------------------------------------------------
    */

    public const STATUS_HILANG = 'hilang';
    public const STATUS_MENUNGGU = 'menunggu_penyerahan';
    public const STATUS_DITITIPKAN = 'dititipkan';
    public const STATUS_DIKLAIM = 'diklaim';
    public const STATUS_DIKEMBALIKAN = 'dikembalikan';

    public function isLost()
    {
        return $this->status === self::STATUS_HILANG;
    }

    public function isFound()
    {
        return $this->type === 'found';
    }

    public function isDititipkan()
    {
        return $this->status === self::STATUS_DITITIPKAN;
    }

    public function isReturned()
    {
        return $this->status === self::STATUS_DIKEMBALIKAN;
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES (untuk query mudah)
    |--------------------------------------------------------------------------
    */

    public function scopeLost($query)
    {
        return $query->where('type', 'lost');
    }

    public function verificationQuestions()
    {
        return $this->hasMany(ItemVerificationQuestion::class);
    }

    public function scopeFound($query)
    {
        return $query->where('type', 'found');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_DITITIPKAN);
    }
}
