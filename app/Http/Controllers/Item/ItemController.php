<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Enums\ReportType;
use App\Enums\ReportStatus;
use App\Models\ItemHistory;
use Illuminate\Support\Facades\Hash;

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
            'questions' => 'nullable|array',
            'questions.*.question' => 'required_with:questions|string',
            'questions.*.answer' => 'required_with:questions|string',
        ]);

        $dbReportType = $validated['report_type'] === 'lost' ? 'hilang' : 'ditemukan';
        $reportStatus = ReportStatus::AKTIF->value;

        $item = Item::create([
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'report_type' => $dbReportType,
            'report_status' => $reportStatus,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'date' => $validated['date'],
            'handling_status' => $validated['report_type'] === 'found' ? 'menunggu_penyerahan' : null,
        ]);

        // Upload gambar
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('item-images', 'public');
                $item->images()->create(['image_path' => $path]);
            }
        }

        if ($validated['report_type'] === 'found') {
            // Generate QR code
            $token = Str::uuid()->toString();
            $item->qr_code = $token;
            $item->save();

            // Simpan pertanyaan verifikasi
            $questions = $request->input('questions', []);
            $savedCount = 0;
            if (is_array($questions) && count($questions) > 0) {
                foreach ($questions as $q) {
                    if (!empty($q['question']) && !empty($q['answer'])) {
                        try {
                            $item->verificationQuestions()->create([
                                'question' => $q['question'],
                                'answer_hash' => Hash::make($q['answer']),
                            ]);
                            $savedCount++;
                        } catch (\Exception $e) {
                            \Log::error('Gagal simpan pertanyaan: ' . $e->getMessage());
                        }
                    }
                }
            }

            \Log::info('Found item created', [
                'item_id' => $item->id,
                'user_id' => Auth::id(),
                'report_type' => $item->report_type,
                'questions_received' => count($questions),
                'questions_saved' => $savedCount,
            ]);

            return redirect()->route('items.qr', $item->id)->with('success', 'Barang ditemukan berhasil dilaporkan. Tunjukkan QR code ke petugas.');
        }

        // Laporan barang hilang
        ItemHistory::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action' => 'created item',
            'description' => "Membuat laporan barang {$item->name} (Hilang)",
        ]);

        return redirect()->route('dashboard')->with('success', 'Laporan barang hilang berhasil dikirim.');
    }

    public function show($slug)
{
    $item = Item::where('slug', $slug)->firstOrFail();
    
    // Load relasi yang diperlukan
    $item->load(['user', 'category', 'images', 'histories.user', 'user:id,name,no_hp,kelas']);

    if ($item->trashed()) {
        abort(404);
    }

    // Hitung display_status untuk frontend
    if ($item->report_type === ReportType::HILANG) {
        $item->display_status = 'hilang';
    } else {
        $item->display_status = $item->handling_status ?? 'menunggu_penyerahan';
    }

    // Transformasi gambar
    $item->images->transform(function ($image) {
        $image->url = asset('storage/' . $image->image_path);
        return $image;
    });

    // Gunakan nama komponen yang sesuai dengan file React Anda (ItemDetail)
    return inertia('ItemDetail', ['item' => $item]);
}

    /**
     * Halaman detail item khusus untuk pemilik (dengan kontrol edit/hapus)
     */
    public function showForOwner(Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        $item->load(['user', 'category', 'images', 'histories.user']);
        $item->images->transform(fn($img) => ($img->url = asset('storage/' . $img->image_path)));

        if ($item->report_type === ReportType::HILANG) {
            $item->display_status = 'hilang';
        } else {
            $item->display_status = $item->handling_status ?? 'menunggu_penyerahan';
        }

        return Inertia::render('Siswa/ItemDetailOwner', [
            'item' => $item,
        ]);
    }

    public function edit(Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        $categories = Category::all();
        $item->load('category', 'images');

        $item->images->transform(function ($image) {
            $image->url = asset('storage/' . $image->image_path);
            return $image;
        });

        return Inertia::render('Items/Edit', [
            'item' => $item,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit laporan ini.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string|max:255',
            'date' => 'required|date',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'integer|exists:item_images,id',
        ]);

        $item->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'location' => $validated['location'],
            'date' => $validated['date'],
        ]);

        if (!empty($validated['deleted_images'])) {
            $item->images()->whereIn('id', $validated['deleted_images'])->delete();
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('item-images', 'public');
                $item->images()->create(['image_path' => $path]);
            }
        }

        ItemHistory::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action' => 'updated item',
            'description' => "Item '{$item->name}' telah diperbarui.",
        ]);

        return redirect()->route('items.show', $item->id)->with('success', 'Laporan berhasil diperbarui.');
    }

    public function destroy(Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus laporan ini.');
        }

        $item->delete();

        ItemHistory::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'action' => 'soft deleted by owner',
            'description' => "Item '{$item->name}' dihapus oleh pemilik.",
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil dihapus dari tampilan Anda dan publik.');
    }
}
