import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { 
    LayoutDashboard, Package, Layers, History, 
    QrCode, LogOut, Menu, X, Bell, Search 
} from "lucide-react";

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 md:relative md:translate-x-0 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">O</div>
                        Officer Panel
                    </div>
                    <button className="md:hidden p-1 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <SidebarLink href="/officer/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <SidebarLink href="/officer/items" icon={<Package size={20} />} label="All Items" />
                    <SidebarLink href="/officer/categories" icon={<Layers size={20} />} label="Categories" />
                    <SidebarLink href="/officer/history" icon={<History size={20} />} label="History" />
                    <SidebarLink href="/officer/verify" icon={<QrCode size={20} />} label="Scan QR" />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
                    <button className="md:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <button className="p-2 text-slate-400 relative hover:bg-slate-50 rounded-full">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-700">{auth.user?.name}</span>
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                {auth.user?.name?.charAt(0)}
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
            active ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
        }`}>
            {icon}
            <span>{label}</span>
        </Link>
    );
}