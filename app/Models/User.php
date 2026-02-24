<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    // User membuat banyak item
    public function items()
    {
        return $this->hasMany(Item::class);
    }

    // User membuat banyak claim
    public function claims()
    {
        return $this->hasMany(Claim::class);
    }

    // User sebagai petugas yang memverifikasi item
    public function verifiedItems()
    {
        return $this->hasMany(Item::class, 'verified_by');
    }

    // User sebagai petugas yang memverifikasi claim
    public function verifiedClaims()
    {
        return $this->hasMany(Claim::class, 'verified_by');
    }

    // History aktivitas user
    public function histories()
    {
        return $this->hasMany(ItemHistory::class);
    }

    /*
    |--------------------------------------------------------------------------
    | ROLE HELPERS
    |--------------------------------------------------------------------------
    */

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isPetugas()
    {
        return $this->role === 'petugas';
    }

    public function isSiswa()
    {
        return $this->role === 'siswa';
    }
}
