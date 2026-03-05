import React, { useState } from "react";
import { 
    LayoutDashboard, Package, Clock, CheckCircle2, 
    AlertCircle, Search, Bell, Menu, X, Settings, 
    LogOut, ChevronDown 
} from "lucide-react";
import { router, Link, usePage } from "@inertiajs/react";

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
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Shared Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">K</div>
                        Kembaliin
                    </div>
                    <button className="md:hidden p-1 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu Utama</p>
                    <SidebarLink href="/Siswa/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/Siswa/dashboard')} />
                    <SidebarLink href="/items/create" icon={<AlertCircle size={20} />} label="Laporkan Barang" active={isActive('/items/create')} />
                    <SidebarLink href="#" icon={<Package size={20} />} label="Semua Barang" />
                    <SidebarLink href="#" icon={<Clock size={20} />} label="Riwayat" />
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <SidebarLink href="#" icon={<Settings size={20} />} label="Pengaturan" />
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group">
                        <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Shared Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="relative w-full max-w-md hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Cari barang..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 relative hover:bg-slate-50 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">{auth.user.name}</p>
                                <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1">{auth.user.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                                {auth.user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false }: any) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
            active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
        }`}>
            {icon}
            <span>{label}</span>
        </Link>
    );
}