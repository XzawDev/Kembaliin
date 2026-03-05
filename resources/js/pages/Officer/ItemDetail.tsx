import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react'; // <-- import router
import OfficerLayout from '@/layouts/OfficerLayout';

interface Item {
    id: number;
    name: string;
    description: string | null;
    location: string;
    date: string;
    report_type: 'hilang' | 'ditemukan';
    report_status: 'dicari' | 'ditemukan' | 'ditutup';
    handling_status: 'menunggu_penyerahan' | 'dititipkan_petugas' | 'diklaim' | 'dikembalikan' | null;
    qr_code: string | null;
    user: { id: number; name: string };
    category: { id: number; name: string };
    images: Array<{ id: number; image_path: string }>;
    histories: Array<{
        description: any;
        id: number;
        action: string;
        created_at: string;
        user: { id: number; name: string } | null;
    }>;
    verified_by?: number | null;
}

interface Props {
    item: Item;
}

export default function ItemDetail({ item }: Props) {
    const { data, setData, put, processing } = useForm({
        handling_status: item.handling_status || '',
        report_status: item.report_status || 'dicari',
        verified_by: item.verified_by || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/officer/items/${item.id}`);
    };

    const handleVerifyHandover = () => {
        if (confirm('Verify handover of this item?')) {
            router.post(`/officer/items/${item.id}/verify-handover`);
        }
    };

    if (!item?.user) {
        return (
            <OfficerLayout>
                <div className="max-w-4xl mx-auto py-10 px-4">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <p className="text-red-600 font-medium">Item data is incomplete.</p>
                        <Link href="/officer/items" className="mt-4 inline-block text-indigo-600 hover:underline">
                            Back to Items
                        </Link>
                    </div>
                </div>
            </OfficerLayout>
        );
    }

    return (
        <OfficerLayout>
            <Head title={`Item: ${item.name}`} />
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
                    <Link href="/officer/items" className="text-indigo-600 hover:underline">← Back</Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    {/* Item details (reporter, category, etc.) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div><p className="text-sm text-slate-500">Reporter</p><p className="font-medium">{item.user.name}</p></div>
                        <div><p className="text-sm text-slate-500">Category</p><p className="font-medium">{item.category.name}</p></div>
                        <div><p className="text-sm text-slate-500">Location</p><p className="font-medium">{item.location}</p></div>
                        <div><p className="text-sm text-slate-500">Date</p><p className="font-medium">{item.date}</p></div>
                        <div><p className="text-sm text-slate-500">Report Type</p><p className="font-medium capitalize">{item.report_type}</p></div>
                        <div><p className="text-sm text-slate-500">QR Code</p><p className="font-mono text-xs bg-slate-100 p-1 rounded">{item.qr_code ?? '-'}</p></div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-slate-500">Description</p>
                        <p className="mt-1">{item.description || '-'}</p>
                    </div>

                    {item.images?.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-medium mb-2">Images</p>
                            <div className="flex gap-2 flex-wrap">
                                {item.images.map(img => (
                                    <img key={img.id} src={img.image_path} className="w-24 h-24 object-cover rounded-lg border" alt="" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Update Form */}
                    <form onSubmit={submit} className="border-t pt-6">
                        <h2 className="font-bold text-lg mb-4">Update Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Handling Status</label>
                                <select
                                    value={data.handling_status}
                                    onChange={e => setData('handling_status', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="">None</option>
                                    <option value="menunggu_penyerahan">Menunggu Penyerahan</option>
                                    <option value="dititipkan_petugas">Dititipkan</option>
                                    <option value="diklaim">Diklaim</option>
                                    <option value="dikembalikan">Dikembalikan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Report Status</label>
                                <select
                                    value={data.report_status}
                                    onChange={e => setData('report_status', e.target.value as any)}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="dicari">Dicari</option>
                                    <option value="ditemukan">Ditemukan</option>
                                    <option value="ditutup">Ditutup</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </button>
                    </form>

                    {/* Verify Handover Button – only for items waiting for handover */}
                    {item.handling_status === 'menunggu_penyerahan' && (
                        <div className="mt-6 border-t pt-6">
                            <button
                                onClick={handleVerifyHandover}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-bold"
                            >
                                ✓ Verify Handover
                            </button>
                            <p className="text-sm text-slate-500 mt-2">
                                Click after receiving the item from the student.
                            </p>
                        </div>
                    )}

                    {/* History */}
                    <div className="mt-8 border-t pt-6">
                        <h2 className="font-bold text-lg mb-4">History</h2>
                        <div className="space-y-3">
                            {item.histories?.length ? (
                                item.histories.map(h => (
                                    <div key={h.id} className="flex items-start gap-3 text-sm">
                                        <span className="text-slate-400">{h.created_at}</span>
                                        <span className="font-medium">{h.user?.name ?? 'System'}</span>
                                        <span>{h.action}</span>
                                        {h.description && <span className="text-slate-500">— {h.description}</span>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No history available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}