import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';

interface Item {
    id: number;
    name: string;
    report_type: string;
    handling_status: string | null;
    user: { name: string };
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

    return (
        <OfficerLayout>
            <Head title="Manage Items" />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">All Items</h1>
                    <Link href="/officer/verify" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
                        Scan QR
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex gap-4">
                    <select value={filter.handling_status || ''} onChange={e => setFilter({ ...filter, handling_status: e.target.value || undefined })}>
                        <option value="">All Status</option>
                        <option value="menunggu_penyerahan">Menunggu Penyerahan</option>
                        <option value="dititipkan_petugas">Dititipkan</option>
                        <option value="diklaim">Diklaim</option>
                        <option value="dikembalikan">Dikembalikan</option>
                    </select>
                    <select value={filter.report_type || ''} onChange={e => setFilter({ ...filter, report_type: e.target.value || undefined })}>
                        <option value="">All Types</option>
                        <option value="hilang">Hilang</option>
                        <option value="ditemukan">Ditemukan</option>
                    </select>
                    <button onClick={applyFilter} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Apply</button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th>Name</th><th>Type</th><th>Status</th><th>Reporter</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemList.length > 0 ? itemList.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.report_type}</td>
                                    <td><span className="px-2 py-1 text-xs rounded-full bg-slate-100">{item.handling_status || '-'}</span></td>
                                    <td>{item.user?.name ?? 'Unknown'}</td>
                                    <td><Link href={`/officer/items/${item.id}`} className="text-indigo-600 hover:underline">View</Link></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="text-center py-8">No items found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </OfficerLayout>
    );
}