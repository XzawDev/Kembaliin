<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\HandlingStatus;
use Inertia\Inertia;

class QrVerificationController extends Controller
{
    public function verifyQrPage()
    {
        return Inertia::render('Officer/VerifyQr');
    }

    public function verifyItemHandover(Request $request, Item $item)
    {
        if ($item->handling_status !== HandlingStatus::MENUNGGU_PENYERAHAN) {
            return back()->with('error', 'Item is not waiting for handover.');
        }

        $item->handling_status = HandlingStatus::DITITIPKAN_PETUGAS;
        $item->verified_by = Auth::id();
        $item->save();

        ItemHistory::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action' => 'handed over to officer',
            'description' => "Item '{$item->name}' verified and handed over.",
        ]);

        return redirect()->route('officer.items.show', $item->id)->with('success', 'Item verified and handed over.');
    }
}