<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Officer/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'is_active']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:siswa,petugas,admin',
            'kelas' => 'nullable|string|max:50',
            'no_hp' => 'nullable|string|max:15',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        User::create($validated);

        return redirect()->back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6|confirmed',
            'role' => 'required|in:siswa,petugas,admin',
            'kelas' => 'nullable|string|max:50',
            'no_hp' => 'nullable|string|max:15',
            'is_active' => 'boolean',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }
        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }

    public function show(User $user)
{
    // Load relasi items dan claims
    $user->load(['items' => function($q) {
        $q->with('category')->latest()->limit(10);
    }, 'claims' => function($q) {
        $q->with('item')->latest()->limit(10);
    }]);

    // Tambahkan stats
    $stats = [
        'total_items' => $user->items()->count(),
        'total_claims' => $user->claims()->count(),
        'total_pending_claims' => $user->claims()->where('status', 'pending')->count(),
        'total_approved_claims' => $user->claims()->where('status', 'approved')->count(),
        'total_rejected_claims' => $user->claims()->where('status', 'rejected')->count(),
    ];

    return Inertia::render('Officer/Users/Show', [
        'user' => $user,
        'stats' => $stats,
        'items' => $user->items,
        'claims' => $user->claims,
    ]);
}
}
