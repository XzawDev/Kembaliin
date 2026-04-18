import { Head, Link } from '@inertiajs/react';
import { Clock, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '@/Components/Home/Navbar';

interface Props {
    item: { id: number; slug: string; name: string };
    claim: { id: number; created_at: string };
    message?: string;
}

export default function ClaimPending({ item, claim, message }: Props) {
    return (
        <>
            <Head title="Klaim Menunggu Verifikasi" />
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-20 pb-8 md:pt-32 md:pb-12">
                <div className="mx-auto max-w-lg px-4 md:max-w-xl">
                    {/* Icon Header */}
                    <div className="mb-6 text-center md:mb-8">
                        <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 md:mb-4 md:h-20 md:w-20">
                            <Clock className="h-8 w-8 text-amber-600 md:h-12 md:w-12" />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Klaim Sedang Diproses</h1>
                        <p className="mt-2 px-2 text-sm text-slate-600 md:px-4 md:text-base">
                            Terima kasih, klaim Anda untuk <span className="font-semibold text-slate-800">"{item.name}"</span> telah kami terima.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-amber-400 bg-white">
                        {/* Pending Message */}
                        <div className="border-b border-amber-100 bg-amber-50/50 p-4 md:p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                <div>
                                    <h3 className="text-sm font-bold text-amber-800 md:text-base">
                                        {message || 'Klaim Anda sedang menunggu verifikasi petugas.'}
                                    </h3>
                                    <p className="mt-1 text-sm text-amber-700">
                                        Karena jawaban verifikasi tidak sesuai, petugas kami akan memeriksa secara manual.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Tambahan */}
                        <div className="space-y-5 p-4 md:space-y-6 md:p-6">
                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Apa yang terjadi selanjutnya?
                                </h3>
                                <div className="grid gap-3">
                                    <div className="flex items-start gap-3 text-slate-700">
                                        <div className="rounded-lg bg-slate-100 p-1.5">
                                            <Clock className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <p className="text-xs md:text-sm">
                                            Petugas akan meninjau klaim Anda dan menghubungi Anda melalui WhatsApp atau email.
                                        </p>
                                    </div>
                                    {/* <div className="flex items-start gap-3 text-slate-700">
                                        <div className="rounded-lg bg-slate-100 p-1.5">
                                            <CheckCircle2 className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <p className="text-xs md:text-sm">
                                            Jika disetujui, Anda akan dapat menghubungi pelapor dan mengambil barang.
                                        </p>
                                    </div> */}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <h3 className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase md:mb-3 md:text-xs">
                                    Perlu bantuan?
                                </h3>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-1 md:gap-3">
                                    <a
                                        href="https://wa.me/628123456789?text=Saya%20mengajukan%20klaim%20untuk%20barang%20"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700 transition-all hover:bg-amber-100"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Hubungi Petugas
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-amber-100 bg-amber-50 p-4">
                            <Link
                                href={`/items/${item.slug}`}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98]"
                            >
                                Kembali ke Detail Barang
                            </Link>
                        </div>
                    </div>

                    <p className="mx-auto mt-6 max-w-[280px] text-center text-[10px] leading-relaxed text-slate-400 md:mt-8 md:max-w-none md:text-xs">
                        Proses verifikasi biasanya memakan waktu 1x24 jam. Harap bersabar.
                    </p>
                </div>
            </div>
        </>
    );
}
