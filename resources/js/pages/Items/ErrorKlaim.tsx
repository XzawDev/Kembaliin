// resources/js/pages/Items/ErrorKlaim.tsx
import React from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';

interface Props {
    item: { id: number; name: string };
    message: string;
}

export default function ErrorKlaim({ item, message }: Props) {
    return (
        <>
            <Head title={`Klaim Error: ${item.name}`} />
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-12">
                <div className="mx-auto max-w-2xl px-4">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                        <h1 className="mb-2 text-2xl font-bold">⚠️ Terjadi Kesalahan</h1>
                        <p className="text-slate-700">{message}</p>
                        <button
                            onClick={() => router.visit(`/items/${item.id}`)}
                            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            Kembali ke Detail Barang
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
