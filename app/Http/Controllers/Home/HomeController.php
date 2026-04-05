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
                // Ambil nilai string dari Enum (atau langsung string jika tidak di-cast)
                $reportTypeVal = $item->report_type instanceof ReportType ? $item->report_type->value : $item->report_type;

                // Compute display status for frontend
                if ($reportTypeVal === 'hilang') {
                    $item->display_status = 'hilang';
                } else {
                    $handlingStatusVal = $item->handling_status instanceof \App\Enums\HandlingStatus ? $item->handling_status->value : $item->handling_status;

                    $item->display_status = $handlingStatusVal ?? 'menunggu_penyerahan';
                }

                // Get first image URL if exists
                $firstImage = $item->images->first();
                $item->image_url = $firstImage?->image_path ? asset('storage/' . $firstImage->image_path) : 'https://images.unsplash.com/placeholder.jpg'; // fallback

                return $item;
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
