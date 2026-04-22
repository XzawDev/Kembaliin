import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    Layers,
    History,
    QrCode,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Clock,
    Home,
    ShieldCheck,
    CheckCircle2,
    Users,
    PlusCircle,
} from 'lucide-react';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Helper to check active route
    const isActive = (routeName: string) => {
        return window.location.pathname === routeName;
    };

    return (
        <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Shared Sidebar Style */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Branding Section */}
                <div className="flex items-center justify-between p-6">
                    <Link href="/home" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Kembaliin Logo" className="h-5 w-auto transition-all duration-300 hover:opacity-80 md:h-6" />
                        <span className="hidden">Officer Panel</span>
                    </Link>
                    <button className="p-1 text-slate-400 md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 space-y-1 px-4">
                    <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Panel Petugas</p>

                    <SidebarLink
                        href="/officer/dashboard"
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={isActive('/officer/dashboard')}
                    />
                    <SidebarLink href="/items/create" icon={<PlusCircle size={20} />} label="Buat Laporan" active={isActive('/items/create')} />
                    <SidebarLink href="/officer/verify" icon={<QrCode size={20} />} label="Scan QR Barang" active={isActive('/officer/verify')} />
                    <SidebarLink
                        href="/officer/claims"
                        icon={<CheckCircle2 size={20} />}
                        label="Verifikasi Klaim"
                        active={isActive('/officer/claims')}
                    />
                    <SidebarLink href="/officer/items" icon={<Package size={20} />} label="Semua Barang" active={isActive('/officer/items')} />
                    <SidebarLink href="/officer/categories" icon={<Layers size={20} />} label="Kategori" active={isActive('/officer/categories')} />
                    <SidebarLink href="/officer/history" icon={<History size={20} />} label="Riwayat" active={isActive('/officer/history')} />
                    <SidebarLink href="/officer/users" icon={<Users size={20} />} label="Manajemen User" active={isActive('/officer/users')} />
                </nav>

                {/* Bottom Section */}
                <div className="space-y-1 border-t border-slate-100 p-4">
                    <SidebarLink href="/" icon={<Home size={20} />} label="Beranda Publik" />
                    <button
                        onClick={() => router.post('/logout')}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
                    >
                        <LogOut size={20} className="transition-transform group-hover:translate-x-0.5" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Header (Matching AuthenticatedLayout) */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
                    <div className="flex flex-1 items-center gap-4">
                        <button className="p-2 text-slate-600 md:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>

                        {/* Search Bar */}
                        <div className="relative hidden w-full max-w-md sm:block">
                            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari laporan atau klaim..."
                                className="w-full rounded-xl border-transparent bg-slate-100 py-2 pr-4 pl-10 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* User Profile Info */}
                    <div className="flex items-center gap-4">
                        <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-teal-600">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        <div className="flex cursor-pointer items-center gap-3">
                            <div className="hidden text-right md:block">
                                <p className="text-sm leading-none font-bold text-slate-900">{auth.user.name}</p>
                                <p className="mt-1 text-[10px] font-bold tracking-wider text-teal-600 uppercase">{auth.user.role}</p>
                            </div>

                            {/* Profile Image Logic */}
                            {auth.user.foto ? (
                                <img
                                    src={`/storage/${auth.user.foto}`}
                                    alt="Profile"
                                    className="h-9 w-9 rounded-xl object-cover shadow-lg ring-2 shadow-teal-600/10 ring-white"
                                />
                            ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-sm font-bold text-white shadow-lg shadow-teal-600/20">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                active ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
            }`}
        >
            <span className={active ? 'text-white' : 'text-slate-400 transition-colors group-hover:text-teal-600'}>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
