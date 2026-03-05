// Siswa Dashboard Page
import React from "react";
import { Package, Clock, CheckCircle2, AlertCircle, MoreVertical } from "lucide-react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";


type Stats = { total: number; hilang: number; dititipkan: number; dikembalikan: number; };
type Item = {
    id: number;
    name: string;
    display_status: string;          // computed in backend
    category?: { name: string };
    user?: { name: string };
};
type User = { id: number; name: string; email: string; role: string; };

interface Props {
    auth: { user: User };
    stats: Stats;
    items: Item[];
}

export default function Dashboard({ auth, stats, items }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Halo {auth.user.name}, berikut ringkasan laporan terbaru Anda.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <StatCard title="Total Barang" value={stats.total} icon={<Package className="text-blue-600" />} bg="bg-blue-50" />
                <StatCard title="Barang Hilang" value={stats.hilang} icon={<AlertCircle className="text-red-600" />} bg="bg-red-50" />
                <StatCard title="Dititipkan" value={stats.dititipkan} icon={<Clock className="text-amber-600" />} bg="bg-amber-50" />
                <StatCard title="Dikembalikan" value={stats.dikembalikan} icon={<CheckCircle2 className="text-emerald-600" />} bg="bg-emerald-50" />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 lg:px-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-slate-800">Barang Terbaru</h2>
                    <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                        Lihat Semua
                    </button>
                </div>

                <div className="overflow-x-auto px-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Barang</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Pelapor</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                            {item.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                                            {item.category?.name ?? "General"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={item.display_status} />
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm hidden lg:table-cell">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600">
                                                {item.user?.name?.charAt(0) ?? "?"}
                                            </div>
                                            {item.user?.name ?? "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
                {/* <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    +12%
                </span> */}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{value.toLocaleString()}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, string> = {
        hilang: "bg-red-50 text-red-600 border-red-100",
        menunggu_penyerahan: "bg-amber-50 text-amber-600 border-amber-100",
        dititipkan_petugas: "bg-blue-50 text-blue-600 border-blue-100",
        diklaim: "bg-purple-50 text-purple-600 border-purple-100",
        dikembalikan: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider whitespace-nowrap ${
            config[status] ?? "bg-slate-50 text-slate-500 border-slate-100"
        }`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
}