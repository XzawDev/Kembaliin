<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClaimVerificationAnswer extends Model
{
    use HasFactory;

    protected $table = 'claim_verification_answers';

    protected $fillable = [
        'claim_id',
        'question_id',
        'answer',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    // Jawaban ini milik 1 claim
    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }

    // Jawaban ini untuk 1 pertanyaan
    public function question()
    {
        return $this->belongsTo(ItemVerificationQuestion::class, 'question_id');
    }
}