import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';

interface HistoryItem {
    id: number;
    action: string;
    description: string | null;
    created_at: string;
    user: { name: string } | null;
    item: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    histories: {
        data: HistoryItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

// Fungsi untuk mendapatkan label aksi yang mudah dibaca
function getActionLabel(action: string): string {
    const actionMap: Record<string, string> = {
        'created item': 'Buat Laporan',
        'updated item': 'Edit Laporan',
        'updated item status': 'Ubah Status',
        'handed over to officer': 'Serah Terima',
        'soft deleted by owner': 'Hapus Laporan',
    };
    return actionMap[action] || action;
}

export default function History({ histories }: Props) {
    return (
        <OfficerLayout>
            <Head title="Riwayat Aktivitas" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-slate-900">Riwayat Aktivitas</h1>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Petugas</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Barang</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Aksi</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {histories.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Belum ada riwayat aktivitas.
                                        </td>
                                    </tr>
                                ) : (
                                    histories.data.map((history) => (
                                        <tr key={history.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                                                {new Date(history.created_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">{history.user?.name ?? 'Sistem'}</td>
                                            <td className="px-6 py-4">
                                                {history.item ? (
                                                    <Link
                                                        href={`/officer/items/${history.item.id}`}
                                                        className="font-medium text-indigo-600 hover:underline"
                                                    >
                                                        {history.item.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-slate-400 italic">(Barang telah dihapus)</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                    {getActionLabel(history.action)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{history.description || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {histories.links && histories.links.length > 0 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {histories.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                                    link.active ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </OfficerLayout>
    );
}
