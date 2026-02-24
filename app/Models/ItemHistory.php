<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'user_id',
        'action',
        'description'
    ];

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

    // History milik satu item
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    // User yang melakukan aksi
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | ACTION CONSTANTS
    |--------------------------------------------------------------------------
    */

    public const ACTION_CREATED = 'created';
    public const ACTION_FOUND_REPORTED = 'found_reported';
    public const ACTION_SUBMITTED_TO_OFFICER = 'submitted_to_officer';
    public const ACTION_VERIFIED_BY_OFFICER = 'verified_by_officer';
    public const ACTION_CLAIMED = 'claimed';
    public const ACTION_CLAIM_APPROVED = 'claim_approved';
    public const ACTION_CLAIM_REJECTED = 'claim_rejected';
    public const ACTION_RETURNED = 'returned';
}