import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import OfficerLayout from '@/layouts/OfficerLayout';

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
    const [statusFilter, setStatusFilter] = useState(currentStatus);

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get('/officer/claims', { status: status !== 'all' ? status : '' }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Pending</span>;
            case 'approved':
                return <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Disetujui</span>;
            case 'rejected':
                return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Ditolak</span>;
            default:
                return null;
        }
    };

    return (
        <OfficerLayout>
            <Head title="Semua Klaim" />
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Semua Klaim</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`rounded px-3 py-1 ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleFilterChange('pending')}
                            className={`rounded px-3 py-1 ${statusFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => handleFilterChange('approved')}
                            className={`rounded px-3 py-1 ${statusFilter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                        >
                            Disetujui
                        </button>
                        <button
                            onClick={() => handleFilterChange('rejected')}
                            className={`rounded px-3 py-1 ${statusFilter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                        >
                            Ditolak
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barang</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengklaim</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Klaim</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {claims.data.map((claim) => (
                                <tr key={claim.id}>
                                    <td className="px-6 py-4">{claim.item.name}</td>
                                    <td className="px-6 py-4">{claim.user.name}</td>
                                    <td className="px-6 py-4">{getStatusBadge(claim.status)}</td>
                                    <td className="px-6 py-4">{new Date(claim.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/officer/claims/${claim.id}`} className="text-indigo-600 hover:underline">
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {claims.links && claims.links.length > 0 && (
                    <div className="mt-4 flex justify-center space-x-2">
                        {claims.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded px-3 py-1 ${
                                    link.active ? 'bg-indigo-600 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </OfficerLayout>
    );
}
