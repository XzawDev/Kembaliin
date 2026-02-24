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

            // 1️ Buat item
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

            // 2️ Upload images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('items', 'public');

                    ItemImage::create([
                        'item_id' => $item->id,
                        'image_path' => $path,
                    ]);
                }
            }

            // 3️ Simpan verification questions
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
}
