<?php

namespace App\Models;

use App\Enums\ReportType;
use App\Enums\ReportStatus;
use App\Enums\HandlingStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'report_type',
        'report_status',        // new column
        'name',
        'description',
        'location',
        'date',
        'qr_code',
        'handling_status',
        'verified_by',
        'closed_at',
    ];

    protected $casts = [
        'report_type'      => ReportType::class,
        'report_status'    => ReportStatus::class,
        'handling_status'  => HandlingStatus::class,
        'date'             => 'date',
        'closed_at' => 'datetime',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ItemImage::class);
    }

    public function claims()
    {
        return $this->hasMany(Claim::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function histories()
    {
        return $this->hasMany(ItemHistory::class);
    }

    // Status helpers
    public function isLost()
    {
        return $this->report_type === ReportType::HILANG;
    }

    public function isFound()
    {
        return $this->report_type === ReportType::DITEMUKAN;
    }

    public function isDititipkan()
    {
        return $this->handling_status === HandlingStatus::DITITIPKAN_PETUGAS;
    }

    public function isReturned()
    {
        return $this->handling_status === HandlingStatus::DIKEMBALIKAN;
    }

    // Scopes
    public function scopeLost($query)
    {
        return $query->where('report_type', ReportType::HILANG);
    }

    public function scopeFound($query)
    {
        return $query->where('report_type', ReportType::DITEMUKAN);
    }

    public function scopeAvailable($query)
    {
        return $query->where('handling_status', HandlingStatus::DITITIPKAN_PETUGAS);
    }
}