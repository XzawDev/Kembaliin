import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown, LogOut, User, PlusCircle, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { url } = usePage();
    const { auth } = usePage().props as any;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    const getDashboardLink = () => {
        if (!auth?.user) return '/login';
        if (auth.user.role === 'petugas') return '/officer/dashboard';
        if (auth.user.role === 'siswa') return '/Siswa/dashboard';
        return '/home';
    };

    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between md:h-20">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                        <img src="/logo.png" alt="Kembaliin Logo" className="h-5 w-auto sm:h-6 md:h-7" />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden items-center gap-8 md:flex">
                        <NavLink href="/home" active={url === '/home'}>
                            Beranda
                        </NavLink>
                        <NavLink href="/search" active={url?.startsWith('/search')}>
                            Cari Barang
                        </NavLink>
                        <NavLink href="/development" active={false}>
                            Tentang
                        </NavLink>
                    </div>

                    {/* Right side Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {auth?.user ? (
                            <div className="relative flex items-center" ref={profileRef}>
                                {/* Tombol Profil */}
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2.5 rounded-full p-1 pl-3 transition-colors hover:bg-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                >
                                    <span className="hidden text-sm font-bold text-slate-700 md:block">{auth.user.name}</span>
                                    {auth.user.foto ? (
                                        <img
                                            src={`/storage/${auth.user.foto}`}
                                            alt={auth.user.name}
                                            className="h-10 w-10 rounded-full object-cover shadow-lg shadow-teal-50"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 font-black text-white shadow-lg shadow-teal-50">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                    )}
                                    <ChevronDown
                                        size={14}
                                        className={`hidden text-slate-400 transition-transform duration-300 md:block ${isProfileOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Profil */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: 'easeOut' }}
                                            className="absolute top-full right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50"
                                        >
                                            <div className="p-2">
                                                {/* PINDAH KE SINI: Tombol Buat Laporan */}
                                                <div className="hidden md:block">
                                                    <Link
                                                        href="/items/create"
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <PlusCircle size={16} />
                                                        Buat Laporan
                                                    </Link>
                                                </div>

                                                <Link
                                                    href={getDashboardLink()}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <LayoutDashboard size={16} />
                                                    Dashboard Saya
                                                </Link>

                                                <div className="my-1 border-t border-slate-50"></div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                                >
                                                    <LogOut size={16} />
                                                    Keluar
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:text-teal-600 md:block"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/login"
                                    className="group flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-200 sm:px-4 sm:py-2 sm:text-xs md:px-6 md:py-2.5 md:text-sm"
                                >
                                    <PlusCircle size={14} className="transition-transform group-hover:rotate-90 sm:h-4 sm:w-4" />
                                    Laporkan
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="ml-0.5 rounded-xl p-1.5 text-slate-600 transition-colors hover:bg-slate-100 sm:p-2 md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-b border-slate-100 bg-white shadow-xl md:hidden"
                    >
                        <div className="flex flex-col space-y-1 p-3 sm:p-4">
                            <MobileNavLink href="/home" active={url === '/home'} onClick={() => setIsMenuOpen(false)}>
                                Beranda
                            </MobileNavLink>
                            <MobileNavLink href="/search" active={url?.startsWith('/search')} onClick={() => setIsMenuOpen(false)}>
                                Cari Barang
                            </MobileNavLink>

                            <div className="my-2 border-t border-slate-100"></div>

                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/items/create"
                                        className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white shadow-md sm:py-3 sm:text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <PlusCircle size={16} />
                                        Buat Laporan
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition-colors hover:bg-teal-600 sm:py-3 sm:text-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={16} />
                                    Masuk Akun
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

// --- Komponen Navigasi ---

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`relative text-sm font-bold transition-all duration-200 ${active ? 'text-teal-600' : 'text-slate-500 hover:text-teal-600'}`}
        >
            {children}
            {active && <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-teal-600" />}
        </Link>
    );
}

function MobileNavLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block rounded-xl px-4 py-2.5 text-xs font-bold transition-colors sm:py-3 sm:text-sm ${
                active ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
            }`}
        >
            {children}
        </Link>
    );
}
