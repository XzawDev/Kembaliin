import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import {
    Calendar,
    MapPin,
    User,
    Package,
    QrCode,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    Tag,
    History,
    ShieldCheck,
    Image as ImageIcon,
} from 'lucide-react';

interface Item {
    id: number;
    name: string;
    description: string | null;
    location: string;
    date: string;
    report_type: 'hilang' | 'ditemukan';
    report_status: 'aktif' | 'selesai' | 'ditutup';
    handling_status: 'menunggu_penyerahan' | 'dititipkan_petugas' | 'diklaim' | 'dikembalikan' | null;
    qr_code: string | null;
    user: { id: number; name: string; no_hp?: string; kelas?: string };
    category: { id: number; name: string };
    images: Array<{ id: number; image_path: string }>;
    histories: Array<{
        id: number;
        action: string;
        description: string | null;
        created_at: string;
        user: { id: number; name: string } | null;
    }>;
    verified_by?: number | null;
}

interface Props {
    item: Item;
}

function formatHistoryDescription(history: { action: string; description: string | null }): string {
    const desc = history.description || '';
    const action = history.action;

    switch (action) {
        case 'created item':
            if (desc.includes('reported as lost')) {
                const match = desc.match(/Item '([^']+)'/);
                const itemName = match ? match[1] : 'barang';
                return `Membuat laporan baru untuk barang '${itemName}' dengan status Hilang.`;
            } else if (desc.includes('reported as found')) {
                const match = desc.match(/Item '([^']+)'/);
                const itemName = match ? match[1] : 'barang';
                return `Membuat laporan baru untuk barang '${itemName}' dengan status Ditemukan.`;
            }
            return 'Membuat laporan baru.';
        case 'updated item':
            const match = desc.match(/Item '([^']+)'/);
            const itemName = match ? match[1] : 'barang';
            return `Memperbarui informasi laporan untuk barang '${itemName}'.`;
        case 'updated item status':
            return formatStatusChange(desc);
        case 'handed over to officer':
            const matchHandover = desc.match(/Item '([^']+)'/);
            const itemNameHandover = matchHandover ? matchHandover[1] : 'barang';
            return `Melakukan serah terima barang '${itemNameHandover}' kepada petugas. Status menjadi Dititipkan Petugas.`;
        case 'soft deleted by owner':
            const matchDelete = desc.match(/Item '([^']+)'/);
            const itemNameDelete = matchDelete ? matchDelete[1] : 'barang';
            return `Pemilik menghapus laporan barang '${itemNameDelete}'. Laporan tidak lagi ditampilkan di publik.`;
        default:
            return desc || action.replace(/_/g, ' ');
    }
}

function formatStatusChange(description: string): string {
    const parts = description.split(', ');
    const sentences: string[] = [];

    for (const part of parts) {
        const match = part.match(/(\w+): '([^']+)' → '([^']+)'/);
        if (match) {
            const field = match[1];
            const oldValue = match[2];
            const newValue = match[3];
            const fieldLabel = getFieldLabel(field);
            const oldLabel = getStatusLabel(field, oldValue);
            const newLabel = getStatusLabel(field, newValue);
            sentences.push(`Mengubah ${fieldLabel} dari '${oldLabel}' menjadi '${newLabel}'.`);
        }
        const closedMatch = part.match(/closed_at: null → '([^']+)'/);
        if (closedMatch) {
            const date = new Date(closedMatch[1]).toLocaleString('id-ID');
            sentences.push(`Menutup laporan pada tanggal ${date}.`);
        }
    }
    return sentences.length ? sentences.join(' ') : description;
}

function getFieldLabel(field: string): string {
    switch (field) {
        case 'handling_status':
            return 'status penanganan';
        case 'report_status':
            return 'status laporan';
        case 'verified_by':
            return 'petugas verifikasi';
        default:
            return field;
    }
}

function getStatusLabel(field: string, value: string): string {
    if (field === 'handling_status') {
        switch (value) {
            case 'menunggu_penyerahan':
                return 'Menunggu Penyerahan';
            case 'dititipkan_petugas':
                return 'Dititipkan Petugas';
            case 'diklaim':
                return 'Diklaim';
            case 'dikembalikan':
                return 'Dikembalikan';
            default:
                return value;
        }
    }
    if (field === 'report_status') {
        switch (value) {
            case 'aktif':
                return 'Aktif';
            case 'selesai':
                return 'Selesai';
            case 'ditutup':
                return 'Ditutup';
            default:
                return value;
        }
    }
    return value;
}

