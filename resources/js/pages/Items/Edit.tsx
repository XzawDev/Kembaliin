import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { X, Upload } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Image {
    id: number;
    url: string;
}

interface Item {
    id: number;
    name: string;
    description: string | null;
    category_id: number;
    location: string;
    date: string;
    images?: Image[]; // opsional, bisa undefined
}

interface EditProps {
    item: Item;
    categories: Category[];
}

export default function Edit({ item, categories }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: item.name,
        description: item.description || '',
        category_id: item.category_id,
        location: item.location,
        date: item.date,
        images: [] as File[],
        deleted_images: [] as number[],
    });

    // Pastikan item.images adalah array (default [])
    const existingImages = item.images ?? [];
    const [previewImages, setPreviewImages] = useState<{ id?: number; url: string; isNew?: boolean }[]>(
        existingImages.map((img: Image) => ({ id: img.id, url: img.url, isNew: false })),
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('images', [...data.images, ...files]);
        const newPreviews = files.map((file: File) => ({ url: URL.createObjectURL(file), isNew: true }));
        setPreviewImages([...previewImages, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const image = previewImages[index];
        if (image.id && !image.isNew) {
            setData('deleted_images', [...data.deleted_images, image.id]);
        }
        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
        if (image.isNew) {
            // Hitung berapa gambar lama (bukan baru) untuk menentukan offset file baru
            const oldCount = previewImages.filter((img) => !img.isNew).length;
            const newFiles = [...data.images];
            newFiles.splice(index - oldCount, 1);
            setData('images', newFiles);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/items/${item.id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Laporan" />
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-2xl font-bold">Edit Laporan Barang</h1>
                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
                    {/* Nama Barang */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Nama Barang *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Kategori *</label>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', Number(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 p-2.5"
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((cat: Category) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Lokasi *</label>
                        <input
                            type="text"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-2.5"
                        />
                        {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                    </div>

                    {/* Tanggal */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Tanggal Kejadian *</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-2.5"
                        />
                        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-slate-200 p-2.5"
                        />
                    </div>

                    {/* Gambar */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Foto Barang</label>
                        <div className="mb-3 grid grid-cols-3 gap-4">
                            {previewImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                                    <img src={img.url} alt="Preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-300">
                                <Upload size={24} className="text-slate-400" />
                                <span className="mt-1 text-xs text-slate-500">Tambah</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit(`/items/${item.id}`)}
                            className="rounded-xl border border-slate-200 px-6 py-2 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
