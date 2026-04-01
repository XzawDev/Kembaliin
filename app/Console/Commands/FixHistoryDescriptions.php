<?php

namespace App\Console\Commands;

use App\Models\ItemHistory;
use Illuminate\Console\Command;

class FixHistoryDescriptions extends Command
{
    protected $signature = 'history:fix-descriptions';
    protected $description = 'Perbaiki deskripsi history agar lebih mudah dibaca';

    public function handle()
    {
        $histories = ItemHistory::all();
        $count = 0;

        foreach ($histories as $history) {
            $original = $history->description;
            $new = $original;

            if (str_contains($original, 'soft deleted by owner')) {
                preg_match("/Item '([^']+)'/", $original, $matches);
                $itemName = $matches[1] ?? 'barang';
                $new = "Pemilik menghapus laporan barang {$itemName} (tidak tampil di publik)";
            }
            elseif (str_contains($original, 'reported as lost')) {
                preg_match("/Item '([^']+)'/", $original, $matches);
                $itemName = $matches[1] ?? 'barang';
                $new = "Membuat laporan barang {$itemName} (Hilang)";
            }
            elseif (str_contains($original, 'reported as found')) {
                preg_match("/Item '([^']+)'/", $original, $matches);
                $itemName = $matches[1] ?? 'barang';
                $new = "Membuat laporan barang {$itemName} (Ditemukan)";
            }
            elseif (str_contains($original, 'updated item') && !str_contains($original, 'status')) {
                preg_match("/Item '([^']+)'/", $original, $matches);
                $itemName = $matches[1] ?? 'barang';
                $new = "Memperbarui laporan barang {$itemName}";
            }
            elseif (str_contains($original, 'handed over to officer')) {
                preg_match("/Item '([^']+)'/", $original, $matches);
                $itemName = $matches[1] ?? 'barang';
                $new = "Menyerahkan barang {$itemName} ke petugas (status: Dititipkan Petugas)";
            }

            if ($new !== $original) {
                $history->description = $new;
                $history->save();
                $count++;
                $this->info("Fixed: {$original} -> {$new}");
            }
        }

        $this->info("Selesai. Total {$count} history diperbaiki.");
    }
}
