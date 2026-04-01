<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Category;
use App\Models\ItemHistory;
use Inertia\Inertia;
use App\Enums\ReportType;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_items' => Item::count(),
            'pending_handovers' => Item::where('handling_status', 'menunggu_penyerahan')->count(),
            'total_categories' => Category::count(),
            'recent_history' => ItemHistory::with('user')->latest()->limit(10)->get(),
        ];

        $recentItems = Item::with('user', 'category')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($item) {
                $item->display_status = $item->report_type === ReportType::HILANG
                    ? 'hilang'
                    : ($item->handling_status ?? 'menunggu_penyerahan');
                return $item;
            });

        return Inertia::render('Officer/Dashboard', [
            'stats' => $stats,
            'recentItems' => $recentItems,
        ]);
    }
}