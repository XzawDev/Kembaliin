// Siswa Dashboard Page - Responsive Mobile
import React from 'react';
import { Package, Clock, CheckCircle2, AlertCircle, MoreVertical } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

type Stats = { total: number; hilang: number; dititipkan: number; dikembalikan: number };
type Item = {
    id: number;
    name: string;
    display_status: string;
    category?: { name: string };
    user?: { name: string };
};
type User = { id: number; name: string; email: string; role: string };

interface Props {
    auth: { user: User };
    stats: Stats;
    items: Item[];
}

export default function Dashboard({ auth, stats, items }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="mb-6 md:mb-8">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Dashboard Overview</h1>
                <p className="mt-1 text-xs text-slate-500 md:text-sm">Halo {auth.user.name}, berikut ringkasan laporan terbaru Anda.</p>
            </div>

            {/* Stats Grid: 2 kolom di mobile, 4 kolom di desktop */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-6 lg:grid-cols-4">
                <StatCard title="Total Barang" value={stats.total} icon={<Package className="text-blue-600" />} bg="bg-blue-50" />
                <StatCard title="Barang Hilang" value={stats.hilang} icon={<AlertCircle className="text-red-600" />} bg="bg-red-50" />
                <StatCard title="Dititipkan" value={stats.dititipkan} icon={<Clock className="text-amber-600" />} bg="bg-amber-50" />
                <StatCard title="Dikembalikan" value={stats.dikembalikan} icon={<CheckCircle2 className="text-emerald-600" />} bg="bg-emerald-50" />
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-4 md:p-5 lg:px-6">
                    <h2 className="font-bold text-slate-800">Barang Terbaru</h2>
                    <Link href="/Siswa/laporan" className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
                        Lihat Semua
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4">
                                    Nama Barang
                                </th>
                                <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4">Kategori</th>
                                <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4">Status</th>
                                <th className="hidden px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4 lg:table-cell">
                                    Pelapor
                                </th>
                                <th className="px-4 py-3 md:px-6 md:py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <tr key={item.id} className="group transition-colors hover:bg-slate-50/50">
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-700 md:px-6 md:py-4">{item.name}</td>
                                    <td className="px-4 py-3 md:px-6 md:py-4">
                                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 md:px-2.5 md:py-1 md:text-[11px]">
                                            {item.category?.name ?? 'General'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4">
                                        <StatusBadge status={item.display_status} />
                                    </td>
                                    <td className="hidden px-4 py-3 text-sm text-slate-600 md:px-6 md:py-4 lg:table-cell">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-600">
                                                {item.user?.name?.charAt(0) ?? '?'}
                                            </div>
                                            {item.user?.name ?? '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right md:px-6 md:py-4">
                                        <Link
                                            href={`/siswa/items/${item.id}`}
                                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                        >
                                            <MoreVertical size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper Components
function StatCard({ title, value, icon, bg }: { title: string; value: number; icon: React.ReactNode; bg: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:rounded-2xl md:p-6">
            <div className="mb-2 flex items-center justify-between md:mb-4">
                <div className={`rounded-lg p-1.5 md:p-2 ${bg}`}>{icon}</div>
            </div>
            <p className="mb-0.5 text-[9px] font-bold tracking-wider text-slate-400 uppercase md:mb-1 md:text-xs">{title}</p>
            <p className="text-lg font-extrabold tracking-tight text-slate-900 md:text-2xl lg:text-3xl">{value.toLocaleString()}</p>
        </div>
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
            className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold tracking-wider whitespace-nowrap uppercase md:px-2.5 md:py-1 md:text-[10px] ${
                config[status] ?? 'border-slate-100 bg-slate-50 text-slate-500'
            }`}
        >
            {status.replace(/_/g, ' ')}
        </span>
    );
}
