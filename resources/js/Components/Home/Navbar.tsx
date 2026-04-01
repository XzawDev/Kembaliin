import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown, LogOut, User, PlusCircle } from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage().props as any;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <nav className="fixed z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between md:h-20">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center gap-2 text-xl font-bold text-indigo-600 md:text-2xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg md:h-9 md:w-9">K</div>
                        <span className="tracking-tight text-slate-800">Kembaliin</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
                        <Link href="/home" className="transition-colors hover:text-indigo-600">
                            Beranda
                        </Link>
                        <Link href="/search" className="transition-colors hover:text-indigo-600">
                            Cari Barang
                        </Link>
                        <Link href="#" className="transition-colors hover:text-indigo-600">
                            Tentang
                        </Link>
                    </div>

                    {/* Right side buttons – conditional based on auth */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {auth.user ? (
                            // Logged in: show profile dropdown
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-slate-100"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span className="hidden text-sm font-semibold text-slate-700 md:block">{auth.user.name}</span>
                                    <ChevronDown size={16} className="text-slate-500" />
                                </button>

                                {/* Dropdown menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-lg">
                                        <Link
                                            href="/Siswa/dashboard"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <User size={16} />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={16} />
                                            Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Not logged in: show login and register buttons
                            <>
                                <Link href="/login" className="hidden px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 sm:block">
                                    Masuk
                                </Link>
                                <Link
                                    href="/Siswa/dashboard"
                                    className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 md:px-6 md:py-3 md:text-sm"
                                >
                                    <PlusCircle size={18} className="xs:block hidden" />
                                    Laporkan
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button className="p-2 text-slate-600 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="space-y-4 border-b border-slate-100 bg-white p-4 shadow-xl md:hidden">
                    <Link href="/home" className="block py-2 font-bold text-slate-700" onClick={() => setIsMenuOpen(false)}>
                        Beranda
                    </Link>
                    <Link href="/search" className="block py-2 font-bold text-slate-700" onClick={() => setIsMenuOpen(false)}>
                        Cari Barang
                    </Link>
                    <Link href="#" className="block py-2 font-bold text-slate-700" onClick={() => setIsMenuOpen(false)}>
                        Tentang
                    </Link>
                    {!auth.user && (
                        <Link
                            href="/login"
                            className="w-full rounded-xl border border-indigo-100 py-3 text-center font-bold text-indigo-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Masuk
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
