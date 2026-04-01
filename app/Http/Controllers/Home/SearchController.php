<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\ReportType;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['category', 'images']);

        // Keyword search (name or description)
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->whereNull('deleted_at')
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Report type (lost/found)
        if ($request->filled('report_type')) {
            $query->where('report_type', $request->report_type);
        }

        // Location (partial match)
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $items = $query->latest()->paginate(12)->withQueryString();

        // Add display fields for frontend
       $items->getCollection()->transform(function ($item) {
            // Correct enum comparison
            if ($item->report_type === ReportType::HILANG) {
                $item->display_status = 'hilang';
            } else {
                $item->display_status = $item->handling_status ?? 'menunggu_penyerahan';
            }
            $item->image_url = $item->images->first()?->image_path
                ? asset('storage/' . $item->images->first()->image_path)
                : 'https://images.unsplash.com/placeholder.jpg';
            return $item;
        });

        $categories = Category::all();

        return Inertia::render('Search', [
            'items'      => $items,
            'filters'    => $request->only(['keyword', 'category_id', 'report_type', 'location', 'date_from', 'date_to']),
            'categories' => $categories,
        ]);
    }
}