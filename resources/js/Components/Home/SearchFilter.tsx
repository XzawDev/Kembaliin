import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    keyword: string;
    setKeyword: (val: string) => void;
    categoryId: string;
    setCategoryId: (val: string) => void;
    reportType: string;
    setReportType: (val: string) => void;
    location: string;
    setLocation: (val: string) => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;
    categories: Category[];
    onApply: () => void;
    onClear: () => void;
    showSearch?: boolean; // for desktop, show search input inside sidebar
}

export default function SearchFilters({
    keyword,
    setKeyword,
    categoryId,
    setCategoryId,
    reportType,
    setReportType,
    location,
    setLocation,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    categories,
    onApply,
    onClear,
    showSearch = false,
}: Props) {
    return (
        <div className="space-y-8">
            {showSearch && (
                <div>
                    <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Cari Barang</h3>
                    <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Kata kunci..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            )}

            <div>
                <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Pilih Kategori</h3>
                <div className="space-y-1">
                    <button
                        onClick={() => setCategoryId('')}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                            !categoryId ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategoryId(cat.id.toString())}
                            className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                                categoryId === cat.id.toString()
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Status Barang</h3>
                <div className="flex gap-2">
                    {['hilang', 'ditemukan'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setReportType(reportType === type ? '' : type)}
                            className={`flex-1 rounded-xl border py-2.5 text-xs font-bold uppercase transition-all ${
                                reportType === type
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Lokasi</h3>
                <input
                    type="text"
                    placeholder="Contoh: Kantin"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Rentang Tanggal</h3>
                <div className="space-y-3">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <button
                    onClick={onApply}
                    className="w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98]"
                >
                    Terapkan
                </button>
                <button
                    onClick={onClear}
                    className="w-full py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-red-500"
                >
                    Reset Filter
                </button>
            </div>
        </div>
    );
}
