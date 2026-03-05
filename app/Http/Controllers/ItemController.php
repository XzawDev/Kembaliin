<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Enums\ReportType;

class ItemController extends Controller
{
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Items/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'report_type' => 'required|in:lost,found',
            'location' => 'required|string|max:255',
            'date' => 'required|date',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Map frontend values to database enum
        $dbReportType = $validated['report_type'] === 'lost' ? 'hilang' : 'ditemukan';
        $reportStatus = $validated['report_type'] === 'lost' ? 'dicari' : 'ditemukan';

        $itemData = [
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'report_type' => $dbReportType,
            'report_status' => $reportStatus,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'date' => $validated['date'],
            'handling_status' => $validated['report_type'] === 'found' ? 'menunggu_penyerahan' : null,
        ];

        $item = Item::create($itemData);

        // Generate QR code for found items
        if ($validated['report_type'] === 'found') {
            $token = Str::uuid()->toString();
            $item->qr_code = $token;
            $item->save();

            Log::info('Found item created', [
                'item_id' => $item->id,
                'user_id' => Auth::id(),
                'report_type' => $item->report_type,
            ]);
        }

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('item-images', 'public');
                $item->images()->create(['image_path' => $path]);
            }
        }

        if ($validated['report_type'] === 'found') {
            return redirect()->route('items.qr', $item->id)->with('success', 'Barang ditemukan berhasil dilaporkan. Tunjukkan QR code ke petugas.');
        }
        ItemHistory::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action' => 'created item',
            'description' => "Item '{$item->name}' reported as " . ($item->report_type === 'hilang' ? 'lost' : 'found'),
        ]);

        Log::info('Item created', [
            'id' => $item->id,
            'report_type' => $item->report_type,
            'report_status' => $item->report_status,
        ]);
        return redirect()->route('dashboard')->with('success', 'Laporan barang hilang berhasil dikirim.');
    }

    public function showQr(Item $item)
    {
        // Ensure the item belongs to the authenticated user
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke QR code ini.');
        }

        // Compare with the enum case
        if ($item->report_type !== ReportType::DITEMUKAN) {
            abort(403, 'QR code hanya tersedia untuk laporan barang ditemukan.');
        }

        // Generate verification URL
        $verificationUrl = route('officer.verifyHandover', $item->qr_code);

        // Generate QR code as SVG and convert to base64
        $qrCodeSvg = QrCode::format('svg')->size(300)->margin(1)->generate($verificationUrl);
        $qrCodeBase64 = base64_encode($qrCodeSvg);
        $qrCodeDataUri = 'data:image/svg+xml;base64,' . $qrCodeBase64;

        return Inertia::render('Items/QrCode', [
            'item' => $item,
            'qrCodeDataUri' => $qrCodeDataUri,
        ]);
    }

    public function generateQr($token)
    {
        try {
            $item = Item::where('qr_code', $token)->firstOrFail();

            // Generate QR code pointing to officer verification (SVG format)
            $verificationUrl = route('officer.items.by-token', $token);
            $qrCode = QrCode::format('svg')->size(300)->margin(1)->generate($verificationUrl);

            return response($qrCode)->header('Content-Type', 'image/svg+xml');
        } catch (\Exception $e) {
            Log::error('QR generation failed: ' . $e->getMessage());
            abort(404, 'QR code not found');
        }
    }
}
