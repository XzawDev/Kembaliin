<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Enums\ReportType;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Stats – only for this user
        $stats = [
            'total' => Item::where('user_id', $user->id)->count(),
            'hilang' => Item::where('user_id', $user->id)->where('report_type', 'hilang')->count(),
            'dititipkan' => Item::where('user_id', $user->id)->where('handling_status', 'dititipkan_petugas')->count(),
            'dikembalikan' => Item::where('user_id', $user->id)->where('handling_status', 'dikembalikan')->count(),
        ];

        // Items – only for this user
        $items = Item::with(['category', 'user'])
            ->where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($item) {
                if ($item->isLost()) {
                    $item->display_status = 'hilang';
                } else {
                    $item->display_status = $item->handling_status ?? 'menunggu_penyerahan';
                }
                return $item;
            });

        return Inertia::render('Siswa/Dashboard', [
            'stats' => $stats,
            'items' => $items,
        ]);
    }
}
