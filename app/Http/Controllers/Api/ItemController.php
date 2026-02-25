<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemImage;
use App\Models\ItemVerificationQuestion;
use App\Enums\ItemStatus;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ItemController extends Controller
{
    /**
     * Lihat semua item ditemukan
     */
    public function index()
    {
        $items = Item::with(['images', 'category', 'user'])
            ->latest()
            ->get();

        return response()->json($items);
    }

    /**
     * Detail item
     */
    public function show($id)
    {
        $item = Item::with(['images', 'category', 'user', 'verificationQuestions'])->findOrFail($id);

        return response()->json($item);
    }

    /**
     * Verifikasi QR Code oleh petugas
     */
    public function verifyQr($qrToken)
    {
        $item = Item::where('qr_token', $qrToken)->first();

        if (!$item) {
            return response()->json(
                [
                    'message' => 'QR Code tidak valid',
                ],
                404,
            );
        }

        // hanya bisa diverifikasi jika status MENUNGGU_PENYERAHAN
        if ($item->status !== \App\Enums\ItemStatus::MENUNGGU_PENYERAHAN) {
            return response()->json(
                [
                    'message' => 'Barang sudah diverifikasi sebelumnya',
                    'status' => $item->status->value,
                ],
                400,
            );
        }

        // update status
        $item->status = \App\Enums\ItemStatus::DITITIPKAN;
        $item->save();
        $item->addHistory('ITEM_VERIFIED', 'Barang dititipkan ke petugas');

        return response()->json([
            'message' => 'Barang berhasil diverifikasi dan dititipkan ke petugas',
            'item' => $item,
        ]);
    }

    /**
     * Membuat laporan barang ditemukan
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string',
            'found_date' => 'required|date',
            'images.*' => 'image|max:5120',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.answer' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // 1️⃣ Buat item dulu
            $item = Item::create([
                'user_id' => auth()->id(),
                'category_id' => $request->category_id,
                'name' => $request->name,
                'description' => $request->description,
                'location' => $request->location,
                'found_date' => $request->found_date,
                'status' => ItemStatus::MENUNGGU_PENYERAHAN,
                'qr_token' => Str::uuid(),
            ]);

            // 🔥 Tambahkan history DI SINI
            $item->addHistory('ITEM_CREATED', 'Item ditemukan dan dilaporkan');

            // 2️⃣ Upload images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('items', 'public');

                    ItemImage::create([
                        'item_id' => $item->id,
                        'image_path' => $path,
                    ]);
                }
            }

            // 3️⃣ Simpan verification questions
            foreach ($request->questions as $q) {
                ItemVerificationQuestion::create([
                    'item_id' => $item->id,
                    'question' => $q['question'],
                    'answer_hash' => Hash::make($q['answer']),
                ]);
            }

            DB::commit();

            return response()->json(
                [
                    'message' => 'Item berhasil dibuat',
                    'item' => $item->load('images', 'verificationQuestions'),
                ],
                201,
            );
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(
                [
                    'message' => 'Gagal membuat item',
                    'error' => $e->getMessage(),
                ],
                500,
            );
        }
    }

    /**
     * Petugas menyerahkan barang ke pemilik
     */
    public function completeReturn($id)
    {
        $item = Item::findOrFail($id);

        // optional: pastikan status sudah DIKLAIM
        if ($item->status !== ItemStatus::DIKLAIM) {
            return response()->json(
                [
                    'message' => 'Barang belum diklaim',
                ],
                400,
            );
        }

        // update status
        $item->status = ItemStatus::SUDAH_DIKEMBALIKAN;
        $item->save();

        // 🔥 Tambahkan history DI SINI
        $item->addHistory('ITEM_RETURNED', 'Barang dikembalikan ke pemilik');

        return response()->json([
            'message' => 'Barang berhasil dikembalikan',
        ]);
    }
}
