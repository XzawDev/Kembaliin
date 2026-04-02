// resources/js/pages/Items/SuksesKlaim.tsx
import React from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import { CheckCircle2, ArrowLeft, User, MessageCircle, Phone, School, PackageCheck } from 'lucide-react';

interface Props {
    item: { id: number; name: string };
    message: string;
    contact: { name: string; phone: string; class: string };
    officer_contact: string;
}

export default function SuksesKlaim({ item, message, contact, officer_contact }: Props) {
    const formatWA = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.startsWith('0') ? `62${cleaned.slice(1)}` : cleaned;
    };

    return (
        <>
            <Head title="Klaim Berhasil" />
            <Navbar />

            {/* Penyesuaian spacing atas-bawah. 
                Mobile: pt-20 pb-8 | Desktop: md:pt-32 md:pb-12 
            */}
            <div className="min-h-screen bg-slate-50 pt-20 pb-8 md:pt-32 md:pb-12">
                <div className="mx-auto max-w-lg px-4 md:max-w-xl">
                    {/* Success Animation/Icon Header */}
                    <div className="mb-6 text-center md:mb-8">
                        {/* Ukuran ikon disusutkan untuk mobile, membesar di desktop */}
                        <div className="animate-bounce-short mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 md:mb-4 md:h-20 md:w-20">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600 md:h-12 md:w-12" />
                        </div>
                        {/* Ukuran font responsif */}
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Klaim Berhasil!</h1>
                        <p className="mt-2 px-2 text-sm text-slate-600 md:px-4 md:text-base">
                            Permintaan klaim Anda untuk <span className="font-semibold text-slate-800">"{item.name}"</span> telah diproses.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                        {/* Main Message Section */}
                        {/* Padding lebih kecil di mobile (p-4), normal di desktop (md:p-6) */}
                        <div className="border-b border-emerald-100 bg-emerald-50/50 p-4 md:p-6">
                            <div className="flex items-start gap-3 md:items-center">
                                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 md:mt-0" />
                                <p className="text-sm leading-relaxed font-medium text-emerald-800 md:text-base">{message}</p>
                            </div>
                        </div>

                        {/* Details Sections */}
                        <div className="space-y-5 p-4 md:space-y-6 md:p-6">
                            {/* Reporter Info */}
                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Informasi Pelapor
                                </h3>
                                <div className="grid gap-2 md:gap-3">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="rounded-lg bg-slate-100 p-1.5 md:p-2">
                                            <User className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <span className="text-sm font-medium md:text-base">{contact.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="rounded-lg bg-slate-100 p-1.5 md:p-2">
                                            <School className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <span className="text-sm md:text-base">{contact.class}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Contact Actions */}
                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Hubungi Untuk Koordinasi
                                </h3>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                                    {/* Tinggi tombol disesuaikan: py-2.5 untuk mobile */}
                                    <a
                                        href={`https://wa.me/${formatWA(officer_contact)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 md:py-3.5 md:text-sm"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Chat Petugas
                                    </a>

                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 active:scale-95 md:py-3.5 md:text-sm"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Hubungi Pelapor
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="border-t border-slate-100 bg-slate-50 p-4">
                            <button
                                onClick={() => router.visit(`/items/${item.id}`)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98] md:px-6 md:py-4"
                            >
                                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm font-semibold md:text-base">Kembali ke Detail Barang</span>
                            </button>
                        </div>
                    </div>

                    <p className="mx-auto mt-6 max-w-[280px] text-center text-[10px] leading-relaxed text-slate-400 md:mt-8 md:max-w-none md:text-xs">
                        Harap bawa kartu identitas (KTM/ID Card) saat melakukan pengambilan barang secara langsung.
                    </p>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-short {
                    animation: bounce-short 2s ease-in-out infinite;
                }
            `,
                }}
            />
        </>
    );
}
