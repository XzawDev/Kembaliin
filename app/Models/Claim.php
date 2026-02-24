<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = ['item_id', 'user_id', 'description', 'proof_image', 'status', 'verified_by'];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    // Barang yang diklaim
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    // Siswa yang klaim
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Petugas yang verifikasi
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /*
    |--------------------------------------------------------------------------
    | STATUS CONSTANTS
    |--------------------------------------------------------------------------
    */

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved()
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected()
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function verificationAnswers()
    {
        return $this->hasMany(ClaimVerificationAnswer::class);
    }

    // URL bukti gambar
    public function getProofImageUrlAttribute()
    {
        if (!$this->proof_image) {
            return null;
        }

        return asset('storage/' . $this->proof_image);
    }
}
