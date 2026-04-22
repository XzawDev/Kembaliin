import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import { Search, Eye, QrCode, Package, RotateCcw, Trash2, RefreshCw, Edit } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    report_type: string;
    slug: string;
    report_status: 'aktif' | 'selesai' | 'ditutup';
    handling_status: string | null;
    user: { name: string };
    deleted_at?: string | null;
}

interface Props {
    items: { data?: Item[] } | Item[];
    filters: { handling_status?: string; report_type?: string };
}

export default function OfficerItems({ items, filters }: Props) {
    const [filter, setFilter] = useState(filters || {});
    const itemList = Array.isArray(items) ? items : items?.data || [];

    const applyFilter = () => {
        router.get('/officer/items', filter, { preserveState: true });
    };

    const resetFilter = () => {
        setFilter({});
        router.get('/officer/items', {});
    };

    const handleRestore = (slug: string) => {
        if (confirm('Pulihkan item ini?')) {
            router.patch(`/officer/items/${slug}/restore`);
        }
    };

    const handleForceDelete = (slug: string) => {
        if (confirm('Hapus permanen? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/officer/items/${slug}/force`);
        }
    };

    const getHandlingStatusStyles = (status: string | null) => {
        switch (status) {
            case 'menunggu_penyerahan':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'dititipkan_petugas':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'diklaim':
                return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'dikembalikan':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getReportStatusStyles = (status: string) => {
        switch (status) {
            case 'aktif':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'selesai':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'ditutup':
                return 'bg-slate-100 text-slate-600 border-slate-200';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <OfficerLayout>
            <Head title="Manage Items" />

            <div className="mx-auto max-w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">All Items</h1>
                        <p className="text-sm text-slate-500">Inventory and status tracking</p>
                    </div>
                    <Link
                        href="/officer/verify"
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 sm:py-2.5"
                    >
                        <QrCode size={18} />
                        <span>Scan QR</span>
                    </Link>
                </div>

                {/* Filter Section */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-col gap-2">
                                <label className="ml-1 text-[11px] font-bold tracking-[0.05em] text-slate-400 uppercase">Handling Status</label>
                                <select
                                    className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition-all focus:border-indigo-500 focus:ring-indigo-500 sm:w-56"
                                    value={filter.handling_status || ''}
                                    onChange={(e) => setFilter({ ...filter, handling_status: e.target.value || undefined })}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="menunggu_penyerahan">Menunggu Penyerahan</option>
                                    <option value="dititipkan_petugas">Dititipkan</option>
                                    <option value="diklaim">Diklaim</option>
                                    <option value="dikembalikan">Dikembalikan</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="ml-1 text-[11px] font-bold tracking-[0.05em] text-slate-400 uppercase">Report Type</label>
                                <select
                                    className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition-all focus:border-indigo-500 focus:ring-indigo-500 sm:w-44"
                                    value={filter.report_type || ''}
                                    onChange={(e) => setFilter({ ...filter, report_type: e.target.value || undefined })}
                                >
                                    <option value="">All Types</option>
                                    <option value="hilang">Hilang</option>
                                    <option value="ditemukan">Ditemukan</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 border-t border-slate-100 pt-5 lg:border-none lg:pt-0">
                            <button
                                onClick={applyFilter}
                                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] lg:flex-none"
                            >
                                <Search size={18} />
                                Apply Filters
                            </button>
                            {(filter.handling_status || filter.report_type) && (
                                <button
                                    onClick={resetFilter}
                                    title="Reset Filters"
                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-red-500"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-separate border-spacing-0 text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase sm:px-6">Item</th>
                                    <th className="px-4 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase sm:px-6">Type</th>
                                    <th className="hidden px-4 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase sm:px-6 md:table-cell">
                                        Reporter
                                    </th>
                                    <th className="px-4 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase sm:px-6">Handling</th>
                                    <th className="px-4 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase sm:px-6">Report</th>
                                    <th className="px-4 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase sm:px-6">Status</th>
                                    <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-slate-400 uppercase sm:px-6">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {itemList.length > 0 ? (
                                    itemList.map((item) => {
                                        const isDeleted = !!item.deleted_at;
                                        return (
                                            <tr
                                                key={item.id}
                                                className={`group transition-colors hover:bg-slate-50/50 ${isDeleted ? 'bg-red-50/30' : ''}`}
                                            >
                                                <td className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:h-9 sm:w-9">
                                                            <Package className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className="truncate text-[13px] font-bold text-slate-700 sm:text-sm"
                                                                    style={{ maxWidth: '120px' }}
                                                                >
                                                                    {item.name}
                                                                </span>
                                                                {isDeleted && (
                                                                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">
                                                                        Deleted
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] font-medium text-slate-400 sm:hidden">ID: #{item.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <span className="text-[12px] font-medium text-slate-600 capitalize sm:text-sm">
                                                        {item.report_type}
                                                    </span>
                                                </td>
                                                <td className="hidden px-4 py-4 text-sm text-slate-500 sm:px-6 md:table-cell">
                                                    {item.user?.name ?? 'Unknown'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase sm:px-2.5 sm:text-[11px] ${getHandlingStatusStyles(item.handling_status)}`}
                                                    >
                                                        {item.handling_status?.replace('_', ' ') || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase sm:px-2.5 sm:text-[11px] ${getReportStatusStyles(item.report_status)}`}
                                                    >
                                                        {item.report_status === 'aktif'
                                                            ? 'Aktif'
                                                            : item.report_status === 'selesai'
                                                              ? 'Selesai'
                                                              : 'Ditutup'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                    {isDeleted ? (
                                                        <span className="text-[10px] font-medium text-red-500">Deleted</span>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-500">Active</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-right sm:px-6">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={`/officer/items/${item.slug}`}
                                                            className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-600 hover:text-indigo-600 sm:h-9 sm:px-3 sm:text-xs"
                                                        >
                                                            <Eye size={14} className="sm:mr-1" />
                                                            <span className="hidden sm:inline">View</span>
                                                        </Link>
                                                        {!isDeleted && (
                                                            <>
                                                                <Link
                                                                    href={`/items/${item.slug}/edit`}
                                                                    className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-600 shadow-sm transition-all hover:border-amber-600 hover:text-amber-600 sm:h-9 sm:px-3 sm:text-xs"
                                                                >
                                                                    <Edit size={14} className="sm:mr-1" />
                                                                    <span className="hidden sm:inline">Edit</span>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleForceDelete(item.slug)}
                                                                    className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-white px-2 text-[11px] font-bold text-red-600 shadow-sm transition-all hover:border-red-600 hover:bg-red-50 sm:h-9 sm:px-3 sm:text-xs"
                                                                >
                                                                    <Trash2 size={14} className="sm:mr-1" />
                                                                    <span className="hidden sm:inline">Delete</span>
                                                                </button>
                                                            </>
                                                        )}
                                                        {isDeleted ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleRestore(item.slug)}
                                                                    className="inline-flex h-8 items-center justify-center rounded-lg border border-green-200 bg-green-50 px-2 text-[11px] font-bold text-green-700 shadow-sm transition-all hover:bg-green-100 sm:h-9 sm:px-3 sm:text-xs"
                                                                >
                                                                    <RefreshCw size={14} className="sm:mr-1" />
                                                                    <span className="hidden sm:inline">Restore</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleForceDelete(item.slug)}
                                                                    className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2 text-[11px] font-bold text-red-700 shadow-sm transition-all hover:bg-red-100 sm:h-9 sm:px-3 sm:text-xs"
                                                                >
                                                                    <Trash2 size={14} className="sm:mr-1" />
                                                                    <span className="hidden sm:inline">Force Delete</span>
                                                                </button>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Package size={40} className="mb-2 opacity-20" />
                                                <p className="text-sm font-medium">No items found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}
