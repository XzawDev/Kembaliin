import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import { ChevronLeft, Save } from 'lucide-react';

interface Props {
    category?: { id: number; name: string };
}

export default function CategoryForm({ category }: Props) {
    const isEditing = !!category;
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/officer/categories/${category.id}`);
        } else {
            post('/officer/categories');
        }
    };

    return (
        <OfficerLayout>
            <Head title={isEditing ? 'Edit Kategori' : 'Tambah Kategori'} />

            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/officer/categories"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                    >
                        <ChevronLeft size={18} />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h1>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nama Kategori</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Contoh: Elektronik, Pakaian, Dokumen"
                                autoFocus
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href="/officer/categories"
                                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Simpan Kategori'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </OfficerLayout>
    );
}
