<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemVerificationQuestion extends Model
{
    use HasFactory;

    protected $table = 'item_verification_questions';

    protected $fillable = [
        'item_id',
        'question',
        'answer_hash',
    ];

    protected $hidden = [
        'answer_hash', // agar tidak ikut terkirim ke frontend
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    // Pertanyaan ini milik 1 item
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    // Jawaban dari claim
    public function claimAnswers()
    {
        return $this->hasMany(ClaimVerificationAnswer::class, 'question_id');
    }
}