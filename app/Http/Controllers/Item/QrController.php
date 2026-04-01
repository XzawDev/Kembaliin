<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Enums\ReportType;

class QrController extends Controller
{
    /**
     * Tampilkan halaman QR code untuk item yang ditemukan (milik user yang login)
     */
    public function showQr(Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke QR code ini.');
        }

        if ($item->report_type !== ReportType::DITEMUKAN) {
            abort(403, 'QR code hanya tersedia untuk laporan barang ditemukan.');
        }

        $verificationUrl = route('officer.items.by-token', $item->qr_code);
        $qrCodeSvg = QrCode::format('svg')->size(300)->margin(1)->generate($verificationUrl);
        $qrCodeBase64 = base64_encode($qrCodeSvg);
        $qrCodeDataUri = 'data:image/svg+xml;base64,' . $qrCodeBase64;

        return Inertia::render('Items/QrCode', [
            'item' => $item,
            'qrCodeDataUri' => $qrCodeDataUri,
        ]);
    }

    /**
     * Generate gambar QR code (digunakan untuk <img src=""> atau download)
     */
    public function generateQr($token)
    {
        try {
            $item = Item::where('qr_code', $token)->firstOrFail();
            $verificationUrl = route('officer.items.by-token', $token);
            $qrCode = QrCode::format('svg')->size(300)->margin(1)->generate($verificationUrl);

            return response($qrCode)->header('Content-Type', 'image/svg+xml');
        } catch (\Exception $e) {
            Log::error('QR generation failed: ' . $e->getMessage());
            abort(404, 'QR code not found');
        }
    }
}