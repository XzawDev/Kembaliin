import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import {
    MapPin,
    Calendar,
    Package,
    ChevronLeft,
    AlertCircle,
    FileText,
    Tag,
    Image as ImageIcon,
    MessageCircle,
    ShieldCheck,
    Share2,
    Clock,
    CheckCircle2,
    Info,
    X,
} from 'lucide-react';

interface Item {
    id: number;
    name: string;
    description: string | null;
    location: string;
    date: string;
    report_type: 'hilang' | 'ditemukan';
    report_status: 'dicari' | 'ditemukan' | 'ditutup';
    handling_status: 'menunggu_penyerahan' | 'dititipkan_petugas' | 'diklaim' | 'dikembalikan' | null;
    display_status: string;
    qr_code: string | null;
    user: { id: number; name: string; class?: string; phone?: string; avatar_url?: string };
    category: { id: number; name: string };
    images: Array<{ id: number; url: string }>;
    histories: Array<{
        id: number;
        action: string;
        description: string | null;
        created_at: string;
        user: { id: number; name: string } | null;
    }>;
}

interface Props {
    item: Item;
}

export default function ItemDetail({ item }: Props) {
    const [selectedImage, setSelectedImage] = useState(item.images[0]?.url || null);
    const isLost = item.report_type === 'hilang';
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isOwner = user && user.id === item.user.id;

    const [showClaimModal, setShowClaimModal] = useState(false);
    const [questions, setQuestions] = useState<Array<{ id: number; question: string }>>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [claimResult, setClaimResult] = useState<{
        success: boolean;
        message: string;
        contact?: { name: string; phone: string };
        officer_contact?: string;
    } | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getReportStatusLabel = (): string => {
        if (item.report_status === 'ditutup') return 'Ditutup';
        if (item.handling_status === 'diklaim' || item.handling_status === 'dikembalikan') return 'Diklaim';
        return 'Terbuka';
    };

    const reportStatusLabel = getReportStatusLabel();
    const reportStatusColor =
        reportStatusLabel === 'Ditutup'
            ? 'bg-slate-100 text-slate-700'
            : reportStatusLabel === 'Diklaim'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-emerald-100 text-emerald-700';

    const handlingStatusMap: Record<string, string> = {
        menunggu_penyerahan: 'Menunggu penyerahan kepada petugas',
        dititipkan_petugas: 'Diserahkan petugas',
        diklaim: 'Diklaim',
        dikembalikan: 'Dikembalikan ke pemilik',
    };
    const handlingStatusDisplay = item.handling_status ? handlingStatusMap[item.handling_status] : '-';

    const openClaimModal = async () => {
        if (!user) {
            router.visit('/login');
            return;
        }
        setLoading(true);
        setClaimResult(null);
        setAnswers({});
        try {
            const res = await fetch(`/items/${item.id}/questions`);
            const data = await res.json();
            setQuestions(data);
            setShowClaimModal(true);
        } catch (error) {
            console.error('Gagal mengambil pertanyaan', error);
        } finally {
            setLoading(false);
        }
    };

    const submitClaim = async () => {
        setLoading(true);
        try {
            const answersArray = Object.entries(answers).map(([qId, ans]) => ({
                question_id: parseInt(qId),
                answer: ans,
            }));
            const res = await fetch(`/items/${item.id}/verify-claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answersArray, description: '' }),
            });
            const result = await res.json();
            setClaimResult(result);
        } catch (error) {
            console.error('Gagal mengirim klaim', error);
            setClaimResult({ success: false, message: 'Terjadi kesalahan, coba lagi.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (confirm('Hapus laporan ini? Laporan akan disembunyikan dari publik.')) {
            router.delete(`/items/${item.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Head title={`${item.name} - Detail Barang`} />
            <Navbar />

            <main className="pt-28 pb-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Navigation Header */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/search"
                            className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition-all group-hover:ring-indigo-200">
                                <ChevronLeft size={18} />
                            </div>
                            Kembali ke Jelajah
                        </Link>
                        <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                            <Share2 size={16} /> Bagikan
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Left Side: Images & Description */}
                        <div className="space-y-8 lg:col-span-7">
                            {/* Gallery */}
                            <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/60">
                                <div className="relative flex aspect-[16/10] items-center justify-center bg-slate-100">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt={item.name} className="max-h-full max-w-full object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <ImageIcon size={48} strokeWidth={1} />
                                            <p className="mt-2 text-sm">Tidak ada foto</p>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <StatusBadge type={item.report_type} />
                                        <span
                                            className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase shadow-sm ${reportStatusColor}`}
                                        >
                                            {reportStatusLabel}
                                        </span>
                                    </div>
                                </div>

                                {item.images.length > 1 && (
                                    <div className="no-scrollbar flex gap-3 overflow-x-auto p-4">
                                        {item.images.map((img) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setSelectedImage(img.url)}
                                                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                                                    selectedImage === img.url
                                                        ? 'scale-95 ring-2 ring-indigo-500 ring-offset-2'
                                                        : 'opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={img.url} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Details & Description */}
                            <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60">
                                <div className="mb-8">
                                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <FileText className="text-indigo-500" size={20} />
                                        Informasi Detail
                                    </h2>
                                    <p className="leading-relaxed text-slate-600">
                                        {item.description || 'Pelapor tidak menyertakan deskripsi tambahan untuk barang ini.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
                                    <DetailItem icon={<MapPin />} label="Lokasi Kejadian" value={item.location} />
                                    <DetailItem icon={<Calendar />} label="Tanggal" value={formatDate(item.date)} />
                                    <DetailItem icon={<Tag />} label="Kategori" value={item.category.name} />
                                    <DetailItem icon={<Info />} label="Status Laporan" value={reportStatusLabel} />
                                    <DetailItem icon={<ShieldCheck />} label="Status Penanganan" value={handlingStatusDisplay} />
                                </div>
                            </section>
                        </div>

                        {/* Right Side: Actions & Sidebar */}
                        <div className="space-y-6 lg:col-span-5">
                            <div className="sticky top-24 space-y-6">
                                <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60">
                                    <div className="mb-6">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">{item.category.name}</span>
                                            {item.report_status === 'ditutup' && (
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                    Selesai
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="mt-2 text-3xl leading-tight font-bold text-slate-900">{item.name}</h1>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Informasi Pelapor */}
                                        <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                                                {item.user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium tracking-tight text-slate-500 uppercase">Pelapor</p>
                                                <p className="font-semibold text-slate-900">{item.user.name}</p>
                                                {item.user.class && <p className="text-sm text-slate-600">Kelas: {item.user.class}</p>}
                                            </div>
                                        </div>

                                        {/* Tombol Edit & Hapus untuk pemilik */}
                                        {isOwner && (
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/items/${item.id}/edit`}
                                                    className="flex-1 rounded-xl bg-amber-500 px-4 py-2 text-center font-semibold text-white hover:bg-amber-600"
                                                >
                                                    Edit Laporan
                                                </Link>
                                                <button
                                                    onClick={handleDelete}
                                                    className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-center font-semibold text-white hover:bg-red-600"
                                                >
                                                    Hapus Laporan
                                                </button>
                                            </div>
                                        )}

                                        {/* Tombol Hubungi Pelapor */}
                                        <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]">
                                            <MessageCircle size={20} className="transition-transform group-hover:rotate-12" />
                                            Hubungi Pelapor
                                        </button>

                                        {/* Tombol Klaim Barang */}
                                        {!isLost && user && user.id !== item.user.id && item.report_status !== 'ditutup' && (
                                            <button
                                                onClick={openClaimModal}
                                                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                                            >
                                                <CheckCircle2 size={20} />
                                                Klaim Barang
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Security Tip */}
                                <div className="flex gap-4 rounded-3xl bg-amber-50/50 p-6 ring-1 ring-amber-100">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-900">Perhatian</h4>
                                        <p className="mt-1 text-xs leading-relaxed text-amber-800/80">
                                            Apabila tidak ada respon dari pelapor, silakan mendatangi <span className="font-bold">Pos Penjaga</span>{' '}
                                            atau ruang <span className="font-bold">Tata Usaha</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-100 bg-white/80 p-4 backdrop-blur-lg lg:hidden">
                <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition-transform active:scale-95">
                    <MessageCircle size={20} />
                    Hubungi Pelapor
                </button>
            </div>

            {/* Modal Klaim */}
            {showClaimModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Klaim Barang</h3>
                            <button onClick={() => setShowClaimModal(false)} className="rounded-full p-1 hover:bg-slate-100">
                                <X size={20} />
                            </button>
                        </div>

                        {!claimResult ? (
                            <>
                                <p className="mt-2 text-sm text-slate-600">Jawab pertanyaan berikut untuk membuktikan bahwa barang ini milik Anda.</p>
                                {loading && questions.length === 0 ? (
                                    <div className="flex justify-center py-8">Memuat pertanyaan...</div>
                                ) : (
                                    <>
                                        <div className="mt-4 space-y-4">
                                            {questions.map((q) => (
                                                <div key={q.id}>
                                                    <label className="block text-sm font-medium text-slate-700">{q.question}</label>
                                                    <input
                                                        type="text"
                                                        className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex gap-3">
                                            <button
                                                onClick={() => setShowClaimModal(false)}
                                                className="flex-1 rounded-xl border border-slate-200 py-3 font-medium transition-colors hover:bg-slate-50"
                                                disabled={loading}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={submitClaim}
                                                disabled={loading || questions.length === 0}
                                                className="flex-1 rounded-xl bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                {loading ? 'Memproses...' : 'Kirim'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="mt-4">
                                <p className={claimResult.success ? 'text-green-600' : 'text-amber-600'}>{claimResult.message}</p>
                                {claimResult.success && claimResult.contact && (
                                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                                        <p className="font-semibold">Kontak Pelapor:</p>
                                        <p>
                                            {claimResult.contact.name} - {claimResult.contact.phone}
                                        </p>
                                        <p className="mt-2 font-semibold">Kontak Petugas:</p>
                                        <p>{claimResult.officer_contact || 'Hubungi pos penjaga terdekat'}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowClaimModal(false)}
                                    className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-medium text-white"
                                >
                                    Tutup
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ type }: { type: 'hilang' | 'ditemukan' }) {
    const isLost = type === 'hilang';
    return (
        <span
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase shadow-sm ${
                isLost ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
            }`}
        >
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            {isLost ? 'Hilang' : 'Ditemukan'}
        </span>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactElement; label: string; value: string }) {
    return (
        <div className="group flex items-center gap-4 rounded-2xl border border-transparent p-1 transition-colors hover:bg-slate-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm">
                {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{label}</p>
                <p className="truncate font-semibold text-slate-700 capitalize" title={value}>
                    {value}
                </p>
            </div>
        </div>
    );
}
