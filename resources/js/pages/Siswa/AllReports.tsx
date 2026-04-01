import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Trash2, Eye } from 'lucide-react';

interface Report {
    id: number;
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
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus laporan "${name}"? Laporan akan disembunyikan dari publik dan dashboard Anda.`)) {
            router.delete(`/items/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Semua Laporan Saya" />
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-2xl font-bold">Semua Laporan Saya</h1>
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama Barang</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {reports.data.map((report) => (
                                <tr key={report.id}>
                                    <td className="px-6 py-4">{report.name}</td>
                                    <td className="px-6 py-4">{report.category.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                            {report.report_type === 'hilang' ? 'Hilang' : 'Ditemukan'}
                                        </span>
                                    </td>
                                    <td className="space-x-2 px-6 py-4 text-right">
                                        <Link
                                            href={`/siswa/items/${report.id}`}
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                                        >
                                            <Eye size={16} /> Detail
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(report.id, report.name)}
                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} /> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {reports.links && reports.links.length > 0 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {reports.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-1 text-sm ${
                                    link.active ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
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
