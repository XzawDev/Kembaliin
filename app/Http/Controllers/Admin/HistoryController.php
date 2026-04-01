<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ItemHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function history(Request $request)
    {
        $histories = ItemHistory::with(['item' => function ($query) {
            $query->withTrashed(); // sertakan item yang sudah dihapus
        }, 'user'])
            ->when($request->item_id, fn($q) => $q->where('item_id', $request->item_id))
            ->latest()
            ->paginate(50);

        // Transformasi deskripsi menjadi kalimat yang lebih manusiawi
        $histories->getCollection()->transform(function ($history) {
            $desc = $history->description;

            switch ($history->action) {
                case 'created item':
                    if (str_contains($desc, 'reported as lost')) {
                        preg_match("/Item '([^']+)'/", $desc, $matches);
                        $itemName = $matches[1] ?? 'barang';
                        $history->description = "Membuat laporan baru untuk barang '{$itemName}' dengan status Hilang.";
                    } elseif (str_contains($desc, 'reported as found')) {
                        preg_match("/Item '([^']+)'/", $desc, $matches);
                        $itemName = $matches[1] ?? 'barang';
                        $history->description = "Membuat laporan baru untuk barang '{$itemName}' dengan status Ditemukan.";
                    } else {
                        $history->description = "Membuat laporan baru.";
                    }
                    break;

                case 'updated item':
                    preg_match("/Item '([^']+)'/", $desc, $matches);
                    $itemName = $matches[1] ?? 'barang';
                    $history->description = "Memperbarui informasi laporan untuk barang '{$itemName}'.";
                    break;

                case 'updated item status':
                    // Ubah deskripsi seperti "handling_status: 'menunggu_penyerahan' → 'dititipkan_petugas'"
                    // menjadi kalimat yang mudah dibaca
                    $history->description = $this->formatStatusChange($desc);
                    break;

                case 'handed over to officer':
                    preg_match("/Item '([^']+)'/", $desc, $matches);
                    $itemName = $matches[1] ?? 'barang';
                    $history->description = "Melakukan serah terima barang '{$itemName}' kepada petugas. Status menjadi Dititipkan Petugas.";
                    break;

                case 'soft deleted by owner':
                    preg_match("/Item '([^']+)'/", $desc, $matches);
                    $itemName = $matches[1] ?? 'barang';
                    $history->description = "Pemilik menghapus laporan barang '{$itemName}'. Laporan tidak lagi ditampilkan di publik.";
                    break;

                default:
                    // Jika tidak ada pola, biarkan deskripsi asli (mungkin sudah bagus)
                    break;
            }

            return $history;
        });

        return Inertia::render('Officer/History', [
            'histories' => $histories,
        ]);
    }

    /**
     * Format perubahan status menjadi kalimat yang mudah dibaca
     * Contoh input: "handling_status: 'menunggu_penyerahan' → 'dititipkan_petugas'"
     * Output: "Mengubah status penanganan dari 'Menunggu Penyerahan' menjadi 'Dititipkan Petugas'."
     */
    private function formatStatusChange(string $description): string
    {
        $parts = explode(', ', $description);
        $sentences = [];

        foreach ($parts as $part) {
            // Pola: field: 'old' → 'new'
            if (preg_match('/(\w+): \'([^\']+)\' → \'([^\']+)\'/', $part, $matches)) {
                $field = $matches[1];
                $oldValue = $matches[2];
                $newValue = $matches[3];

                $fieldLabel = $this->getFieldLabel($field);
                $oldLabel = $this->getStatusLabel($field, $oldValue);
                $newLabel = $this->getStatusLabel($field, $newValue);

                $sentences[] = "Mengubah {$fieldLabel} dari '{$oldLabel}' menjadi '{$newLabel}'.";
            }
            // Pola untuk closed_at (penambahan waktu tutup)
            elseif (preg_match('/closed_at: null → \'([^\']+)\'/', $part, $matches)) {
                $date = date('d/m/Y H:i', strtotime($matches[1]));
                $sentences[] = "Menutup laporan pada tanggal {$date}.";
            }
        }

        if (empty($sentences)) {
            // Fallback: jika tidak ada pola yang cocok, kembalikan deskripsi asli
            return $description;
        }

        return implode(' ', $sentences);
    }

    /**
     * Mendapatkan label field dalam bahasa Indonesia
     */
    private function getFieldLabel(string $field): string
    {
        return match ($field) {
            'handling_status' => 'status penanganan',
            'report_status' => 'status laporan',
            'verified_by' => 'petugas verifikasi',
            default => $field,
        };
    }

    /**
     * Mendapatkan label nilai status dalam bahasa Indonesia
     */
    private function getStatusLabel(string $field, string $value): string
    {
        if ($field === 'handling_status') {
            return match ($value) {
                'menunggu_penyerahan' => 'Menunggu Penyerahan',
                'dititipkan_petugas' => 'Dititipkan Petugas',
                'diklaim' => 'Diklaim',
                'dikembalikan' => 'Dikembalikan',
                default => $value,
            };
        }

        if ($field === 'report_status') {
            return match ($value) {
                'aktif' => 'Aktif',
                'selesai' => 'Selesai',
                'ditutup' => 'Ditutup',
                default => $value,
            };
        }

        return $value;
    }
}