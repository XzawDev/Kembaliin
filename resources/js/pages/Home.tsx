import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import {
    Search,
    MapPin,
    Calendar,
    ShieldCheck,
    Package,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    ChevronRight,
    CheckCircle,
    ShieldQuestion,
    QrCode,
    Tag,
    Users,
    Zap,
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
    slug: string;
    name: string;
    category: { name: string };
    location: string;
    date: string;
    display_status: string;
    image_url: string | null;
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

    // Filter items based on activeFilter
    const filteredItems = items.filter((item) => {
        if (activeFilter === 'semua') return true;
        if (activeFilter === 'hilang') return item.display_status === 'hilang';
        if (activeFilter === 'ditemukan') return item.display_status !== 'hilang';
        return true;
    });

    return (
        <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
            <Navbar />

            {/* Hero Section */}
            {/* Hero Section - Diperbesar untuk mobile */}
            <header className="relative px-4 pt-32 pb-20 md:pt-48 md:pb-32">
                <div className="relative z-10 mx-auto max-w-7xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold tracking-widest text-teal-600 uppercase md:px-4 md:py-2 md:text-xs">
                        <span className="relative flex h-3 w-3 items-center justify-center md:h-4 md:w-4">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-40"></span>
                            <ShieldCheck size={14} className="relative text-teal-600 md:size-[16px]" />
                        </span>
                        Platform Sekolah
                    </div>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:mb-6 md:text-7xl">
                        Menemukan Barang <br className="hidden md:block" />
                        <span className="text-teal-600">Jadi Lebih Mudah.</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-slate-500 md:mb-10 md:text-lg">
                        Website yang membantu siswa untuk menemukan barang yang hilang atau mengembalikan barang yang ditemukan.
                    </p>

                    {/* Search Bar - Responsive */}
                    <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl md:flex-row md:rounded-3xl md:p-3 md:shadow-2xl">
                        <div className="flex flex-1 items-center gap-2 border-b border-slate-100 px-3 py-2 md:gap-3 md:border-r md:border-b-0 md:px-4 md:py-0">
                            <Search className="text-teal-600" size={18} />
                            <input type="text" placeholder="Nama barang..." className="w-full text-sm text-slate-700 outline-none" />
                        </div>
                        <div className="flex flex-1 items-center gap-2 px-3 py-2 md:gap-3 md:px-4 md:py-0">
                            <MapPin className="text-slate-400" size={18} />
                            <input type="text" placeholder="Lokasi..." className="w-full text-sm text-slate-700 outline-none" />
                        </div>
                        <button className="w-full rounded-xl bg-teal-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 md:w-auto md:rounded-2xl md:px-10 md:py-4 md:text-base">
                            Cari
                        </button>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="pointer-events-none absolute top-0 left-1/2 -z-0 h-full w-full -translate-x-1/2 opacity-20">
                    <div className="absolute top-20 left-10 h-48 w-48 rounded-full bg-teal-300 blur-[80px] md:h-96 md:w-96 md:blur-[150px]"></div>
                    <div className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-cyan-300 blur-[80px] md:h-96 md:w-96 md:blur-[150px]"></div>
                </div>
            </header>

            {/* 🌟 SECTION CARA KERJA (STANDALONE - MUTLI-COLOR HOVER) 🌟 */}
            <section className="bg-white py-10 md:py-16">
                {/* ... (konten cara kerja tetap sama seperti kode asli) ... */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center md:mb-12">
                        <h2 className="text-xl font-extrabold text-slate-900 md:text-3xl">Cara Kerja Sistem</h2>
                        <p className="mt-2 text-xs text-slate-500 md:text-sm">
                            Proses pengelolaan barang hilang dan ditemukan di lingkungan sekolah.
                        </p>
                    </div>

                    <div className="relative mx-auto max-w-6xl">
                        <div className="absolute top-8 left-[12.5%] hidden w-[75%] border-t-2 border-dashed border-slate-200 lg:block"></div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                            {/* Langkah 1 */}
                            <div className="group relative z-10 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-sky-50 group-hover:text-sky-600 group-hover:shadow-lg group-hover:shadow-sky-100/50 md:h-16 md:w-16 md:rounded-[1.25rem]">
                                    <Search size={24} className="md:h-7 md:w-7" />
                                </div>
                                <h3 className="mb-2 text-base font-bold text-slate-800 md:text-lg">1. Pelaporan Barang</h3>
                                <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-slate-500 md:max-w-none md:px-2 md:text-sm">
                                    Pengguna dapat melaporkan barang yang hilang atau ditemukan melalui platform dengan menyertakan detail dan foto.
                                </p>
                            </div>
                            {/* Langkah 2 */}
                            <div className="group relative z-10 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:shadow-lg group-hover:shadow-amber-100/50 md:h-16 md:w-16 md:rounded-[1.25rem]">
                                    <QrCode size={24} className="md:h-7 md:w-7" />
                                </div>
                                <h3 className="mb-2 text-base font-bold text-slate-800 md:text-lg">2. Penitipan & Pendataan</h3>
                                <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-slate-500 md:max-w-none md:px-2 md:text-sm">
                                    Barang yang ditemukan diserahkan kepada petugas untuk diamankan dan dicatat ke dalam sistem menggunakan QR Code.
                                </p>
                            </div>
                            {/* Langkah 3 */}
                            <div className="group relative z-10 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:shadow-lg group-hover:shadow-teal-100/50 md:h-16 md:w-16 md:rounded-[1.25rem]">
                                    <ShieldQuestion size={24} className="md:h-7 md:w-7" />
                                </div>
                                <h3 className="mb-2 text-base font-bold text-slate-800 md:text-lg">3. Proses Verifikasi</h3>
                                <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-slate-500 md:max-w-none md:px-2 md:text-sm">
                                    Pemilik asli dapat mengajukan klaim kepemilikan dengan menjawab pertanyaan keamanan untuk tujuan verifikasi.
                                </p>
                            </div>
                            {/* Langkah 4 */}
                            <div className="group relative z-10 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-100/50 md:h-16 md:w-16 md:rounded-[1.25rem]">
                                    <CheckCircle size={24} className="md:h-7 md:w-7" />
                                </div>
                                <h3 className="mb-2 text-base font-bold text-slate-800 md:text-lg">4. Pengambilan Barang</h3>
                                <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-slate-500 md:max-w-none md:px-2 md:text-sm">
                                    Setelah proses klaim disetujui, barang dapat diambil di lokasi penitipan dengan menunjukkan bukti konfirmasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="bg-slate-50/50 py-12 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col justify-between gap-4 md:mb-16 md:flex-row md:items-end">
                        <div className="text-center md:text-left">
                            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Laporan Terbaru</h2>
                            <p className="mt-1 text-xs text-slate-500 md:mt-2 md:text-base">Mungkin salah satu barang ini milik Anda?</p>
                        </div>

                        {/* Scrollable Filters */}
                        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['semua', 'hilang', 'ditemukan'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`rounded-full border px-4 py-1.5 text-[10px] font-bold whitespace-nowrap capitalize transition-all md:px-6 md:py-2 md:text-sm ${
                                        activeFilter === f
                                            ? 'border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-100'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-teal-600'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Responsive Grid Layout: 2 columns on mobile, 4 on desktop */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div
                                    key={item.slug}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg md:rounded-3xl"
                                >
                                    {/* GAMBAR */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={
                                                item.image_url ||
                                                'https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9zdCUyMGZvdW5kfGVufDB8fDB8fHww'
                                            }
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* KONTEN (pt-2 / pt-3 mengurangi jarak kosong dari gambar ke teks) */}
                                    <div className="p-3 pt-2 md:p-5 md:pt-3">
                                        {/* 1. Status - Ukuran dinaikkan & jarak ke judul sangat dirapatkan (mb-0.5) */}
                                        <div className="mb-0.5 md:mb-1">
                                            <span
                                                className={`text-[10px] leading-none font-extrabold tracking-widest uppercase md:text-xs ${
                                                    item.display_status === 'hilang' ? 'text-red-500' : 'text-emerald-500'
                                                }`}
                                            >
                                                • {item.display_status === 'hilang' ? 'HILANG' : 'DITEMUKAN'}
                                            </span>
                                        </div>

                                        {/* 2. Judul Barang - Jarak sedang ke bagian detail meta (mb-2) */}
                                        <h3 className="mb-2 line-clamp-1 text-sm font-bold text-slate-900 md:mb-3 md:text-lg">{item.name}</h3>

                                        {/* 3. Meta Detail - Jarak antar barisnya dirapatkan (space-y-1) */}
                                        <div className="mb-3 space-y-1 md:mb-4 md:space-y-1.5">
                                            {/* Kategori */}
                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:text-xs">
                                                <Tag size={12} className="shrink-0 text-slate-400 md:h-3.5 md:w-3.5" />
                                                <span className="truncate">{item.category.name}</span>
                                            </div>

                                            {/* Lokasi */}
                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:text-xs">
                                                <MapPin size={12} className="shrink-0 text-slate-400 md:h-3.5 md:w-3.5" />
                                                <span className="truncate">{item.location}</span>
                                            </div>

                                            {/* Tanggal */}
                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 md:text-xs">
                                                <Calendar size={12} className="shrink-0 text-slate-400 md:h-3.5 md:w-3.5" />
                                                <span className="truncate">
                                                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tombol Detail - Punya jarak paling besar dari atasnya agar tidak sesak */}
                                        <Link
                                            href={`/items/${item.slug}`}
                                            className="flex w-full items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-[10px] font-bold text-slate-800 transition-all hover:bg-teal-600 hover:text-white md:rounded-xl md:py-3 md:text-xs"
                                        >
                                            Detail <ChevronRight size={12} className="md:h-4 md:w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full py-10 text-center text-sm text-slate-500">Tidak ada laporan saat ini.</p>
                        )}
                    </div>

                    <div className="mt-10 text-center md:mt-20">
                        <Link
                            href="/search"
                            className="rounded-full border border-slate-200 bg-white px-8 py-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-teal-600 hover:text-teal-600 md:px-10 md:py-4 md:text-sm"
                        >
                            Cari Laporan Lainnya
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    {/* Header Section (Dibuat rata tengah tapi lebih rapi) */}
                    <div className="mb-12 text-center md:mb-16">
                        <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">Kenapa Pakai Kembaliin?</h2>
                        <p className="mt-3 text-sm text-slate-500 md:text-base">Lebih dari sekadar papan pengumuman biasa.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                        <FeatureCard
                            icon={<ShieldCheck size={28} className="md:h-8 md:w-8" />}
                            title="Keamanan Berlapis"
                            desc="Dilengkapi sistem QR Code dan pertanyaan verifikasi agar barang kembali ke pemilik aslinya, bukan orang lain."
                        />
                        <FeatureCard
                            icon={<Users size={28} className="md:h-8 md:w-8" />}
                            title="Jaringan Satu Sekolah"
                            desc="Terhubung langsung dengan pos satpam dan ruang guru. Informasi kehilangan menyebar lebih cepat ke seluruh siswa."
                        />
                        <FeatureCard
                            icon={<Zap size={28} className="md:h-8 md:w-8" />}
                            title="Pantau Real-Time"
                            desc="Tidak perlu bingung mencari. Pantau terus status barangmu dari dilaporkan, dititipkan, hingga siap diambil."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 pt-16 pb-8 text-white md:pt-20 md:pb-10">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mb-12 grid grid-cols-2 gap-8 md:mb-16 md:grid-cols-4 md:gap-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="mb-4 flex items-center gap-2 text-xl font-bold text-white md:mb-6 md:text-2xl">
                                <img src="/logo.png" alt="Kembaliin Logo" className="h-5 w-auto brightness-0 invert md:h-6" />
                            </div>
                            <p className="max-w-xs text-xs leading-relaxed text-slate-400 md:text-sm">
                                Platform komunitas sekolah untuk membantu sesama menemukan barang yang hilang dengan aman.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase md:mb-6 md:text-sm">Tautan</h4>
                            <ul className="space-y-2 text-xs font-medium text-slate-400 md:space-y-4 md:text-sm">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Cari Barang
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Laporkan
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Bantuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase md:mb-6 md:text-sm">Hukum</h4>
                            <ul className="space-y-2 text-xs font-medium text-slate-400 md:space-y-4 md:text-sm">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Privasi
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Ketentuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase md:mb-6 md:text-sm">Social</h4>
                            <div className="flex gap-3 md:gap-4">
                                <SocialLink icon={<Facebook size={18} />} />
                                <SocialLink icon={<Twitter size={18} />} />
                                <SocialLink icon={<Instagram size={18} />} />
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-[10px] text-slate-500 md:pt-10 md:text-xs">
                        © 2024 Kembaliin Indonesia. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Sub-components
function StatusBadge({ status }: { status: string }) {
    const isLost = status === 'hilang';
    return (
        <span
            className={`inline-block rounded-full border px-3 py-1 text-[8px] font-extrabold tracking-widest uppercase shadow-lg md:px-4 md:py-1.5 md:text-[10px] ${
                isLost ? 'border-red-400 bg-red-500 text-white' : 'border-emerald-400 bg-emerald-500 text-white'
            }`}
        >
            {isLost ? 'HILANG' : 'DITEMUKAN'}
        </span>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-100/50 md:p-8">
            {/* Ikon di kiri atas */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-teal-600 group-hover:text-white md:h-16 md:w-16 md:rounded-[1.25rem]">
                {icon}
            </div>

            {/* Teks Rata Kiri */}
            <h3 className="mb-2 text-lg font-bold text-slate-800 md:mb-3 md:text-xl">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-500 md:text-base">{desc}</p>
        </div>
    );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" className="rounded-full bg-slate-800 p-2.5 transition-all hover:bg-teal-600 md:p-3">
            {icon}
        </a>
    );
}
