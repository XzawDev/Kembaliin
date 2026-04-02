import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import {
    Search,
    MapPin,
    Calendar,
    ArrowRight,
    PlusCircle,
    Package,
    ShieldCheck,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Menu,
    X,
    ChevronRight,
    ChevronDown,
    LogOut,
    User,
} from 'lucide-react';

// Types
type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type Stats = {
    total: number;
    hilang: number;
    dititipkan: number;
    dikembalikan: number;
};

type Item = {
    id: number;
    name: string;
    category: { name: string };
    location: string;
    date: string;
    display_status: string; // computed in backend
    image_url: string | null; // first image or placeholder
    user?: { name: string };
};

interface Props {
    auth: {
        user: User | null;
    };
    stats: Stats;
    items: Item[];
}

export default function Home({ auth, items }: Props) {
    const [activeFilter, setActiveFilter] = useState('semua');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    // Filter items based on activeFilter
    const filteredItems = items.filter((item) => {
        if (activeFilter === 'semua') return true;
        if (activeFilter === 'hilang') return item.display_status === 'hilang';
        if (activeFilter === 'ditemukan') return item.display_status !== 'hilang'; // all found items
        return true;
    });

    return (
        <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <header className="relative px-4 pt-32 pb-16 md:pt-48 md:pb-32">
                <div className="relative z-10 mx-auto max-w-7xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-[10px] font-bold tracking-widest text-teal-600 uppercase md:text-xs">
                        <span className="relative flex h-4 w-4 items-center justify-center">
                            {/* Efek gelombang (ping) di belakang */}
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-40"></span>
                            {/* Ikon Perisai */}
                            <ShieldCheck size={16} className="relative text-teal-600" />
                        </span>
                        Platform Sekolah
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-7xl">
                        Menemukan Barang <br className="hidden md:block" />
                        <span className="text-teal-600">Jadi Lebih Mudah.</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-slate-500 md:text-lg">
                        Website yang membantu siswa untuk menemukan barang yang hilang atau mengembalikan barang yang ditemukan.
                    </p>

                    {/* Search Bar - Responsive */}
                    <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl md:flex-row md:rounded-3xl md:p-3">
                        <div className="flex flex-1 items-center gap-3 border-b border-slate-100 px-4 py-3 md:border-r md:border-b-0 md:py-0">
                            <Search className="text-teal-600" size={20} />
                            <input type="text" placeholder="Nama barang..." className="w-full text-sm text-slate-700 outline-none md:text-base" />
                        </div>
                        <div className="flex flex-1 items-center gap-3 px-4 py-3 md:py-0">
                            <MapPin className="text-slate-400" size={20} />
                            <input type="text" placeholder="Lokasi..." className="w-full text-sm text-slate-700 outline-none md:text-base" />
                        </div>
                        <button className="w-full rounded-xl bg-teal-600 px-10 py-4 font-bold text-white transition-all hover:bg-teal-700 md:w-auto md:rounded-2xl">
                            Cari
                        </button>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="pointer-events-none absolute top-0 left-1/2 -z-0 h-full w-full -translate-x-1/2 opacity-20">
                    <div className="absolute top-20 left-10 h-48 w-48 rounded-full bg-teal-300 blur-[100px] md:h-96 md:w-96 md:blur-[150px]"></div>
                    <div className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-cyan-300 blur-[100px] md:h-96 md:w-96 md:blur-[150px]"></div>
                </div>
            </header>

            {/* Main Content Area */}
            <section className="bg-slate-50/50 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Laporan Terbaru</h2>
                            <p className="mt-2 text-sm text-slate-500 md:text-base">Mungkin salah satu barang ini milik Anda?</p>
                        </div>

                        {/* Scrollable Filters for Mobile */}
                        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['semua', 'hilang', 'ditemukan'].map(
                                (
                                    f, // changed from 'dititipkan' to 'ditemukan'
                                ) => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`rounded-full border px-6 py-2 text-xs font-bold whitespace-nowrap capitalize transition-all md:text-sm ${
                                            activeFilter === f
                                                ? 'border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-100'
                                                : 'border-slate-200 bg-white text-slate-500 hover:border-teal-600'
                                        }`}
                                    >
                                        {f === 'ditemukan' ? 'Ditemukan' : f} {/* display as 'Ditemukan' */}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden md:aspect-square">
                                        <img
                                            src={item.image_url || 'https://images.unsplash.com/placeholder.jpg'}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <StatusBadge status={item.display_status} />
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-2 flex items-start justify-between">
                                            <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                                                {item.category.name}
                                            </span>
                                        </div>
                                        <h3 className="mb-4 line-clamp-1 text-lg font-bold text-slate-900">{item.name}</h3>

                                        <div className="mb-6 space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <MapPin size={14} className="text-slate-400" /> {item.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>

                                        <button className="group-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 py-3 text-xs font-bold text-slate-800 transition-all hover:bg-teal-600 hover:text-white">
                                            Lihat Detail <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-slate-500">Tidak ada laporan saat ini.</p>
                        )}
                    </div>

                    <div className="mt-12 text-center md:mt-20">
                        <button className="rounded-full border border-slate-200 bg-white px-10 py-4 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-600 hover:text-indigo-600">
                            Muat Lebih Banyak
                        </button>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-20 md:py-32">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <h2 className="mb-16 text-3xl font-extrabold text-slate-900 md:text-5xl">Kenapa Pakai Kembaliin?</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
                        <FeatureCard
                            icon={<ShieldCheck size={32} />}
                            title="Aman & Terverifikasi"
                            desc="Laporan diperiksa oleh moderator untuk menghindari penipuan."
                        />
                        <FeatureCard
                            icon={<Globe size={32} />}
                            title="Cakupan Luas"
                            desc="Barangmu bisa ditemukan oleh siapa saja di seluruh penjuru daerah."
                        />
                        <FeatureCard
                            icon={<Package size={32} />}
                            title="100% Gratis"
                            desc="Misi kami adalah membantu sesama mengembalikan hak miliknya."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 pt-20 pb-10 text-white">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
                        <div className="sm:col-span-2 md:col-span-1">
                            <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                                <img
                                    src="/logo.png"
                                    alt="Kembaliin Logo"
                                    className="h-6 w-auto brightness-0 invert" // Class ini akan memutihkan logo secara otomatis!
                                />
                            </div>
                            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                                Platform komunitas sosial untuk membantu sesama menemukan barang yang hilang dengan aman dan mudah.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-widest text-slate-500 uppercase">Tautan</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Cari Barang
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Laporkan
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Bantuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-widest text-slate-500 uppercase">Hukum</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Privasi
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Ketentuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-widest text-slate-500 uppercase">Social</h4>
                            <div className="flex gap-4">
                                <a href="#" className="rounded-full bg-slate-800 p-3 transition-all hover:bg-indigo-600">
                                    <Facebook size={18} />
                                </a>
                                <a href="#" className="rounded-full bg-slate-800 p-3 transition-all hover:bg-indigo-600">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className="rounded-full bg-slate-800 p-3 transition-all hover:bg-indigo-600">
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-10 text-center text-[10px] text-slate-500 md:text-xs">
                        © 2024 Kembaliin Indonesia. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Sub-components
// Keep the helper components (StatusBadge, FeatureCard) as they are
function StatusBadge({ status }: { status: string }) {
    // For public homepage, we keep it simple: red for lost, green for found
    const isLost = status === 'hilang';
    return (
        <span
            className={`rounded-full border px-3 py-1 text-[9px] font-extrabold tracking-widest uppercase shadow-xl md:px-4 md:py-1.5 md:text-[10px] ${
                isLost ? 'border-red-400 bg-red-500 text-white' : 'border-emerald-400 bg-emerald-500 text-white'
            }`}
        >
            {isLost ? 'HILANG' : 'DITEMUKAN'}
        </span>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center transition-all hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50/50 md:p-12">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 transition-transform group-hover:scale-110 md:h-20 md:w-20">
                <div className="text-indigo-600">{icon}</div>
            </div>
            <h3 className="mb-4 text-lg font-bold md:text-xl">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
        </div>
    );
}
