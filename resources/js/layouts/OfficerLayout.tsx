import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, Layers, History, QrCode, LogOut, Menu, X, Bell, Search, Clock } from 'lucide-react';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 md:relative md:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">O</div>
                        Officer Panel
                    </div>
                    <button className="p-1 text-slate-400 md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-4">
                    <SidebarLink href="/officer/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <SidebarLink href="/officer/items" icon={<Package size={20} />} label="All Items" />
                    <SidebarLink href="/officer/claims" icon={<Search size={20} />} label="Verifikasi Claim" />
                    <SidebarLink href="/officer/categories" icon={<Layers size={20} />} label="Categories" />
                    <SidebarLink href="/officer/history" icon={<History size={20} />} label="History" />
                    <SidebarLink href="/officer/verify" icon={<QrCode size={20} />} label="Scan QR" />
                </nav>

                <div className="border-t border-slate-100 p-4">
                    <button
                        onClick={() => router.post('/logout')}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
                    <button className="p-2 text-slate-600 md:hidden" onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-50">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-700">{auth.user?.name}</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                                {auth.user?.name?.charAt(0)}
                            </div>
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
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                active ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
