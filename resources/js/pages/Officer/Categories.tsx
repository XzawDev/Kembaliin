import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    items_count: number;
}

interface Props {
    categories: Category[];
}

export default function Categories({ categories }: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus kategori "${name}"? Semua item dengan kategori ini akan kehilangan kategori.`)) {
            router.delete(`/officer/categories/${id}`);
        }
    };

    return (
        <OfficerLayout>
            <Head title="Manajemen Kategori" />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Kategori Barang</h1>
                        <p className="mt-1 text-sm text-slate-500">Kelola kategori untuk laporan barang</p>
                    </div>
                    <Link
                        href="/officer/categories/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        Tambah Kategori
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead className="border-b border-slate-100 bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-400 uppercase">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-400 uppercase">Nama Kategori</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-400 uppercase">Jumlah Item</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-400 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-400">
                                            <Package className="mx-auto h-10 w-10 opacity-30" />
                                            <p className="mt-2 text-sm">Belum ada kategori. Buat kategori baru.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="group transition-colors hover:bg-slate-50/50">
                                            <td className="px-6 py-4 text-sm text-slate-500">#{category.id}</td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">{category.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{category.items_count}</td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <Link
                                                    href={`/officer/categories/${category.id}/edit`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                                                >
                                                    <Pencil size={14} /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    <Trash2 size={14} /> Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}