export default function ItemDetail({ item }: Props) {
    const { data, setData, put, processing } = useForm({
        handling_status: item.handling_status || '',
        report_status: item.report_status || 'aktif',
        verified_by: item.verified_by || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/officer/items/${item.id}`);
    };

    const handleVerifyHandover = () => {
        if (confirm('Verifikasi serah terima? Status akan berubah menjadi "Dititipkan Petugas".')) {
            router.post(`/officer/items/${item.id}/verify-handover`);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusStyles = (status: string) => {
        const statusMap: Record<string, { label: string; bg: string; text: string; dot: string }> = {
            menunggu_penyerahan: { label: 'Menunggu Penyerahan', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
            dititipkan_petugas: { label: 'Dititipkan Petugas', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
            diklaim: { label: 'Diklaim', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
            dikembalikan: { label: 'Dikembalikan', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
            aktif: { label: 'Aktif', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
            selesai: { label: 'Selesai', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
            ditutup: { label: 'Ditutup', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
            hilang: { label: 'Hilang', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
            ditemukan: { label: 'Ditemukan', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        };
        return statusMap[status] || { label: status, bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
    };

    const sortedHistories = [...(item.histories || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (!item?.user) {
        return (
            <OfficerLayout>
                <div className="flex min-h-[60vh] items-center justify-center p-4">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <AlertCircle className="h-7 w-7 text-red-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Data Tidak Ditemukan</h2>
                        <Link href="/officer/items" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
                            <ChevronLeft size={16} /> Kembali ke Daftar
                        </Link>
                    </div>
                </div>
            </OfficerLayout>
        );
    }

    return (
        <OfficerLayout>
            <Head title={`Item #${item.id} - ${item.name}`} />

            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-4 sm:mb-6">
                    <Link
                        href="/officer/items"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 sm:text-sm"
                    >
                        <ChevronLeft size={14} /> Kembali
                    </Link>
                </div>

                {/* Grid dengan items-stretch agar kolom kiri dan kanan sama tinggi */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                    {/* Left Column: Detail Barang (akan stretch setinggi kolom kanan) */}
                    <div className="h-full lg:col-span-2">
                        <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="p-5 sm:p-8">
                                <h1 className="text-xl leading-tight font-extrabold text-slate-900 sm:text-2xl lg:text-3xl">{item.name}</h1>
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 sm:text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Tag size={14} /> {item.category.name}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} /> {item.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} /> {formatDate(item.date)}
                                    </div>
                                </div>
                            </div>

                            {item.images?.length > 0 && (
                                <div className="border-t border-slate-100 p-5 sm:p-8">
                                    <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase sm:text-xs">
                                        <ImageIcon size={12} /> Foto Barang
                                    </h3>
                                    <div className="flex flex-wrap gap-3 sm:gap-4">
                                        {item.images.map((img) => (
                                            <a
                                                key={img.id}
                                                href={`/storage/${img.image_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 sm:h-32 sm:w-32"
                                            >
                                                <img
                                                    src={`/storage/${img.image_path}`}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                                                    alt=""
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-8">
                                <h3 className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase sm:text-xs">Deskripsi</h3>
                                <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                                    {item.description || <span className="text-slate-400 italic">Tidak ada deskripsi.</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Status, Manajemen, Pelapor) */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase sm:text-xs">Status</h2>
                            <div className="space-y-3">
                                <StatusRow label="Jenis" status={item.report_type} getStyles={getStatusStyles} />
                                <StatusRow label="Penanganan" status={item.handling_status || 'menunggu_penyerahan'} getStyles={getStatusStyles} />
                                <StatusRow label="Laporan" status={item.report_status} getStyles={getStatusStyles} />
                            </div>
                        </div>

                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm ring-1 ring-indigo-500/10">
                            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                                <ShieldCheck size={18} className="text-indigo-600" /> Manajemen
                            </h2>
                            {item.handling_status === 'menunggu_penyerahan' && (
                                <button
                                    onClick={handleVerifyHandover}
                                    className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
                                >
                                    <CheckCircle size={16} /> Verifikasi Serah Terima
                                </button>
                            )}
                            <form onSubmit={submit} className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Update Penanganan</label>
                                    <select
                                        value={data.handling_status}
                                        onChange={(e) => setData('handling_status', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="menunggu_penyerahan">Menunggu Penyerahan</option>
                                        <option value="dititipkan_petugas">Dititipkan Petugas</option>
                                        <option value="diklaim">Diklaim</option>
                                        <option value="dikembalikan">Dikembalikan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Update Status Laporan</label>
                                    <select
                                        value={data.report_status}
                                        onChange={(e) => setData('report_status', e.target.value as any)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="ditutup">Ditutup</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </form>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <User size={12} /> Pelapor
                            </h2>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{item.user.name}</p>
                                    <p className="text-xs text-slate-500">{item.user.kelas || 'Kelas -'}</p>
                                </div>
                                {item.user.no_hp && (
                                    <div className="pt-1">
                                        <a
                                            href={`https://wa.me/${item.user.no_hp}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-medium text-indigo-600 hover:underline"
                                        >
                                            WhatsApp Pelapor
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* History Section - Full width di bawah */}
                    <div className="mt-2 sm:mt-6 lg:col-span-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                            <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                                <History size={18} className="text-indigo-600" /> Riwayat Aktivitas
                            </h2>
                            <div className="relative space-y-6 before:absolute before:left-[9px] before:h-full before:w-0.5 before:bg-slate-100">
                                {sortedHistories.map((h) => (
                                    <div key={h.id} className="relative pl-7">
                                        <div className="absolute top-1.5 left-0 h-4.5 w-4.5 rounded-full border-2 border-white bg-slate-300 shadow-sm" />
                                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-sm leading-snug font-semibold text-slate-800">{formatHistoryDescription(h)}</p>
                                            <time className="text-[10px] whitespace-nowrap text-slate-400">
                                                {new Date(h.created_at).toLocaleString('id-ID')}
                                            </time>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-500">Oleh: {h.user?.name ?? 'Sistem'}</p>
                                    </div>
                                ))}
                                {sortedHistories.length === 0 && <p className="text-center text-xs text-slate-400">Belum ada riwayat.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}

function StatusRow({ label, status, getStyles }: { label: string; status: string; getStyles: any }) {
    const style = getStyles(status);
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">{label}</span>
            <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${style.bg} ${style.text}`}
            >
                <span className={`h-1 w-1 rounded-full ${style.dot}`} />
                {style.label}
            </span>
        </div>
    );
}
