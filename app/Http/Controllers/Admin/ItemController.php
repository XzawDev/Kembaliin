<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ItemHistory;
use Inertia\Inertia;
use App\Enums\ReportStatus;

class ItemController extends Controller
{
    public function items(Request $request)
    {
        $query = Item::with('user', 'category', 'images');
        $query->withTrashed();

        if ($request->filled('handling_status')) {
            $query->where('handling_status', $request->handling_status);
        }
        if ($request->filled('report_type')) {
            $query->where('report_type', $request->report_type);
        }

        $items = $query->latest()->paginate(20);

        return Inertia::render('Officer/Items', [
            'items' => $items,
            'filters' => $request->only(['handling_status', 'report_type']),
        ]);
    }

    public function showItem(Item $item)
    {
        $item->load('user', 'category', 'images', 'histories.user');
        return Inertia::render('Officer/ItemDetail', [
            'item' => $item,
        ]);
    }

    public function updateItem(Request $request, Item $item)
    {
        $validated = $request->validate([
            'handling_status' => 'nullable|in:menunggu_penyerahan,dititipkan_petugas,diklaim,dikembalikan',
            'report_status' => 'nullable|in:aktif,selesai,ditutup',
            'verified_by' => 'nullable|exists:users,id',
        ]);

        $changes = [];
        foreach ($validated as $field => $newValue) {
            $oldValue = $item->getRawOriginal($field);
            if ($oldValue != $newValue) {
                $changes[] = "{$field}: '{$oldValue}' → '{$newValue}'";
            }
        }

        // Logika otomatis: jika handling_status diubah menjadi 'dikembalikan'
        if (isset($validated['handling_status']) && $validated['handling_status'] === 'dikembalikan') {
            $validated['report_status'] = ReportStatus::SELESAI->value;
            $validated['closed_at'] = now();
            $oldReportStatus = $item->getRawOriginal('report_status');
            $changes[] = "report_status: '{$oldReportStatus}' → '{$validated['report_status']}'";
            $changes[] = "closed_at: null → '{$validated['closed_at']}'";
        }

        // Logika baru: jika report_status diubah menjadi 'aktif', hapus closed_at
        if (isset($validated['report_status']) && $validated['report_status'] === 'aktif') {
            $validated['closed_at'] = null;
            $changes[] = "closed_at: '{$item->closed_at}' → null";
        }

        $item->update($validated);

        if (!empty($changes)) {
            ItemHistory::create([
                'item_id' => $item->id,
                'user_id' => Auth::id(),
                'action' => 'updated item status',
                'description' => implode(', ', $changes),
            ]);
        }

        return redirect()->back()->with('success', 'Item updated successfully.');
    }

    public function showItemByToken($token)
    {
        $item = Item::where('qr_code', $token)->firstOrFail();
        return redirect()->route('officer.items.show', $item->id);
    }
}