import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import {
    MapPin,
    Calendar,
    Tag,
    MessageCircle,
    ShieldCheck,
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    Phone,
    FileText,
    Flag,
} from 'lucide-react';

interface Item {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    location: string;
    date: string;
    report_type: 'hilang' | 'ditemukan';
    report_status: 'aktif' | 'selesai' | 'ditutup';
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getReportStatusLabel = (): string => {
        if (item.report_status === 'ditutup') return 'Ditutup';
        if (item.report_status === 'selesai') return 'Selesai';
        return 'Aktif';
    };

    const reportStatusLabel = getReportStatusLabel();
    const reportStatusColor = {
        bg: reportStatusLabel === 'Ditutup' ? 'bg-slate-100' : reportStatusLabel === 'Selesai' ? 'bg-blue-50' : 'bg-emerald-50',
        text: reportStatusLabel === 'Ditutup' ? 'text-slate-600' : reportStatusLabel === 'Selesai' ? 'text-blue-700' : 'text-emerald-700',
        dot: reportStatusLabel === 'Ditutup' ? 'bg-slate-400' : reportStatusLabel === 'Selesai' ? 'bg-blue-500' : 'bg-emerald-500',
    };

    const handlingStatusMap: Record<string, string> = {
        menunggu_penyerahan: 'Menunggu Penyerahan ke Petugas',
        dititipkan_petugas: 'Dititipkan di Petugas',
        diklaim: 'Diklaim (Menunggu Verifikasi)',
        dikembalikan: 'Sudah Dikembalikan ke Pemilik',
    };
    const handlingStatusDisplay = item.handling_status ? handlingStatusMap[item.handling_status] : '-';
    const finalHandlingDisplay = isLost ? 'Tidak Berlaku (Barang Hilang)' : handlingStatusDisplay;

    const handleDelete = () => {
        if (confirm('Hapus laporan ini? Laporan akan disembunyikan dari publik.')) {
            router.delete(`/items/${item.slug}`);
        }
    };

    // Logika tombol Klaim Barang
    let claimLink = '';
    let claimText = 'Klaim Barang';
    if (!user) {
        // Belum login: arahkan ke halaman login dengan redirect kembali ke halaman ini
        const redirectUrl = encodeURIComponent(window.location.pathname);
        claimLink = `/login?redirect=${redirectUrl}`;
        claimText = 'Klaim Barang';
    } else if (user.id !== item.user.id) {
        // Sudah login dan bukan pemilik
        claimLink = `/claim/${item.slug}`;
        claimText = 'Klaim Barang';
    }
    // Jika user adalah pemilik, claimLink tetap kosong (tombol tidak ditampilkan)

    const showClaimButton =
        !isLost && item.report_status !== 'ditutup' && item.handling_status !== 'dikembalikan' && item.handling_status !== 'diklaim' && claimLink;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Head title={`${item.name} - Detail Barang`} />
            <Navbar />

            <main className="pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Navigation */}
                    <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/search"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-all hover:text-indigo-600"
                        >
                            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
                            <span>Kembali ke Jelajah</span>
                        </Link>
                    </div>

