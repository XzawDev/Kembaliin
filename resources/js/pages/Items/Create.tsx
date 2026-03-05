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
        report_type: 'lost' as 'lost' | 'found',   // changed from 'type' to match backend
        location: '',
        date: '',
        images: [] as File[],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.slice(0, 5 - data.images.length); // Limit to 5

        setData('images', [...data.images, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
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
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporkan Barang" />

            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laporkan Barang</h1>
                    <p className="mt-2 text-slate-600">
                        Bantu komunitas menemukan barang yang hilang atau kembali ke pemiliknya.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Report Type Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setData('report_type', 'lost')}
                            className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left flex items-start gap-4 ${
                                data.report_type === 'lost' 
                                ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className={`p-3 rounded-xl ${data.report_type === 'lost' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${data.report_type === 'lost' ? 'text-indigo-900' : 'text-slate-700'}`}>Saya Kehilangan Barang</h3>
                                <p className="text-sm text-slate-500 mt-1">Buat laporan untuk barang Anda yang hilang.</p>
                            </div>
                            {data.report_type === 'lost' && <CheckCircle2 className="absolute top-4 right-4 text-indigo-600" size={20} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => setData('report_type', 'found')}
                            className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left flex items-start gap-4 ${
                                data.report_type === 'found' 
                                ? 'border-emerald-600 bg-emerald-50/50 ring-4 ring-emerald-50' 
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className={`p-3 rounded-xl ${data.report_type === 'found' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <Package size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${data.report_type === 'found' ? 'text-emerald-900' : 'text-slate-700'}`}>Saya Menemukan Barang</h3>
                                <p className="text-sm text-slate-500 mt-1">Laporkan barang yang Anda temukan di sekitar.</p>
                            </div>
                            {data.report_type === 'found' && <CheckCircle2 className="absolute top-4 right-4 text-emerald-600" size={20} />}
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 md:p-8 space-y-6">

                            {/* Grid Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Barang */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Package size={16} className="text-slate-400" /> Nama Barang
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Kunci Motor Honda"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>

                                {/* Kategori */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Tag size={16} className="text-slate-400" /> Kategori
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-xs text-red-500 font-medium">{errors.category_id}</p>}
                                </div>

                                {/* Lokasi */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-400" /> Lokasi Kejadian
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Kantin Sekolah"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                    {errors.location && <p className="text-xs text-red-500 font-medium">{errors.location}</p>}
                                </div>

                                {/* Tanggal */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" /> Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                    {errors.date && <p className="text-xs text-red-500 font-medium">{errors.date}</p>}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" /> Deskripsi Tambahan
                                </label>
                                <textarea
                                    placeholder="Ceritakan detail barang atau kronologi singkat..."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                                {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
                            </div>

                            {/* Upload Gambar */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700">Foto Barang (Maks. 5)</label>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {/* Previews */}
                                    {previews.map((src, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover rounded-2xl border border-slate-200 shadow-sm" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {previews.length < 5 && (
                                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group">
                                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
                                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider group-hover:text-indigo-600">Tambah</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                {errors.images && <p className="text-xs text-red-500 font-medium">{errors.images}</p>}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-slate-50 px-6 py-5 md:px-8 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
                            <Link
                                href="/Siswa/dashboard"
                                className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors text-center"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 ${
                                    processing 
                                    ? 'bg-slate-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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