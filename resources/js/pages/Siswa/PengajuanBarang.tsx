// resources/js/Pages/Siswa/PengajuanBarang.tsx
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Clock, CheckCircle2, XCircle, Package, ChevronRight, X, Phone, AlertCircle, MessageSquare } from 'lucide-react';

interface Claim {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    admin_notes?: string | null;
    item: {
        id: number;
        slug: string;
        name: string;
        image_url?: string;
        handling_status?: string;
        report_status?: string;
        user_id: number;
    };
}

interface Props {
    claims: {
        data: Claim[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function PengajuanBarang({ claims }: Props) {
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    const filteredClaims = filter === 'all' ? claims.data : claims.data.filter((claim) => claim.status === filter);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Menunggu',
                    icon: <Clock size={12} className="md:h-3.5 md:w-3.5" />,
                    color: 'bg-amber-100 text-amber-700 border-amber-200',
                };
            case 'approved':
                return {
                    label: 'Disetujui',
                    icon: <CheckCircle2 size={12} className="md:h-3.5 md:w-3.5" />,
                    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                };
            case 'rejected':
                return {
                    label: 'Ditolak',
                    icon: <XCircle size={12} className="md:h-3.5 md:w-3.5" />,
                    color: 'bg-rose-100 text-rose-700 border-rose-200',
                };
            default:
                return {
                    label: 'Unknown',
                    icon: <AlertCircle size={12} className="md:h-3.5 md:w-3.5" />,
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                };
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pengajuan Barang" />

            {/* Removed: <div className="py-6 md:py-12"> and <div className="mx-auto max-w-7xl px-4..."> */}
            <div className="mx-auto w-full">
                {/* Header Section: Matches Dashboard.tsx spacing */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Pengajuan Klaim Saya</h1>
                    <p className="mt-1 text-xs text-slate-500 md:text-sm">Pantau status pengembalian barang Anda di sini.</p>
                </div>

                {/* TABS FILTER */}
                <div className="hide-scrollbar mb-6 flex overflow-x-auto pb-2">
                    <div className="flex w-max gap-1.5 rounded-full border border-slate-100 bg-white p-1.5 shadow-sm md:gap-2">
                        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all md:px-5 md:py-2.5 md:text-sm ${
                                    filter === f ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {f === 'all' && 'Semua Klaim'}
                                {f === 'pending' && 'Menunggu'}
                                {f === 'approved' && 'Disetujui'}
                                {f === 'rejected' && 'Ditolak'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* DAFTAR KLAIM */}
                {filteredClaims.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {filteredClaims.map((claim) => {
                            const statusConfig = getStatusConfig(claim.status);
                            const imageUrl =
                                claim.item.image_url || 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1b?q=80&w=800&auto=format&fit=crop';

                            return (
                                <div
                                    key={claim.id}
                                    onClick={() => setSelectedClaim(claim)}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 md:p-3"
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 md:h-20 md:w-20">
                                            <img
                                                src={imageUrl}
                                                alt={claim.item.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col py-1">
                                            <div
                                                className={`mb-1.5 inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase md:text-[10px] ${statusConfig.color}`}
                                            >
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </div>
                                            <h3 className="line-clamp-1 text-sm font-bold text-slate-900 md:text-base">{claim.item.name}</h3>
                                            <p className="mt-0.5 text-[10px] font-medium text-slate-500 md:text-xs">
                                                {new Date(claim.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* STATE KOSONG */
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center md:py-24">
                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                            <Package size={32} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 md:text-lg">Belum Ada Pengajuan</h3>
                        <p className="mt-1 max-w-xs text-xs text-slate-500 md:text-sm">Anda belum memiliki riwayat pengajuan klaim barang.</p>
                    </div>
                )}
            </div>

            {/* MODAL DETAIL KLAIM (Sudah dibikin anti-terpotong) */}
            {selectedClaim && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop Blur */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedClaim(null)}
                    ></div>

                    {/* Modal Box: max-h-[90vh] dan flex-col agar isinya bisa di-scroll kalau layar HP kependekan */}
                    <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all md:rounded-[2.5rem]">
                        {/* Header Modal - Fixed tidak ikut ke scroll */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4 md:px-6">
                            <h3 className="text-base font-black text-slate-900 md:text-lg">Detail Pengajuan</h3>
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body Modal - Scrollable (overflow-y-auto) */}
                        <div className="overflow-y-auto p-5 md:p-6">
                            {/* Gambar & Nama Barang */}
                            <div className="mb-5 flex gap-3 md:mb-6 md:gap-4">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 md:h-20 md:w-20 md:rounded-[1.5rem]">
                                    <img
                                        src={
                                            selectedClaim.item.image_url ||
                                            'https://images.unsplash.com/photo-1544006659-f0b21f04cb1b?q=80&w=800&auto=format&fit=crop'
                                        }
                                        alt={selectedClaim.item.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="line-clamp-2 text-sm leading-tight font-black text-slate-900 md:text-lg">
                                        {selectedClaim.item.name}
                                    </h4>
                                    <Link
                                        href={`/items/${selectedClaim.item.slug}`}
                                        className="mt-1 text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:underline md:text-sm"
                                    >
                                        Lihat Halaman Barang
                                    </Link>
                                </div>
                            </div>

                            {/* Status Info Bento Box */}
                            <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:mb-6 md:rounded-[2rem] md:p-5">
                                <div className="mb-3 md:mb-4">
                                    <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase md:text-[10px]">Status Saat Ini</p>
                                    <div
                                        className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase md:mt-2 md:gap-1.5 md:px-3 md:py-1.5 md:text-xs ${getStatusConfig(selectedClaim.status).color}`}
                                    >
                                        {getStatusConfig(selectedClaim.status).icon}
                                        {getStatusConfig(selectedClaim.status).label}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase md:text-[10px]">Tanggal Diajukan</p>
                                    <p className="mt-1 text-xs font-bold text-slate-800 md:text-sm">
                                        {new Date(selectedClaim.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Catatan Admin (Jika Ada) */}
                            {selectedClaim.admin_notes && (
                                <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 md:mb-6 md:rounded-[1.5rem]">
                                    <div className="mb-1.5 flex items-center gap-2 text-amber-700 md:mb-2">
                                        <MessageSquare size={14} className="md:h-4 md:w-4" />
                                        <h5 className="text-xs font-bold md:text-sm">Catatan Petugas</h5>
                                    </div>
                                    <p className="text-xs leading-relaxed text-amber-900/80 md:text-sm">{selectedClaim.admin_notes}</p>
                                </div>
                            )}

                            {/* Action Buttons (Lebih tipis di mobile) */}
                            <div className="mt-6 flex flex-col gap-2 md:mt-8 md:gap-3">
                                {selectedClaim.status === 'approved' && (
                                    <Link
                                        href={`/items/${selectedClaim.item.slug}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 md:rounded-2xl md:py-4 md:text-sm"
                                    >
                                        <CheckCircle2 size={16} className="md:h-[18px] md:w-[18px]" /> Hubungi / Ambil Barang
                                    </Link>
                                )}

                                {selectedClaim.status !== 'approved' && (
                                    <a
                                        href={`https://wa.me/628123456789?text=Halo,%20saya%20ingin%20bertanya%20mengenai%20klaim%20barang%20*${encodeURIComponent(selectedClaim.item.name)}*%20saya%20yang%20berstatus%20*${selectedClaim.status}*.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-black text-white shadow-lg shadow-slate-200 transition-all hover:bg-teal-600 md:rounded-2xl md:py-4 md:text-sm"
                                    >
                                        <Phone size={16} className="md:h-[18px] md:w-[18px]" /> Hubungi Petugas Sekolah
                                    </a>
                                )}

                                <button
                                    onClick={() => setSelectedClaim(null)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 md:rounded-2xl md:py-4 md:text-sm"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `,
                }}
            />
        </AuthenticatedLayout>
    );
}
