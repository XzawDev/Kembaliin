import React from 'react';
import { Package, Clock, AlertCircle, Layers, QrCode, ArrowUpRight, History, CheckCircle2, Search, ArrowRight, UserCheck } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';

interface Stats {
    total_items: number;
    pending_handovers: number;
    total_categories: number;
    recent_history: any[];
}

interface Item {
    id: number;
    name: string;
    report_type: string;
    display_status: string;
    slug: string;
    user: { name: string };
    category?: { name: string };
    created_at: string;
}

interface Props {
    auth: { user: any };
    stats: Stats;
    recentItems: Item[];
}

export default function OfficerDashboard({ auth, stats, recentItems }: Props) {
    // Filter items that need immediate approval or action
    const actionNeeded = recentItems.filter((i) => i.display_status === 'menunggu_penyerahan' || i.display_status === 'menunggu_verifikasi');

    return (
        <OfficerLayout>
            <Head title="Officer Terminal" />

            {/* Header: Focused on Action */}
            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Officer Terminal</h1>
                    <p className="mt-1 text-sm text-slate-500">Sistem Persetujuan Klaim & Manajemen Laporan</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/officer/verify"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 lg:flex-none"
                    >
                        <QrCode size={20} />
                        <span>Verifikasi QR</span>
                    </Link>
                </div>
            </div>

            {/* Stats: Slim & Informative */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Barang" value={stats.total_items} icon={<Package size={20} />} color="indigo" />
                <StatCard title="Perlu Tindakan" value={stats.pending_handovers} icon={<AlertCircle size={20} />} color="amber" pulse />
                <StatCard title="Klaim Disetujui" value={12} icon={<UserCheck size={20} />} color="emerald" /> {/* Example hardcoded for design */}
                <StatCard title="Kategori" value={stats.total_categories} icon={<Layers size={20} />} color="slate" />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* PRIMARY WORKSPACE: Report Management & Approvals */}
                <div className="space-y-6 lg:col-span-12 xl:col-span-9">
                    {/* SECTION: Needs Immediate Approval */}
                    {actionNeeded.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/50">
                            <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                                <AlertCircle size={16} />
                                Butuh Persetujuan / Verifikasi Segera
                            </div>
                            <div className="space-y-1 p-2">
                                {actionNeeded.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-xl border border-amber-100 bg-white p-3 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                <p className="text-[10px] font-medium text-slate-500">Oleh {item.user.name}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/officer/items/${item.slug}`}
                                            className="rounded-lg bg-amber-600 px-3 py-1.5 text-[10px] font-bold text-white uppercase transition-colors hover:bg-amber-700"
                                        >
                                            Proses Sekarang
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION: Recent Reports Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5 lg:px-6">
                            <h2 className="font-bold text-slate-800">Semua Laporan Terbaru</h2>
                            <Link href="/officer/items" className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
                                Lihat Semua <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Detail Barang</th>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Status Laporan</th>
                                        <th className="hidden px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:table-cell">
                                            Pelapor
                                        </th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentItems.map((item) => (
                                        <tr key={item.id} className="group transition-colors hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 transition-colors group-hover:text-indigo-600">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                                                        {item.category?.name ?? 'Umum'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={item.display_status} />
                                            </td>
                                            <td className="hidden px-6 py-4 md:table-cell">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[10px]">
                                                        {item.user.name.charAt(0)}
                                                    </div>
                                                    {item.user.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/officer/items/${item.slug}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    <ArrowUpRight size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* SECONDARY AREA: History (Less Prominent) */}
                <div className="lg:col-span-12 xl:col-span-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                <History size={16} className="text-slate-400" />
                                Aktivitas
                            </h2>
                            <Link href="/officer/history" className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                                Log
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {stats.recent_history.slice(0, 5).map((log) => (
                                <div key={log.id} className="relative flex gap-3">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-200" />
                                    <div className="flex-1">
                                        <p className="text-xs leading-tight text-slate-600">
                                            <span className="font-bold text-slate-900">{log.user?.name ?? 'Sistem'}</span>{' '}
                                            {log.description || log.action}
                                        </p>
                                        <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase">
                                            {new Date(log.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}

// Sub-components
function StatCard({ title, value, icon, color, pulse = false }: any) {
    const colorMap: any = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        slate: 'bg-slate-50 text-slate-600 border-slate-100',
    };

    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className={`rounded-xl border p-2.5 ${colorMap[color]} transition-transform group-hover:scale-105`}>{icon}</div>
                <div>
                    <p className="mb-0.5 text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">{title}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-black tracking-tight text-slate-900">{value.toLocaleString()}</p>
                        {pulse && <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, string> = {
        hilang: 'text-red-600 bg-red-50 border-red-100',
        menunggu_penyerahan: 'text-amber-600 bg-amber-50 border-amber-100',
        dititipkan_petugas: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        diklaim: 'text-purple-600 bg-purple-50 border-purple-100',
        dikembalikan: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    };

    return (
        <span
            className={`rounded-lg border px-2.5 py-1 text-[9px] font-black tracking-widest uppercase ${
                config[status] ?? 'border-slate-100 bg-slate-50 text-slate-500'
            }`}
        >
            {status.replace(/_/g, ' ')}
        </span>
    );
}
