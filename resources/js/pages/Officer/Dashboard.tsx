
import React from "react";
import { 
    Package, Clock, AlertCircle, Layers, 
    QrCode, ArrowUpRight, History, CheckCircle2,
    Search, ArrowRight, UserCheck
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import OfficerLayout from "@/layouts/OfficerLayout";

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
    const actionNeeded = recentItems.filter(i => 
        i.display_status === 'menunggu_penyerahan' || i.display_status === 'menunggu_verifikasi'
    );

    return (
            <OfficerLayout>
                <Head title="Officer Terminal" />

                {/* Header: Focused on Action */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Officer Terminal</h1>
                    <p className="text-slate-500 text-sm mt-1">Sistem Persetujuan Klaim & Manajemen Laporan</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href="/officer/verify"
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
                    >
                        <QrCode size={20} />
                        <span>Verifikasi QR</span>
                    </Link>
                </div>
            </div>

            {/* Stats: Slim & Informative */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Barang" value={stats.total_items} icon={<Package size={20} />} color="indigo" />
                <StatCard title="Perlu Tindakan" value={stats.pending_handovers} icon={<AlertCircle size={20} />} color="amber" pulse />
                <StatCard title="Klaim Disetujui" value={12} icon={<UserCheck size={20} />} color="emerald" /> {/* Example hardcoded for design */}
                <StatCard title="Kategori" value={stats.total_categories} icon={<Layers size={20} />} color="slate" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* PRIMARY WORKSPACE: Report Management & Approvals */}
                <div className="lg:col-span-12 xl:col-span-9 space-y-6">
                    
                    {/* SECTION: Needs Immediate Approval */}
                    {actionNeeded.length > 0 && (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl overflow-hidden">
                            <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-800 font-bold text-sm">
                                <AlertCircle size={16} />
                                Butuh Persetujuan / Verifikasi Segera
                            </div>
                            <div className="p-2 space-y-1">
                                {actionNeeded.slice(0, 3).map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">Oleh {item.user.name}</p>
                                            </div>
                                        </div>
                                        <Link href={`/officer/items/${item.id}`} className="bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors uppercase">
                                            Proses Sekarang
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION: Recent Reports Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 lg:px-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">Semua Laporan Terbaru</h2>
                            <Link href="/officer/items" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                Lihat Semua <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail Barang</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Laporan</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Pelapor</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentItems.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                        {item.category?.name ?? "Umum"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={item.display_status} />
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px]">
                                                        {item.user.name.charAt(0)}
                                                    </div>
                                                    {item.user.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/officer/items/${item.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
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
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <History size={16} className="text-slate-400" />
                                Aktivitas
                            </h2>
                            <Link href="/officer/history" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Log</Link>
                        </div>
                        
                        <div className="space-y-6">
                            {stats.recent_history.slice(0, 5).map((log, idx) => (
                                <div key={log.id} className="flex gap-3 relative">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[11px] text-slate-600 leading-tight">
                                            <span className="font-bold text-slate-900">{log.user.name}</span> {log.action}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-none">
                                            {log.created_at}
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
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        slate: "bg-slate-50 text-slate-600 border-slate-100",
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl border ${colorMap[color]} group-hover:scale-105 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-0.5">{title}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-black text-slate-900 tracking-tight">{value.toLocaleString()}</p>
                        {pulse && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, string> = {
        hilang: "text-red-600 bg-red-50 border-red-100",
        menunggu_penyerahan: "text-amber-600 bg-amber-50 border-amber-100",
        dititipkan_petugas: "text-indigo-600 bg-indigo-50 border-indigo-100",
        diklaim: "text-purple-600 bg-purple-50 border-purple-100",
        dikembalikan: "text-emerald-600 bg-emerald-50 border-emerald-100",
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${
            config[status] ?? "bg-slate-50 text-slate-500 border-slate-100"
        }`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
}