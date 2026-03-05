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
        id: any; name: string 
};
}

interface Props {
    histories: {
        data: HistoryItem[];
        links: any; // for pagination
    };
}

export default function History({ histories }: Props) {
    return (
        <OfficerLayout>
            <Head title="Activity History" />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Activity History</h1>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Officer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {histories.data.map(history => (
                                <tr key={history.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                        {new Date(history.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium">{history.user?.name ?? 'System'}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/officer/items/${history.item.id}`} className="text-indigo-600 hover:underline">
                                            {history.item.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 capitalize">
                                            {history.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{history.description || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination links (simplified) */}
                <div className="mt-6 flex justify-between">
                    {histories.links?.prev && <Link href={histories.links.prev} className="text-indigo-600">Previous</Link>}
                    {histories.links?.next && <Link href={histories.links.next} className="text-indigo-600">Next</Link>}
                </div>
            </div>
        </OfficerLayout>
    );
}