import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import {
    History as HistoryIcon,
    Clock,
    User as UserIcon,
    Package,
    ChevronRight,
    Activity,
    AlertCircle,
    CheckCircle2,
    RefreshCcw,
    Trash2,
    PlusCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryItem {
    id: number;
    action: string;
    description: string | null;
    created_at: string;
    user: { name: string } | null;
    item: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

interface Props {
    histories: {
        data: HistoryItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

// Function to get stylized action tags
function getActionStyle(action: string) {
    const map: Record<string, { label: string; color: string; icon: any }> = {
        'created item': { label: 'Laporan Baru', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: PlusCircle },
        'updated item': { label: 'Edit Laporan', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: RefreshCcw },
        'updated item status': { label: 'Ubah Status', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Activity },
        'handed over to officer': { label: 'Serah Terima', color: 'bg-teal-50 text-teal-700 border-teal-100', icon: CheckCircle2 },
        'soft deleted by owner': { label: 'Hapus Laporan', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: Trash2 },
    };

    const style = map[action] || { label: action, color: 'bg-slate-50 text-slate-700 border-slate-100', icon: HistoryIcon };
    return style;
}

export default function History({ histories }: Props) {
    return (
        <OfficerLayout>
            <Head title="Riwayat Aktivitas - Panel Petugas" />

            <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-1.5 px-4 md:px-0">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-3xl">Riwayat Aktivitas</h1>
                    <p className="text-xs font-medium text-slate-500 md:text-base">Pantau seluruh log perubahan data barang dan tindakan petugas.</p>
                </div>

                {/* Table/List Container */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 md:rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-3 text-[10px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase md:px-6 md:py-4 md:text-[11px]">
                                        Waktu & Petugas
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase md:px-6 md:py-4 md:text-[11px]">
                                        Barang
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase md:px-6 md:py-4 md:text-[11px]">
                                        Tindakan
                                    </th>
                                    <th className="hidden px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase md:table-cell">
                                        Keterangan
                                    </th>
                                    <th className="hidden px-6 py-4 text-right md:table-cell"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {histories.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center md:py-20">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <AlertCircle size={32} className="mb-3 opacity-20 md:h-10 md:w-10" />
                                                <p className="text-xs font-medium md:text-sm">Belum ada riwayat aktivitas tercatat.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    histories.data.map((history) => {
                                        const actionStyle = getActionStyle(history.action);
                                        const ActionIcon = actionStyle.icon;

                                        return (
                                            <tr key={history.id} className="group transition-colors hover:bg-slate-50/50">
                                                {/* Time & User */}
                                                <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 md:text-sm">
                                                            <UserIcon size={12} className="shrink-0 text-slate-400 md:h-3.5 md:w-3.5" />
                                                            {history.user?.name ?? 'Sistem'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 md:text-[11px]">
                                                            <Clock size={10} className="shrink-0 md:h-3 md:w-3" />
                                                            {new Date(history.created_at).toLocaleString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Item Linked */}
                                                <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-5">
                                                    {history.item ? (
                                                        <Link
                                                            href={`/officer/items/${history.item.slug}`}
                                                            className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 md:gap-2 md:text-sm"
                                                        >
                                                            <Package size={14} className="shrink-0 opacity-60 md:h-4 md:w-4" />
                                                            <span className="line-clamp-1 max-w-[120px] md:max-w-none">{history.item.name}</span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-400 italic md:text-xs">
                                                            Barang Terhapus
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action Badge */}
                                                <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-5">
                                                    <div
                                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase transition-all md:gap-1.5 md:px-3 md:py-1 md:text-[10px] ${actionStyle.color}`}
                                                    >
                                                        <ActionIcon size={10} className="shrink-0 md:h-3 md:w-3" />
                                                        {actionStyle.label}
                                                    </div>
                                                </td>

                                                {/* Description - Hidden on Mobile */}
                                                <td className="hidden px-6 py-5 md:table-cell">
                                                    <p className="line-clamp-2 max-w-xs text-xs font-medium text-slate-500">
                                                        {history.description || '-'}
                                                    </p>
                                                </td>

                                                {/* Arrow shortcut - Hidden on Mobile */}
                                                <td className="hidden px-6 py-5 text-right md:table-cell">
                                                    {history.item && (
                                                        <Link
                                                            href={`/officer/items/${history.item.slug}`}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-all hover:bg-teal-50 hover:text-teal-600"
                                                        >
                                                            <ChevronRight size={18} />
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modern Pagination */}
                {histories.links && histories.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1.5 pt-2 md:gap-2 md:pt-4">
                        {histories.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-[10px] font-bold transition-all md:h-9 md:min-w-[36px] md:rounded-xl md:px-3 md:text-xs ${
                                    link.active
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                        : 'border border-slate-200 bg-white text-slate-500 hover:border-teal-600 hover:text-teal-600'
                                } ${!link.url ? 'cursor-not-allowed opacity-40' : 'active:scale-95'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </OfficerLayout>
    );
}
