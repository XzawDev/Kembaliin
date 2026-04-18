<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $kelasList = [
            'X DPIB', 'X RPL', 'X TKJ', 'X PSPT', 'X UPW', 'X TKKR', 'X TB', 'X DKV', 'X ANM', 'X KKBT', 'X KKKI', 'X KKKR',
            'XI DPIB', 'XI RPL', 'XI TKJ', 'XI PSPT', 'XI UPW', 'XI TKKR', 'XI TB', 'XI DKV', 'XI ANM', 'XI KKBT', 'XI KKKI', 'XI KKKR',
            'XII DPIB', 'XII RPL', 'XII TKJ', 'XII PSPT', 'XII UPW', 'XII TKKR', 'XII TB', 'XII DKV', 'XII ANM', 'XII KKBT', 'XII KKKI', 'XII KKKR',
        ];
        // Jika role bukan siswa, tambahkan opsi Admin (opsional)
        if ($user->role !== 'siswa') {
            $kelasList[] = 'Admin';
        }

        return Inertia::render('Siswa/Settings', [
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
        ];

        // Jika ada input password baru, maka validasi current_password
        if ($request->filled('new_password')) {
            $rules['current_password'] = 'required|string|current_password';
            $rules['new_password'] = 'required|string|min:6|confirmed';
        }

        $validated = $request->validate($rules);

        // Update data dasar
        $user->name = $validated['name'];
        $user->no_hp = $validated['no_hp'] ?? $user->no_hp;
        $user->kelas = $validated['kelas'] ?? $user->kelas;

        // Update password jika ada
        if ($request->filled('new_password')) {
            $user->password = Hash::make($validated['new_password']);
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