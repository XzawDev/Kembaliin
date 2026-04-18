import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import { User, Mail, Phone, GraduationCap, Activity, Package, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    kelas: string | null;
    no_hp: string | null;
    is_active: boolean;
    foto: string | null;
    created_at: string;
}

interface Item {
    id: number;
    slug: string;
    name: string;
    report_type: string;
    handling_status: string | null;
    created_at: string;
    category: { name: string };
}

interface Claim {
    id: number;
    status: string;
    created_at: string;
    item: { id: number; slug: string; name: string };
}

interface Props {
    user: User;
    stats: {
        total_items: number;
        total_claims: number;
        total_pending_claims: number;
        total_approved_claims: number;
        total_rejected_claims: number;
    };
    items: Item[];
    claims: Claim[];
}

export default function UserShow({ user, stats, items, claims }: Props) {
    const [activeTab, setActiveTab] = useState<'items' | 'claims'>('items');

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Menunggu</span>;
            case 'approved':
                return <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Disetujui</span>;
            case 'rejected':
                return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Ditolak</span>;
            default:
                return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">{status}</span>;
        }
    };

    const getItemStatusBadge = (item: Item) => {
        if (item.report_type === 'hilang') {
            return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Hilang</span>;
        } else {
            const statusMap: Record<string, string> = {
                menunggu_penyerahan: 'Menunggu Penyerahan',
                dititipkan_petugas: 'Dititipkan',
                diklaim: 'Diklaim',
                dikembalikan: 'Dikembalikan',
            };
            return (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {statusMap[item.handling_status || 'menunggu_penyerahan']}
                </span>
            );
        }
    };

    return (
        <OfficerLayout>
            <Head title={`Detail User - ${user.name}`} />
            <div className="mx-auto max-w-5xl px-4 py-8">
                {/* Header & Back Button */}
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/officer/users" className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                        ← Kembali
                    </Link>
                </div>

                {/* Profil User */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <div className="flex items-center gap-4">
                            {user.foto ? (
                                <img src={`/storage/${user.foto}`} alt={user.name} className="h-24 w-24 rounded-xl object-cover" />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                                <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        <div>
                            <h2 className="mb-3 text-sm font-bold text-slate-600 uppercase">Informasi Akun</h2>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="text-slate-700">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={16} className="text-slate-400" />
                                    <span className="text-slate-700">{user.no_hp || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <GraduationCap size={16} className="text-slate-400" />
                                    <span className="text-slate-700">{user.kelas || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Activity size={16} className="text-slate-400" />
                                    <span className="text-slate-700">Bergabung: {formatDate(user.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-slate-700">Status: {user.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-3 text-sm font-bold text-slate-600 uppercase">Statistik</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-blue-50 p-3 text-center">
                                    <p className="text-2xl font-bold text-blue-700">{stats.total_items}</p>
                                    <p className="text-xs text-blue-600">Laporan</p>
                                </div>
                                <div className="rounded-xl bg-purple-50 p-3 text-center">
                                    <p className="text-2xl font-bold text-purple-700">{stats.total_claims}</p>
                                    <p className="text-xs text-purple-600">Pengajuan Klaim</p>
                                </div>
                                <div className="rounded-xl bg-yellow-50 p-3 text-center">
                                    <p className="text-2xl font-bold text-yellow-700">{stats.total_pending_claims}</p>
                                    <p className="text-xs text-yellow-600">Pending</p>
                                </div>
                                <div className="rounded-xl bg-green-50 p-3 text-center">
                                    <p className="text-2xl font-bold text-green-700">{stats.total_approved_claims}</p>
                                    <p className="text-xs text-green-600">Disetujui</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs untuk Laporan dan Klaim */}
                <div className="mt-8">
                    <div className="flex gap-2 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('items')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === 'items' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Package size={16} className="mr-1 inline" /> Laporan ({stats.total_items})
                        </button>
                        <button
                            onClick={() => setActiveTab('claims')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === 'claims' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <ClipboardList size={16} className="mr-1 inline" /> Pengajuan Klaim ({stats.total_claims})
                        </button>
                    </div>

                    <div className="mt-4">
                        {activeTab === 'items' &&
                            (items.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barang</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 text-sm">{item.name}</td>
                                                    <td className="px-6 py-4 text-sm">{item.category.name}</td>
                                                    <td className="px-6 py-4">{getItemStatusBadge(item)}</td>
                                                    <td className="px-6 py-4 text-sm">{formatDate(item.created_at)}</td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={`/items/${item.slug}`}
                                                            className="text-indigo-600 hover:underline"
                                                            target="_blank"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-slate-400">
                                    <Package size={40} className="mx-auto mb-2 opacity-30" />
                                    <p>User belum membuat laporan apapun.</p>
                                </div>
                            ))}

                        {activeTab === 'claims' &&
                            (claims.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barang</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Klaim</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Klaim</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {claims.map((claim) => (
                                                <tr key={claim.id}>
                                                    <td className="px-6 py-4 text-sm">{claim.item.name}</td>
                                                    <td className="px-6 py-4">{getStatusBadge(claim.status)}</td>
                                                    <td className="px-6 py-4 text-sm">{formatDate(claim.created_at)}</td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={`/items/${claim.item.slug}`}
                                                            className="text-indigo-600 hover:underline"
                                                            target="_blank"
                                                        >
                                                            Lihat Barang
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-slate-400">
                                    <ClipboardList size={40} className="mx-auto mb-2 opacity-30" />
                                    <p>User belum pernah mengajukan klaim.</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}
