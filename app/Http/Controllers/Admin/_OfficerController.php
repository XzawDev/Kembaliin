<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Category;
use App\Models\ItemHistory;
use Illuminate\Http\Request;
use App\Enums\HandlingStatus;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Enums\ReportType;

class OfficerController extends Controller
{
    // Dashboard overview
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
                if ($item->report_type === ReportType::HILANG) {
                    $item->display_status = 'hilang';
                } else {
                    $item->display_status = $item->handling_status ?? 'menunggu_penyerahan';
                }
                return $item;
            });

        return Inertia::render('Officer/Dashboard', [
            'stats' => $stats,
            'recentItems' => $recentItems,
        ]);
    }

    // List all items with filtering
    public function items(Request $request)
    {
        $query = Item::with('user', 'category', 'images');

        // Filter by status
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

    // Show single item
    public function showItem(Item $item)
    {
        $item->load('user', 'category', 'images', 'histories.user');
        return Inertia::render('Officer/ItemDetail', [
            'item' => $item,
        ]);
    }

    // Find item by QR token and redirect to detail page
    public function showItemByToken($token)
    {
        $item = Item::where('qr_code', $token)->firstOrFail();
        return redirect()->route('officer.items.show', $item->id);
    }

    // Update item (e.g., change handling_status, report_status, verified_by)
    public function updateItem(Request $request, Item $item)
    {
        $validated = $request->validate([
            'handling_status' => 'nullable|in:menunggu_penyerahan,dititipkan_petugas,diklaim,dikembalikan',
            'report_status' => 'nullable|in:dicari,ditemukan,ditutup',
            'verified_by' => 'nullable|exists:users,id',
        ]);

        // Track changes using raw original values
        $changes = [];
        foreach ($validated as $field => $newValue) {
            $oldValue = $item->getRawOriginal($field); // gets the string from DB, not the casted enum
            if ($oldValue != $newValue) {
                $changes[] = "{$field}: '{$oldValue}' → '{$newValue}'";
            }
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

    // Category management
    public function categories()
    {
        $categories = Category::withCount('items')->get();
        return Inertia::render('Officer/Categories', [
            'categories' => $categories,
        ]);
    }

    public function createCategory()
    {
        return Inertia::render('Officer/CategoryForm');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        Category::create($validated);

        return redirect()->route('officer.categories')->with('success', 'Category created.');
    }

    public function editCategory(Category $category)
    {
        return Inertia::render('Officer/CategoryForm', [
            'category' => $category,
        ]);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($validated);

        return redirect()->route('officer.categories')->with('success', 'Category updated.');
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();
        return redirect()->route('officer.categories')->with('success', 'Category deleted.');
    }

    // History view
    public function history(Request $request)
    {
        $histories = ItemHistory::with('item', 'user')->when($request->item_id, fn($q) => $q->where('item_id', $request->item_id))->latest()->paginate(50);

        return Inertia::render('Officer/History', [
            'histories' => $histories,
        ]);
    }

    // QR verification page (camera)
    public function verifyQrPage()
    {
        return Inertia::render('Officer/VerifyQr');
    }

    // Verify handover and update status + verified_by
    public function verifyItemHandover(Request $request, Item $item)
    {
        // Compare using the enum case
        if ($item->handling_status !== HandlingStatus::MENUNGGU_PENYERAHAN) {
            return back()->with('error', 'Item is not waiting for handover.');
        }

        $item->handling_status = HandlingStatus::DITITIPKAN_PETUGAS; // set using enum
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
