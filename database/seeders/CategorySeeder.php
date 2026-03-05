<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Elektronik',
            'Aksesoris',
            'Pakaian',
            'Buku & Alat Tulis',
            'Tas',
            'Dompet',
            'Kunci',
            'Botol Minum',
            'Sepatu',
            'Lainnya',
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
            ]);
        }
    }
}