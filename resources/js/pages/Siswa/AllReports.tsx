import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Trash2, Eye } from 'lucide-react';

interface Report {
    id: number;
    slug: string; // tambahkan slug
    name: string;
    category: { name: string };
    report_type: 'hilang' | 'ditemukan';
}

interface AllReportsProps {
    reports: {
        data: Report[];
        links?: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function AllReports({ reports }: AllReportsProps) {
    const handleDelete = (slug: string, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus laporan "${name}"? Laporan akan disembunyikan dari publik dan dashboard Anda.`)) {
            router.delete(`/items/${slug}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Semua Laporan Saya" />
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Semua Laporan Saya</h1>
                    <p className="mt-1 text-xs text-slate-500 md:text-sm">
                        Kelola dan pantau semua laporan barang hilang dan ditemukan Anda di sini.
                    </p>
                </div>

                {/* Table Section (Styled like Dashboard) */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4">
                                        Nama Barang
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold tracking-widest text-slate-400 uppercase md:px-6 md:py-4">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reports.data.map((report) => (
                                    <tr key={report.id} className="group transition-colors hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-sm font-semibold text-slate-700 md:px-6 md:py-4">{report.name}</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 md:px-2.5 md:py-1 md:text-[11px]">
                                                {report.category.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <ReportStatusBadge type={report.report_type} />
                                        </td>
                                        <td className="px-4 py-3 text-right md:px-6 md:py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/siswa/items/${report.slug}`}
                                                    title="Lihat Detail"
                                                    className="rounded-lg p-2 text-indigo-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(report.slug, report.name)}
                                                    title="Hapus Laporan"
                                                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {reports.links && reports.links.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {reports.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    link.active
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// Helper Component untuk Status Laporan
function ReportStatusBadge({ type }: { type: 'hilang' | 'ditemukan' }) {
    const isHilang = type === 'hilang';
    return (
        <span
            className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase md:px-2.5 md:py-1 md:text-[10px] ${
                isHilang ? 'border-red-100 bg-red-50 text-red-600' : 'border-green-100 bg-green-50 text-green-600'
            }`}
        >
            {isHilang ? 'Hilang' : 'Ditemukan'}
        </span>
    );
}
