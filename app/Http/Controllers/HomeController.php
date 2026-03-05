<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [

            'stats' => [
                'total' => Item::count(),
                'hilang' => Item::where('status', 'hilang')->count(),
                'dititipkan' => Item::where('status', 'dititipkan')->count(),
                'dikembalikan' => Item::where('status', 'dikembalikan')->count(),
            ],

            'items' => Item::with(['category', 'user'])
                ->latest()
                ->limit(10)
                ->get()
        ]);
    }
}