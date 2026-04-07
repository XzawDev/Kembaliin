// resources/js/pages/Items/GagalKlaim.tsx
import React from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import { XCircle, ArrowLeft, AlertCircle, PackageX, HelpCircle, MessageCircle, RefreshCw } from 'lucide-react';

interface Props {
    item: { id: number; name: string; slug?: string };
    message: string;
}

export default function GagalKlaim({ item, message }: Props) {
    const handleBack = () => {
        router.visit(`/items/${item.slug || item.id}`);
    };

    const handleRetry = () => {
        if (item.slug) {
            router.visit(`/claim/${item.slug}`);
        } else {
            router.visit(`/claim/${item.id}`);
        }
    };

    const getWhatsAppLink = () => {
        const baseUrl = window.location.origin;
        const itemUrl = `${baseUrl}/items/${item.slug || item.id}`;
        const text = `Halo petugas, saya mengalami kegagalan klaim untuk barang berikut:%0A%0A*Nama Barang:* ${item.name}%0A*Link Detail:* ${itemUrl}%0A%0ASaya mohon bantuan untuk verifikasi manual. Terima kasih.`;
        return `https://wa.me/6285135858211?text=${text}`;
    };

    return (
        <>
            <Head title={`Klaim Gagal: ${item.name}`} />
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-8 md:pt-32 md:pb-12">
                <div className="mx-auto max-w-lg px-4 md:max-w-xl">
                    {/* Failure Animation/Icon */}
                    <div className="mb-6 text-center md:mb-8">
                        <div className="animate-shake mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 md:mb-4 md:h-20 md:w-20">
                            <XCircle className="h-8 w-8 text-red-600 md:h-12 md:w-12" />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Klaim Gagal</h1>
                        <p className="mt-2 px-2 text-sm text-slate-600 md:px-4 md:text-base">
                            Maaf, permintaan klaim untuk <span className="font-semibold text-slate-800">"{item.name}"</span> tidak dapat diproses.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-xl shadow-red-200/50">
                        {/* Error Message Box */}
                        <div className="border-b border-red-100 bg-red-50/50 p-4 md:p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                <div>
                                    <h3 className="text-sm font-bold text-red-800 md:text-base">Alasan Penolakan:</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-red-700 md:text-base">{message}</p>
                                </div>
                            </div>
                        </div>

                        {/* Instructions / Next Steps */}
                        <div className="space-y-5 p-4 md:space-y-6 md:p-6">
                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Apa yang bisa Anda lakukan?
                                </h3>
                                <div className="grid gap-3">
                                    <div className="flex items-start gap-3 text-slate-700">
                                        <div className="rounded-lg bg-slate-100 p-1.5 md:p-2">
                                            <PackageX className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <p className="text-xs md:text-sm">
                                            Pastikan Anda menjawab pertanyaan verifikasi dengan benar sesuai ciri-ciri barang.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3 text-slate-700">
                                        <div className="rounded-lg bg-slate-100 p-1.5 md:p-2">
                                            <HelpCircle className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <p className="text-xs md:text-sm">
                                            Jika Anda yakin barang ini milik Anda, hubungi petugas untuk bantuan verifikasi manual.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Tindakan
                                </h3>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                                    <button
                                        onClick={handleRetry}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 md:py-3.5 md:text-sm"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Coba Klaim Lagi
                                    </button>

                                    <a
                                        href={getWhatsAppLink()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95 md:py-3.5 md:text-sm"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Hubungi Petugas
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer Button */}
                        <div className="border-t border-red-100 bg-red-50 p-4">
                            <button
                                onClick={handleBack}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98] md:px-6 md:py-4"
                            >
                                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm font-semibold md:text-base">Kembali ke Detail Barang</span>
                            </button>
                        </div>
                    </div>

                    <p className="mx-auto mt-6 max-w-[280px] text-center text-[10px] leading-relaxed text-slate-400 md:mt-8 md:max-w-none md:text-xs">
                        Sistem mencatat setiap percobaan klaim untuk keamanan data barang temuan.
                    </p>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out infinite;
                }
            `,
                }}
            />
        </>
    );
}
