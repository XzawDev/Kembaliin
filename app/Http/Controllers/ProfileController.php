<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $kelasList = [
            'X DPIB', 'X RPL', 'X TKJ', 'X PSPT', 'X UPW', 'X TKKR', 'X TB', 'X DKV', 'X ANM', 'X KKBT', 'X KKKI', 'X KKKR',
            'XI DPIB', 'XI RPL', 'XI TKJ', 'XI PSPT', 'XI UPW', 'XI TKKR', 'XI TB', 'XI DKV', 'XI ANM', 'XI KKBT', 'XI KKKI', 'XI KKKR',
            'XII DPIB', 'XII RPL', 'XII TKJ', 'XII PSPT', 'XII UPW', 'XII TKKR', 'XII TB', 'XII DKV', 'XII ANM', 'XII KKBT', 'XII KKKI', 'XII KKKR',
            'Admin', // opsional untuk petugas
        ];

        return Inertia::render('Profile/Edit', [
            'user' => $user,
            'kelasList' => $kelasList,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $rules = [
            'name' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:15',
            'kelas' => 'nullable|string|max:50',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => 'nullable|string|min:6|confirmed',
        ];

        // Jika password diisi, wajib isi current_password
        if ($request->filled('password')) {
            $rules['current_password'] = 'required|string|current_password';
        }

        $validated = $request->validate($rules);

        // Update data tanpa email (email tidak bisa diubah)
        $user->name = $validated['name'];
        $user->no_hp = $validated['no_hp'] ?? null;
        $user->kelas = $validated['kelas'] ?? null;

        // Update password jika diisi
        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        // Upload foto profil
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $path = $request->file('photo')->store('profile-photos', 'public');
            $user->foto = $path;
        }

        $user->save();

        return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
    }
}