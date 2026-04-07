// resources/js/pages/Items/ErrorKlaim.tsx
import React from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import { AlertCircle, ArrowLeft, XCircle } from 'lucide-react';

interface Props {
    item: { id: number; slug: string; name: string };
    message: string;
}

export default function ErrorKlaim({ item, message }: Props) {
    return (
        <>
            <Head title={`Klaim Error: ${item.name}`} />
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-8 md:pt-32 md:pb-12">
                <div className="mx-auto max-w-lg px-4 md:max-w-xl">
                    {/* Error Animation/Icon Header */}
                    <div className="mb-6 text-center md:mb-8">
                        <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 md:mb-4 md:h-20 md:w-20">
                            <XCircle className="h-8 w-8 text-red-600 md:h-12 md:w-12" />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Terjadi Kesalahan</h1>
                        <p className="mt-2 px-2 text-sm text-slate-600 md:px-4 md:text-base">
                            Gagal memproses klaim untuk <span className="font-semibold text-slate-800">"{item.name}"</span>
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-xl shadow-red-200/50">
                        {/* Message Section */}
                        <div className="border-b border-red-100 bg-red-50/50 p-4 md:p-6">
                            <div className="flex items-start gap-3 md:items-center">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 md:mt-0" />
                                <p className="text-sm leading-relaxed font-medium text-red-800 md:text-base">{message}</p>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="space-y-5 p-4 md:space-y-6 md:p-6">
                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Apa yang harus dilakukan?
                                </h3>
                                <div className="grid gap-2 md:gap-3">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="rounded-lg bg-slate-100 p-1.5 md:p-2">
                                            <AlertCircle className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <span className="text-sm md:text-base">
                                            Coba beberapa saat lagi atau hubungi petugas jika masalah berlanjut.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Kontak Bantuan
                                </h3>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 md:py-3.5 md:text-sm"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        Coba Lagi
                                    </button>

                                    <a
                                        href="https://wa.me/628123456789?text=Saya%20mengalami%20error%20saat%20klaim%20barang%20"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 transition-all hover:bg-red-100 active:scale-95 md:py-3.5 md:text-sm"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        Laporkan ke Petugas
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="border-t border-red-100 bg-red-50 p-4">
                            <button
                                onClick={() => router.visit(`/items/${item.slug}`)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98] md:px-6 md:py-4"
                            >
                                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm font-semibold md:text-base">Kembali ke Detail Barang</span>
                            </button>
                        </div>
                    </div>

                    <p className="mx-auto mt-6 max-w-[280px] text-center text-[10px] leading-relaxed text-slate-400 md:mt-8 md:max-w-none md:text-xs">
                        Jika masalah terus berlanjut, silakan hubungi petugas sekolah untuk bantuan lebih lanjut.
                    </p>
                </div>
            </div>
        </>
    );
}
