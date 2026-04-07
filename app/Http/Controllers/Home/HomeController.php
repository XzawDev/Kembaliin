<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Inertia\Inertia;
use App\Enums\ReportType;

class HomeController extends Controller
{
    public function index()
    {
$items = Item::with(['category', 'user', 'images'])
    ->whereNull('deleted_at')
    ->latest()
    ->limit(10)
    ->get()
    ->map(function ($item) {
        $reportTypeVal = $item->report_type instanceof ReportType ? $item->report_type->value : $item->report_type;

        if ($reportTypeVal === 'hilang') {
            $displayStatus = 'hilang';
        } else {
            $handlingStatusVal = $item->handling_status instanceof \App\Enums\HandlingStatus ? $item->handling_status->value : $item->handling_status;
            $displayStatus = $handlingStatusVal ?? 'menunggu_penyerahan';
        }

        $firstImage = $item->images->first();
        $imageUrl = $firstImage?->image_path ? asset('storage/' . $firstImage->image_path) : null;

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'name' => $item->name,
            'category' => ['name' => $item->category->name ?? 'Tanpa Kategori'],
            'location' => $item->location,
            'date' => $item->date,
            'display_status' => $displayStatus,
            'image_url' => $imageUrl,
            'user' => ['name' => $item->user->name ?? 'Anonim'],
        ];
    });

        $stats = [
            'total' => Item::count(),
            'hilang' => Item::where('report_type', 'hilang')->count(),
            'dititipkan' => Item::where('handling_status', 'dititipkan_petugas')->count(),
            'dikembalikan' => Item::where('handling_status', 'dikembalikan')->count(),
        ];

        return Inertia::render('Home', [
            'stats' => $stats,
            'items' => $items,
        ]);
    }
}
