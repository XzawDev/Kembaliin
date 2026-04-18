import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import OfficerLayout from '@/layouts/OfficerLayout';
import { Search, Filter, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle, User as UserIcon, Calendar } from 'lucide-react';

interface Claim {
    id: number;
    item: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    admin_notes?: string;
}

interface Props {
    claims: {
        data: Claim[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    currentStatus: string;
}

export default function AllClaims({ claims, currentStatus }: Props) {
    const [statusFilter, setStatusFilter] = useState(currentStatus || 'all');

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get('/officer/claims', { status: status !== 'all' ? status : '' }, { preserveState: true, preserveScroll: true });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-200',
                    icon: <Clock size={14} />,
                };
            case 'approved':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-200',
                    icon: <CheckCircle2 size={14} />,
                };
            case 'rejected':
                return {
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    border: 'border-rose-200',
                    icon: <XCircle size={14} />,
                };
            default:
                return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: null };
        }
    };

    return (
        <OfficerLayout>
            <Head title="Verifikasi Klaim - Panel Petugas" />

            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header & Filter Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Verifikasi Klaim</h1>
                        <p className="mt-1 text-sm font-medium text-slate-500">Kelola dan verifikasi permintaan klaim barang dari siswa.</p>
                    </div>

                    {/* Filter Pills - Scrollable on mobile */}
                    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Filter size={18} className="mr-1 shrink-0 text-slate-400" />
                        {[
                            { id: 'all', label: 'Semua', color: 'teal' },
                            { id: 'pending', label: 'Pending', color: 'amber' },
                            { id: 'approved', label: 'Disetujui', color: 'emerald' },
                            { id: 'rejected', label: 'Ditolak', color: 'rose' },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => handleFilterChange(btn.id)}
                                className={`rounded-full px-5 py-2 text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                                    statusFilter === btn.id
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                        : 'border border-slate-200 bg-white text-slate-500 hover:border-teal-600 hover:text-teal-600'
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Informasi Barang</th>
                                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Pengklaim</th>
                                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-[11px] font-bold tracking-wider text-slate-400 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {claims.data.length > 0 ? (
                                    claims.data.map((claim) => {
                                        const style = getStatusStyle(claim.status);
                                        return (
                                            <tr key={claim.id} className="group transition-colors hover:bg-slate-50/50">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-teal-700">
                                                            {claim.item.name}
                                                        </span>
                                                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                                                            <Calendar size={12} />
                                                            {new Date(claim.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                                            <UserIcon size={14} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-700">{claim.user.name}</span>
                                                            <span className="text-[11px] text-slate-400">{claim.user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div
                                                        className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} px-3 py-1 text-[10px] font-bold uppercase`}
                                                    >
                                                        {style.icon}
                                                        {claim.status === 'pending'
                                                            ? 'Menunggu'
                                                            : claim.status === 'approved'
                                                              ? 'Disetujui'
                                                              : 'Ditolak'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={`/officer/claims/${claim.id}`}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 transition-all hover:bg-teal-600 hover:text-white"
                                                    >
                                                        Detail
                                                        <ChevronRight size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <AlertCircle size={40} className="mb-3 opacity-20" />
                                                <p className="text-sm font-medium">Tidak ada klaim yang ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modern Pagination */}
                {claims.links && claims.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        {claims.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl px-3 text-xs font-bold transition-all ${
                                    link.active
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                        : 'border border-slate-200 bg-white text-slate-500 hover:border-teal-600 hover:text-teal-600'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : 'active:scale-95'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </OfficerLayout>
    );
}
