import React, { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    Clock,
    CheckCircle2,
    Send,
    AlertCircle,
    Search,
    Bell,
    Menu,
    X,
    Settings,
    LogOut,
    ChevronDown,
    Home,
} from 'lucide-react';
import { router, Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Helper to check active route
    const isActive = (routeName: string) => {
        return window.location.pathname === routeName;
    };

    return (
        <div className="flex min-h-screen bg-slate-50/50 text-slate-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Shared Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-2 text-xl font-bold text-teal-600">
                        <Link href="/home" className="flex items-center">
                            <img src="/logo.png" alt="Kembaliin Logo" className="h-5 w-auto transition-all duration-300 hover:opacity-80 md:h-6" />
                        </Link>
                    </div>
                    <button className="p-1 text-slate-400 md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-4">
                    <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Menu Utama</p>
                    <SidebarLink
                        href="/Siswa/dashboard"
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={isActive('/Siswa/dashboard')}
                    />
                    <SidebarLink href="/items/create" icon={<AlertCircle size={20} />} label="Laporkan Barang" active={isActive('/items/create')} />
                    <SidebarLink
                        href="/siswa/pengajuan" // ← lowercase dan sesuai route
                        icon={<Send size={20} />}
                        label="Pengajuan Klaim"
                        active={window.location.pathname === '/siswa/pengajuan'}
                    />
                    <SidebarLink href="/Siswa/laporan" icon={<Package size={20} />} label="Semua Laporan" active={isActive('/Siswa/laporan')} />
                    {/* <SidebarLink href="#" icon={<Clock size={20} />} label="Riwayat" /> */}
                </nav>

                <div className="space-y-1 border-t border-slate-100 p-4">
                    <SidebarLink href="/" icon={<Home size={20} />} label="Beranda" />
                    <SidebarLink href="/Siswa/pengaturan" icon={<Settings size={20} />} label="Pengaturan" />
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
                {/* Shared Header */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
                    <div className="flex flex-1 items-center gap-4">
                        <button className="p-2 text-slate-600 md:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="relative hidden w-full max-w-md sm:block">
                            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari barang..."
                                className="w-full rounded-xl border-transparent bg-slate-100 py-2 pr-4 pl-10 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="group flex cursor-pointer items-center gap-3">
                        <div className="hidden text-right md:block">
                            <p className="text-sm leading-none font-bold text-slate-900">{auth.user.name}</p>
                            <p className="mt-1 text-[10px] font-bold text-teal-500 uppercase">{auth.user.role}</p>
                        </div>
                        {auth.user.foto ? (
                            <img
                                src={`/storage/${auth.user.foto}`}
                                alt="Profile"
                                className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-teal-50"
                            />
                        ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-[10px] font-bold text-white shadow-sm md:h-9 md:w-9 md:text-sm">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
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
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                active ? 'bg-teal-600 text-white shadow-lg shadow-teal-50' : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
            }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
