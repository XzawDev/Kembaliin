// resources/js/pages/Items/AlreadyClaimed.tsx
import React from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import { AlertCircle, Phone, MessageCircle } from 'lucide-react';

interface Props {
    item: { id: number; slug: string; name: string };
    message: string;
    officer_contact?: string;
}

export default function AlreadyClaimed({ item, message, officer_contact = 'Hubungi petugas di kantor sekolah' }: Props) {
    return (
        <>
            <Head title={`Barang Sudah Diklaim - ${item.name}`} />
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-12">
                <div className="mx-auto max-w-2xl px-4">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <AlertCircle className="h-8 w-8 text-amber-600" />
                            <h1 className="text-2xl font-bold text-amber-800">Barang Sudah Diklaim</h1>
                        </div>
                        <p className="text-slate-700">{message}</p>
                        <div className="mt-6 space-y-3">
                            <div className="rounded-lg border border-amber-100 bg-white p-4">
                                <p className="text-sm font-medium text-slate-700">Langkah selanjutnya:</p>
                                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                                    <li>Hubungi petugas sekolah untuk verifikasi lebih lanjut</li>
                                    <li>Siapkan bukti kepemilikan barang (foto, ciri khas, dll)</li>
                                    <li>Petugas akan membantu menghubungkan dengan pengklaim jika diperlukan</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => router.visit(`/items/${item.slug}`)}
                                    className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                                >
                                    Kembali ke Detail Barang
                                </button>
                                <a
                                    href="https://wa.me/628123456789" // Ganti dengan nomor petugas
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white py-2 text-amber-700 hover:bg-amber-100"
                                >
                                    <MessageCircle size={18} /> Hubungi Petugas via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
