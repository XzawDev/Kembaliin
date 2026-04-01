import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Upload, X, MapPin, Calendar, Tag, FileText, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function CreateItem({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category_id: '',
        report_type: 'lost' as 'lost' | 'found',
        location: '',
        date: '',
        images: [] as File[],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.slice(0, 5 - data.images.length);
        setData('images', [...data.images, ...validFiles]);
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/items', {
            onSuccess: () => {
                setData('images', []);
                setPreviews([]);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporkan Barang" />

            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Laporkan Barang</h1>
                    <p className="mt-1 text-sm text-slate-600">Bantu komunitas menemukan barang yang hilang atau kembali ke pemiliknya.</p>
                </div>

                <form onSubmit={submit} className="space-y-6 sm:space-y-8">
                    {/* Report Type Selection Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setData('report_type', 'lost')}
                            className={`relative flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 sm:gap-4 sm:rounded-2xl sm:p-5 ${
                                data.report_type === 'lost'
                                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-50 sm:ring-4'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <div
                                className={`rounded-lg p-2 sm:rounded-xl sm:p-3 ${data.report_type === 'lost' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                            >
                                <AlertCircle size={20} className="sm:h-6 sm:w-6" />
                            </div>
                            <div className="flex-1">
                                <h3
                                    className={`text-sm font-bold sm:text-base ${data.report_type === 'lost' ? 'text-indigo-900' : 'text-slate-700'}`}
                                >
                                    Saya Kehilangan Barang
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">Buat laporan untuk barang Anda yang hilang.</p>
                            </div>
                            {data.report_type === 'lost' && (
                                <CheckCircle2 className="absolute top-2 right-2 h-[18px] w-[18px] text-indigo-600 sm:top-4 sm:right-4 sm:h-5 sm:w-5" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setData('report_type', 'found')}
                            className={`relative flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 sm:gap-4 sm:rounded-2xl sm:p-5 ${
                                data.report_type === 'found'
                                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-50 sm:ring-4'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <div
                                className={`rounded-lg p-2 sm:rounded-xl sm:p-3 ${data.report_type === 'found' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                            >
                                <Package size={20} className="sm:h-6 sm:w-6" />
                            </div>
                            <div className="flex-1">
                                <h3
                                    className={`text-sm font-bold sm:text-base ${data.report_type === 'found' ? 'text-emerald-900' : 'text-slate-700'}`}
                                >
                                    Saya Menemukan Barang
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">Laporkan barang yang Anda temukan di sekitar.</p>
                            </div>
                            {data.report_type === 'found' && (
                                <CheckCircle2 className="absolute top-2 right-2 h-[18px] w-[18px] text-emerald-600 sm:top-4 sm:right-4 sm:h-5 sm:w-5" />
                            )}
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
                        <div className="space-y-5 p-4 sm:p-6 md:p-8">
                            {/* Grid Fields */}
                            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                                        <Package size={14} className="text-slate-400 sm:h-4 sm:w-4" /> Nama Barang
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Kunci Motor Honda"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:rounded-xl sm:px-4 sm:py-3"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                                        <Tag size={14} className="text-slate-400 sm:h-4 sm:w-4" /> Kategori
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:rounded-xl sm:px-4 sm:py-3"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-xs text-red-500">{errors.category_id}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                                        <MapPin size={14} className="text-slate-400 sm:h-4 sm:w-4" /> Lokasi Kejadian
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Kantin Sekolah"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:rounded-xl sm:px-4 sm:py-3"
                                        required
                                    />
                                    {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                                        <Calendar size={14} className="text-slate-400 sm:h-4 sm:w-4" /> Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:rounded-xl sm:px-4 sm:py-3"
                                        required
                                    />
                                    {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                                    <FileText size={14} className="text-slate-400 sm:h-4 sm:w-4" /> Deskripsi Tambahan
                                </label>
                                <textarea
                                    placeholder="Ceritakan detail barang atau kronologi singkat..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:rounded-xl sm:px-4 sm:py-3"
                                />
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                            </div>

                            {/* Upload Gambar */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700 sm:text-sm">Foto Barang (Maks. 5)</label>

                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
                                    {previews.map((src, index) => (
                                        <div key={index} className="group relative aspect-square">
                                            <img
                                                src={src}
                                                alt="Preview"
                                                className="h-full w-full rounded-lg border border-slate-200 object-cover shadow-sm sm:rounded-xl"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-1 -right-1 rounded-full border border-slate-100 bg-white p-1 text-red-500 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-red-50 sm:-top-2 sm:-right-2 sm:p-1.5"
                                            >
                                                <X size={12} className="sm:h-3.5 sm:w-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                    {previews.length < 5 && (
                                        <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 transition-all hover:border-indigo-300 hover:bg-indigo-50 sm:rounded-xl">
                                            <Upload className="mb-1 h-5 w-5 text-slate-400 group-hover:text-indigo-500 sm:mb-2 sm:h-6 sm:w-6" />
                                            <span className="text-[9px] font-medium tracking-wider text-slate-500 uppercase group-hover:text-indigo-600 sm:text-[10px]">
                                                Tambah
                                            </span>
                                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-5 md:px-8">
                            <Link
                                href="/Siswa/dashboard"
                                className="rounded-lg px-4 py-2 text-center text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 sm:rounded-xl sm:px-6 sm:py-3"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold shadow-md transition-all sm:rounded-xl sm:px-10 sm:py-3 sm:shadow-lg ${
                                    processing
                                        ? 'cursor-not-allowed bg-slate-400'
                                        : 'bg-indigo-600 text-white hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white sm:h-4 sm:w-4" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Kirim Laporan'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
