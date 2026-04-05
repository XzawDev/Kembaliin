// resources/js/pages/Items/SuksesKlaim.tsx
import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import { CheckCircle2, ArrowLeft, User, MessageCircle, Phone, School, PackageCheck, Loader2 } from 'lucide-react';

interface OfficerContact {
    name: string;
    phone: string;
    wa_link: string;
}

interface Props {
    item: { id: number; slug: string; name: string };
    message?: string;
    contact?: { name: string; phone: string; class: string } | null;
    officer_contact?: OfficerContact | null;
}

export default function SuksesKlaim({ item, message: initialMessage, contact: initialContact, officer_contact: initialOfficerContact }: Props) {
    const [loading, setLoading] = useState(!initialContact);
    const [contact, setContact] = useState(initialContact || null);
    const [message, setMessage] = useState(initialMessage || '');
    const [officerContact, setOfficerContact] = useState(initialOfficerContact || null);

    useEffect(() => {
        if (initialContact) {
            setLoading(false);
            return;
        }

        const fetchClaimData = async () => {
            try {
                const response = await fetch(`/claim/success-data/${item.slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setContact(data.contact);
                    setMessage(data.message);
                    setOfficerContact(data.officer_contact);
                } else {
                    router.visit(`/items/${item.slug}`);
                }
            } catch (error) {
                console.error('Error fetching claim data:', error);
                router.visit(`/items/${item.slug}`);
            } finally {
                setLoading(false);
            }
        };

        fetchClaimData();
    }, [item.slug, initialContact]);

    const formatWA = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.startsWith('0') ? `62${cleaned.slice(1)}` : cleaned;
    };

    if (loading) {
        return (
            <>
                <Head title="Memuat..." />
                <Navbar />
                <div className="flex min-h-screen items-center justify-center bg-slate-50">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            </>
        );
    }

    if (!contact) {
        return (
            <>
                <Head title="Klaim Berhasil" />
                <Navbar />
                <div className="min-h-screen bg-slate-50 py-12">
                    <div className="mx-auto max-w-2xl px-4">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                <h1 className="text-2xl font-bold text-emerald-800">Klaim Berhasil</h1>
                            </div>
                            <p className="text-slate-700">{message || 'Klaim Anda telah berhasil diproses.'}</p>
                            <button
                                onClick={() => router.visit(`/items/${item.slug}`)}
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

    return (
        <>
            <Head title="Klaim Berhasil" />
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-8 md:pt-32 md:pb-12">
                <div className="mx-auto max-w-lg px-4 md:max-w-xl">
                    {/* Success Animation */}
                    <div className="mb-6 text-center md:mb-8">
                        <div className="animate-bounce-short mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 md:mb-4 md:h-20 md:w-20">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600 md:h-12 md:w-12" />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Klaim Berhasil!</h1>
                        <p className="mt-2 px-2 text-sm text-slate-600 md:px-4 md:text-base">
                            Permintaan klaim Anda untuk <span className="font-semibold text-slate-800">"{item.name}"</span> telah diproses.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                        {/* Message */}
                        <div className="border-b border-emerald-100 bg-emerald-50/50 p-4 md:p-6">
                            <div className="flex items-start gap-3 md:items-center">
                                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 md:mt-0" />
                                <p className="text-sm leading-relaxed font-medium text-emerald-800 md:text-base">{message}</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-5 p-4 md:space-y-6 md:p-6">
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

                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Hubungi Petugas yang Menangani
                                </h3>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                                    <a
                                        href={officerContact?.wa_link || '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 md:py-3.5 md:text-sm"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Chat {officerContact?.name || 'Petugas'}
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

                        {/* Footer */}
                        <div className="border-t border-slate-100 bg-slate-50 p-4">
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
                        Harap membawa kartu identitas (KTP / Kartu Pelajar) saat melakukan pengambilan barang secara langsung.
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
