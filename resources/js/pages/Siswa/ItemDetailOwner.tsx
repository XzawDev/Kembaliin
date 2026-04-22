import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ArrowLeft, Edit3, Trash2, MapPin, Calendar, Tag, History, QrCode, Package, Info } from 'lucide-react';
import OfficerLayout from '@/layouts/OfficerLayout';

interface ItemImage {
    id: number;
    url: string;
}
interface ItemHistory {
    id: number;
    description: string;
    created_at: string;
}
interface Item {
    id: number;
    slug: string;
    name: string;
    description: string;
    location: string;
    date: string;
    display_status: string;
    report_type: string;
    handling_status?: string;
    category?: { id: number; name: string };
    images: ItemImage[];
    histories?: ItemHistory[];
}

interface Props {
    item: Item;
    qrCodeDataUri?: string | null; // ✅ ganti nama dan tipe
}

export default function ItemDetailOwner({ item, qrCodeDataUri }: Props) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role;
    const Layout = userRole === 'petugas' || userRole === 'admin' ? OfficerLayout : AuthenticatedLayout;
    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/items/${item.slug}`);
        }
    };

    return (
        <Layout>
            <Head title={`Detail Laporan: ${item.name}`} />

            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/Siswa/laporan"
                        className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-teal-600"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Laporan
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/items/${item.slug}/edit`}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                        >
                            <Edit3 size={16} />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100"
                        >
                            <Trash2 size={16} />
                            Hapus
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="p-1">
                                {item.images.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-[1.25rem]">
                                        <div className={item.images.length === 1 ? 'col-span-2' : 'col-span-1'}>
                                            <img src={item.images[0].url} className="h-64 w-full object-cover md:h-80" alt={item.name} />
                                        </div>
                                        {item.images.slice(1, 3).map((img) => (
                                            <div key={img.id} className={item.images.length === 2 ? 'col-span-1' : 'col-span-1 h-32 md:h-40'}>
                                                <img src={img.url} className="h-full w-full object-cover" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center rounded-[1.25rem] bg-slate-50 text-slate-400">
                                        <Package size={48} strokeWidth={1} />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="mb-4 flex items-center gap-2">
                                    <StatusBadge status={item.display_status} />
                                    <span
                                        className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                                            item.report_type === 'hilang' ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600'
                                        }`}
                                    >
                                        Barang {item.report_type}
                                    </span>
                                </div>

                                <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{item.name}</h1>

                                <div className="mt-6 grid grid-cols-1 gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-slate-50 p-2.5 text-slate-500">
                                            <Tag size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Kategori</p>
                                            <p className="text-sm font-bold text-slate-700">{item.category?.name || 'Umum'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-slate-50 p-2.5 text-slate-500">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Lokasi</p>
                                            <p className="text-sm font-bold text-slate-700">{item.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-slate-50 p-2.5 text-slate-500">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Tanggal</p>
                                            <p className="text-sm font-bold text-slate-700">
                                                {new Date(item.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <Info size={16} className="text-teal-600" />
                                        Deskripsi Tambahan
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        {item.description || 'Tidak ada deskripsi tambahan.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* ✅ QR Code dengan Data URI */}
                        {qrCodeDataUri && (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-2 border-b border-slate-50 pb-4">
                                    <QrCode size={20} className="text-teal-600" />
                                    <h3 className="font-bold text-slate-900">QR Code Laporan</h3>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="rounded-2xl border-2 border-slate-50 p-2">
                                        <img src={qrCodeDataUri} alt="Item QR" className="h-40 w-40" />
                                    </div>
                                    <p className="mt-4 text-center text-xs font-medium text-slate-500">
                                        Tunjukkan QR ini kepada petugas sekolah untuk proses verifikasi.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Activity History */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                                <History size={20} className="text-teal-600" />
                                <h3 className="font-bold text-slate-900">Riwayat Laporan</h3>
                            </div>
                            <div className="relative space-y-6">
                                <div className="absolute top-2 left-2.5 h-[calc(100%-16px)] w-0.5 bg-slate-100"></div>

                                {item.histories?.map((h, i) => (
                                    <div key={h.id} className="relative flex gap-4 pl-8">
                                        <div className="absolute top-1 left-0 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-slate-100">
                                            <div className={`h-2 w-2 rounded-full ${i === 0 ? 'animate-pulse bg-teal-500' : 'bg-slate-300'}`}></div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{h.description}</p>
                                            <p className="mt-1 text-[10px] font-medium text-slate-400">
                                                {new Date(h.created_at).toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {(!item.histories || item.histories.length === 0) && (
                                    <p className="py-4 text-center text-xs text-slate-400 italic">Belum ada riwayat aktivitas.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, string> = {
        hilang: 'bg-red-50 text-red-600 border-red-100',
        menunggu_penyerahan: 'bg-amber-50 text-amber-600 border-amber-100',
        dititipkan_petugas: 'bg-blue-50 text-blue-600 border-blue-100',
        diklaim: 'bg-purple-50 text-purple-600 border-purple-100',
        dikembalikan: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    };

    return (
        <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold tracking-wider whitespace-nowrap uppercase ${
                config[status] ?? 'border-slate-100 bg-slate-50 text-slate-500'
            }`}
        >
            {status.replace(/_/g, ' ')}
        </span>
    );
}
