<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Claim; // tambahkan
use App\Enums\ReportType;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Laporan user
        $totalLaporanHilang = Item::where('user_id', $user->id)->where('report_type', 'hilang')->count();
        $totalLaporanDitemukan = Item::where('user_id', $user->id)->where('report_type', 'ditemukan')->count();
        $totalLaporan = $totalLaporanHilang + $totalLaporanDitemukan;

        // Klaim user
        $totalKlaim = Claim::where('user_id', $user->id)->count();

        $stats = [
            'total_barang' => $totalLaporan + $totalKlaim, // total barang yang terkait user
            'barang_hilang' => $totalLaporanHilang,
            'barang_ditemukan' => $totalLaporanDitemukan,
            'pengajuan_klaim' => $totalKlaim,
        ];

        // Items (laporan terbaru) tetap
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

    // app/Http/Controllers/Siswa/DashboardController.php
    public function allReports(Request $request)
    {
        $user = Auth::user();

        $query = Item::with(['category'])
            ->where('user_id', $user->id)
            ->whereNull('deleted_at'); // hanya yang aktif

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $reports = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Siswa/AllReports', [
            'reports' => $reports,
        ]);
    }

    public function destroy(Item $item)
    {
        // Pastikan user adalah pemilik item
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus laporan ini.');
        }

        // Lakukan soft delete
        $item->delete();

        // Catat history (opsional)
        ItemHistory::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action' => 'soft deleted by owner',
            'description' => "Item '{$item->name}' dihapus oleh pemilik.",
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil dihapus dari tampilan Anda dan publik.');
    }
}