                    {/* Hero Section: Judul + Tipe Laporan */}
                    <div className="mb-6 text-left">
                        <div className="mb-3 flex flex-wrap items-center justify-start gap-2">
                            <StatusBadge type={item.report_type} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-3xl">{item.name}</h1>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left Column: Gallery & Description */}
                        <div className="space-y-8 lg:col-span-7">
                            {/* Image Gallery */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
                                <div className="relative flex min-h-[400px] items-center justify-center bg-slate-100 sm:min-h-[500px]">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt={item.name} className="max-h-[500px] w-full object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <ImageIcon size={64} strokeWidth={1.2} />
                                            <p className="mt-3 text-sm">Tidak ada foto</p>
                                        </div>
                                    )}
                                </div>
                                {item.images.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto border-t border-slate-100 p-4">
                                        {item.images.map((img) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setSelectedImage(img.url)}
                                                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                                                    selectedImage === img.url
                                                        ? 'ring-2 ring-indigo-500 ring-offset-2'
                                                        : 'opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={img.url} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 sm:p-8">
                                <div className="mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-indigo-500" />
                                    <h2 className="text-lg font-semibold text-slate-900">Deskripsi</h2>
                                </div>
                                <p className="leading-relaxed text-slate-600">
                                    {item.description || 'Pelapor tidak menyertakan deskripsi tambahan untuk barang ini.'}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Info & Actions */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24 space-y-6">
                                {/* Info Card */}
                                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 sm:p-8">
                                    <div className="space-y-6">
                                        {/* Kategori */}
                                        <DetailItem icon={<Tag size={18} />} label="Kategori" value={item.category.name} />
                                        {/* Status Laporan */}
                                        <DetailItem
                                            icon={<Flag size={18} />}
                                            label="Status Laporan"
                                            value={
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${reportStatusColor.bg} ${reportStatusColor.text}`}
                                                >
                                                    <span className={`h-1.5 w-1.5 rounded-full ${reportStatusColor.dot}`} />
                                                    {reportStatusLabel}
                                                </span>
                                            }
                                        />
                                        <DetailItem icon={<MapPin size={18} />} label="Lokasi" value={item.location} />
                                        <DetailItem icon={<Calendar size={18} />} label="Tanggal Kejadian" value={formatDate(item.date)} />
                                        <DetailItem icon={<ShieldCheck size={18} />} label="Status Penanganan" value={finalHandlingDisplay} />
                                    </div>

                                    <div className="my-6 h-px bg-slate-100" />

                                    {/* Reporter Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-lg font-bold text-indigo-700">
                                            {item.user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">Pelapor</p>
                                            <p className="font-semibold text-slate-900">{item.user.name}</p>
                                            {item.user.class && <p className="mt-0.5 text-sm text-slate-500">Kelas: {item.user.class}</p>}
                                            {item.user.phone && (
                                                <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                                                    <Phone size={14} />
                                                    <span>{item.user.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 space-y-3">
                                        {/* Tombol Hubungi Pelapor hanya untuk barang hilang */}
                                        {isLost && (
                                            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]">
                                                <MessageCircle size={18} className="transition-transform group-hover:scale-105" />
                                                Hubungi Pelapor
                                            </button>
                                        )}

                                        {/* Tombol Klaim Barang untuk barang ditemukan */}
                                        {showClaimButton && (
                                            <Link
                                                href={claimLink}
                                                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                                            >
                                                <CheckCircle2 size={20} /> {claimText}
                                            </Link>
                                        )}

                                        {/* Tombol Edit/Hapus untuk pemilik */}
                                        {isOwner && (
                                            <div className="flex gap-3 pt-2">
                                                <Link
                                                    href={`/items/${item.slug}/edit`}
                                                    className="flex-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-center font-medium text-amber-700 transition-all hover:bg-amber-100"
                                                >
                                                    Edit Laporan
                                                </Link>
                                                <button
                                                    onClick={handleDelete}
                                                    className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center font-medium text-red-700 transition-all hover:bg-red-100"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Security Tip */}
                                <div className="flex gap-4 rounded-2xl bg-amber-50/60 p-5 ring-1 ring-amber-100">
                                    <AlertCircle size={20} className="flex-shrink-0 text-amber-600" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-amber-900">Tips Keamanan</h4>
                                        <p className="mt-1 text-xs leading-relaxed text-amber-800/80">
                                            Jika pelapor tidak merespon, hubungi <span className="font-medium">Pos Penjaga</span> atau ruang{' '}
                                            <span className="font-medium">Tata Usaha</span> terdekat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Subcomponents
function StatusBadge({ type }: { type: 'hilang' | 'ditemukan' }) {
    const isLost = type === 'hilang';
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
                isLost ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
            }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${isLost ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {isLost ? 'Hilang' : 'Ditemukan'}
        </span>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactElement; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">{icon}</div>
            <div>
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">{label}</p>
                <div className="font-medium text-slate-800">{value}</div>
            </div>
        </div>
    );
}
