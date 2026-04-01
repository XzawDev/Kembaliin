<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Inertia\Inertia;

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
                // Compute display status for frontend
                if ($item->report_type === 'hilang') {
                    $item->display_status = 'hilang';
                } else {
                    $item->display_status = $item->handling_status ?? 'menunggu_penyerahan';
                }
                // Get first image URL if exists
                $item->image_url = $item->images->first()?->image_path 
                    ? asset('storage/' . $item->images->first()->image_path) 
                    : 'https://images.unsplash.com/placeholder.jpg'; // fallback
                return $item;
            });

        $stats = [
            'total'        => Item::count(),
            'hilang'       => Item::where('report_type', 'hilang')->count(),
            'dititipkan'   => Item::where('handling_status', 'dititipkan_petugas')->count(),
            'dikembalikan' => Item::where('handling_status', 'dikembalikan')->count(),
        ];

        return Inertia::render('Home', [
            'stats' => $stats,
            'items' => $items,
        ]);
    }
}