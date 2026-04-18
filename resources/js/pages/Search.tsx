import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import SearchFilters from '@/Components/Home/SearchFilter';
import {
    Search as SearchIcon,
    X,
    MapPin,
    PackageSearch,
    ArrowRight,
    SlidersHorizontal,
    Calendar,
    Tag,
    ChevronRight,
    Instagram,
    Twitter,
    Facebook,
    AlertCircle,
    Package,
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Item {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    location: string;
    date: string;
    display_status: string;
    image_url: string | null;
    category: Category;
}

interface Props {
    items: {
        data: Item[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        keyword?: string;
        category_id?: string;
        report_type?: string;
        location?: string;
        date_from?: string;
        date_to?: string;
    };
    categories: Category[];
}

export default function Search({ items, filters, categories }: Props) {
    const [keyword, setKeyword] = useState(filters.keyword || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [reportType, setReportType] = useState(filters.report_type || '');
    const [location, setLocation] = useState(filters.location || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        const params: any = {};
        if (keyword) params.keyword = keyword;
        if (categoryId) params.category_id = categoryId;
        if (reportType) params.report_type = reportType;
        if (location) params.location = location;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        router.get('/search', params, {
            preserveState: true,
            preserveScroll: true,
        });
        setIsMobileFilterOpen(false);
    };

    const clearFilters = () => {
        setKeyword('');
        setCategoryId('');
        setReportType('');
        setLocation('');
        setDateFrom('');
        setDateTo('');
        router.get('/search', {});
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Head title="Cari Barang" />
            <Navbar />

            <main className="pt-16 md:pt-20">
                {/* Mobile Hero Section (search bar and filter button) */}
                <div className="border-b border-slate-100 bg-slate-50 lg:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-6">
                        <form onSubmit={handleSearch} className="relative flex items-center gap-2">
                            <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-indigo-200">
                                <SearchIcon className="text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari kunci, tas..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <SlidersHorizontal size={16} />
                                <span className="xs:inline hidden">Filter</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Desktop/Tablet Layout */}
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-0">
                    <div className="flex flex-col gap-0 lg:flex-row">
                        {/* Desktop Sidebar - flush left */}
                        <aside className="hidden w-80 flex-shrink-0 lg:block">
                            <div className="sticky top-28 min-h-[calc(100vh-8rem)] rounded-2xl border border-l-0 border-slate-100 bg-white p-6 shadow-sm">
                                <SearchFilters
                                    keyword={keyword}
                                    setKeyword={setKeyword}
                                    categoryId={categoryId}
                                    setCategoryId={setCategoryId}
                                    reportType={reportType}
                                    setReportType={setReportType}
                                    location={location}
                                    setLocation={setLocation}
                                    dateFrom={dateFrom}
                                    setDateFrom={setDateFrom}
                                    dateTo={dateTo}
                                    setDateTo={setDateTo}
                                    categories={categories}
                                    onApply={() => handleSearch()}
                                    onClear={clearFilters}
                                    showSearch={true} // show search input in sidebar
                                />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 lg:pl-8 xl:pl-12">
                            {/* Desktop heading (optional) */}
                            <div className="mb-6 hidden lg:block">
                                <h2 className="text-2xl font-black tracking-tight text-slate-900">Hasil Pencarian</h2>
                                <p className="mt-1 text-sm text-slate-500">{items.total} laporan ditemukan</p>
                            </div>

                            {/* Mobile result count */}
                            <div className="mb-4 flex items-center justify-between px-1 lg:hidden">
                                <h3 className="text-sm font-bold text-slate-800">{items.total} Laporan Ditemukan</h3>
                            </div>

                            {items.data.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                                    {items.data.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/items/${item.slug}`}
                                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg md:rounded-3xl"
                                        >
                                            {/* GAMBAR */}
                                            <div className="relative aspect-square overflow-hidden bg-slate-100">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 transition-transform duration-500 group-hover:scale-110">
                                                        {item.display_status === 'hilang' ? (
                                                            <AlertCircle size={28} className="md:size-8" />
                                                        ) : (
                                                            <Package size={28} className="md:size-8" />
                                                        )}
                                                        <span className="mt-2 text-[10px] font-medium md:text-[11px]">Tidak ada foto</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* KONTEN (sama seperti sebelumnya) */}
                                            <div className="p-3 pt-2 md:p-5 md:pt-3">
                                                {/* status badge */}
                                                <div className="mb-0.5 md:mb-1">
                                                    <span
                                                        className={`text-[10px] leading-none font-extrabold tracking-widest uppercase ${
                                                            item.display_status === 'hilang' ? 'text-red-500' : 'text-emerald-500'
                                                        }`}
                                                    >
                                                        • {item.display_status === 'hilang' ? 'HILANG' : 'DITEMUKAN'}
                                                    </span>
                                                </div>
                                                {/* judul */}
                                                <h3 className="mb-2 line-clamp-1 text-sm font-bold text-slate-900 md:mb-3 md:text-lg">{item.name}</h3>
                                                {/* meta detail */}
                                                <div className="mb-3 space-y-1 md:mb-4 md:space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:text-xs">
                                                        <Tag size={12} className="shrink-0 text-slate-400 md:h-3.5 md:w-3.5" />
                                                        <span className="truncate">{item.category.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:text-xs">
                                                        <MapPin size={12} className="shrink-0 text-slate-400 md:h-3.5 md:w-3.5" />
                                                        <span className="truncate">{item.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:text-xs">
                                                        <Calendar size={12} className="shrink-0 text-slate-400 md:h-3.5 md:w-3.5" />
                                                        <span className="truncate">
                                                            {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* tombol detail */}
                                                <div className="flex w-full items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-[10px] font-bold text-slate-800 transition-all group-hover:bg-indigo-600 group-hover:text-white md:rounded-2xl md:py-3 md:text-xs">
                                                    Detail <ChevronRight size={12} className="md:h-4 md:w-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mx-2 rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center">
                                    <PackageSearch className="mx-auto mb-4 text-slate-300" size={48} />
                                    <h4 className="font-bold text-slate-900">Tidak ada hasil</h4>
                                    <button onClick={clearFilters} className="mt-4 text-sm font-bold text-indigo-600">
                                        Reset Filter
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {items.last_page > 1 && (
                                <div className="mt-12 flex flex-wrap justify-center gap-1.5">
                                    {items.links?.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`flex h-8 items-center justify-center rounded-xl px-3 text-[10px] font-bold transition-all md:h-10 md:px-4 md:text-xs ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'border border-slate-100 bg-white text-slate-600 hover:border-indigo-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Drawer */}
                {isMobileFilterOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                        <div className="absolute top-0 right-0 bottom-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b p-6">
                                <h2 className="text-lg font-black tracking-tight text-slate-900">Filter</h2>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <SearchFilters
                                    keyword={keyword}
                                    setKeyword={setKeyword}
                                    categoryId={categoryId}
                                    setCategoryId={setCategoryId}
                                    reportType={reportType}
                                    setReportType={setReportType}
                                    location={location}
                                    setLocation={setLocation}
                                    dateFrom={dateFrom}
                                    setDateFrom={setDateFrom}
                                    dateTo={dateTo}
                                    setDateTo={setDateTo}
                                    categories={categories}
                                    onApply={() => handleSearch()}
                                    onClear={clearFilters}
                                    showSearch={false} // no search input in mobile drawer (already at top)
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 pt-16 pb-8 text-white md:pt-20 md:pb-10">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    {/* Grid updated to 3 columns on desktop */}
                    <div className="mb-12 grid grid-cols-2 gap-8 md:mb-16 md:grid-cols-3 md:gap-12">
                        {/* 1. Branding Section */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="mb-4 flex items-center gap-2 text-xl font-bold text-white md:mb-6 md:text-2xl">
                                <img src="/logo.png" alt="Kembaliin Logo" className="h-5 w-auto brightness-0 invert md:h-6" />
                            </div>
                            <p className="max-w-xs text-xs leading-relaxed text-slate-400 md:text-sm">
                                Platform komunitas sekolah untuk membantu sesama menemukan barang yang hilang dengan aman dan terverifikasi.
                            </p>
                        </div>

                        {/* 2. Tautan Section */}
                        <div>
                            <h4 className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase md:mb-6 md:text-sm">Tautan Cepat</h4>
                            <ul className="space-y-2 text-xs font-medium text-slate-400 md:space-y-4 md:text-sm">
                                <li>
                                    <Link href="/search" className="transition-colors hover:text-white">
                                        Cari Barang
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="transition-colors hover:text-white">
                                        Laporkan Barang
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="transition-colors hover:text-white">
                                        Pusat Bantuan
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* 3. Social Section */}
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase md:mb-6 md:text-sm">Ikuti Kami</h4>
                            <div className="flex gap-3 md:gap-4">
                                <SocialLink icon={<Facebook size={18} />} />
                                <SocialLink icon={<Twitter size={18} />} />
                                <SocialLink icon={<Instagram size={18} />} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="border-t border-slate-800 pt-8 text-center text-[10px] text-slate-500 md:pt-10 md:text-xs">
                        &copy; {new Date().getFullYear()} Kembaliin Project. Kelompok 6 - Rekayasa Perangkat Lunak 2026.
                    </div>
                </div>
            </footer>
        </div>
    );
    function SocialLink({ icon }: { icon: React.ReactNode }) {
        return (
            <a href="#" className="rounded-full bg-slate-800 p-2.5 transition-all hover:bg-teal-600 md:p-3">
                {icon}
            </a>
        );
    }
}
