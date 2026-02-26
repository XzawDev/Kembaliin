import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Login() {
    const [showInfo, setShowInfo] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post('/login');
    };

    const imageUrl = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1470&auto=format&fit=crop";

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            <Head title="Masuk - Kembaliin" />

            {/* Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt="Background Kelas" 
                    className="w-full h-full object-cover opacity-60 blur-sm scale-105" 
                />
            </div>

            {/* === CONTAINER UTAMA (CARD) === */}
            {/* PERUBAHAN 1: min-h dikurangi jadi 500px supaya muat di laptop kecil */}
            <div className="flex flex-col md:flex-row w-full max-w-[1000px] min-h-[500px] md:min-h-[600px] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-2 border-slate-300 overflow-hidden relative z-10 transition-all duration-300">
                
                {/* === KIRI: BAGIAN FORM === */}
                {/* PERUBAHAN 2: Padding dikurangi (p-8) biar gak terlalu lebar di laptop kecil */}
                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative z-10">
                    
                    {/* Logo Area - Margin bawah dikurangi dikit */}
                    <div className="flex items-center gap-3 mb-6 md:mb-10">
                        <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-teal-800 drop-shadow-sm">
                                <path d="M24 4C16.268 4 10 10.268 10 18C10 28.5 24 44 24 44C24 44 38 28.5 38 18C38 10.268 31.732 4 24 4Z" fill="currentColor"/>
                                <path d="M24 11C20.134 11 17 14.134 17 18C17 19.933 17.784 21.683 19.05 22.95L24 28L28.95 22.95C30.216 21.683 31 19.933 31 18C31 14.134 27.866 11 24 11ZM24 24C22.343 24 21 22.657 21 21H23V16L18 21L23 26V23C25.761 23 28 20.761 28 18H26C26 19.105 25.105 20 24 20V24Z" fill="white"/>
                            </svg>
                        </div>
                        {/* Font size responsif: text-2xl di laptop kecil, text-3xl di monitor besar */}
                        <span className="font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight">Kembaliin.</span>
                    </div>

                    {/* Judul Responsif */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 md:mb-3 tracking-tight">Selamat Datang!</h1>
                    <p className="text-slate-500 mb-6 md:mb-8 font-medium text-sm md:text-base">Silakan masuk untuk melapor atau mencari barangmu.</p>

                    <form onSubmit={submit} className="space-y-4 md:space-y-5">
                        {/* Input Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1" htmlFor="email">
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl bg-white border-2 border-slate-200 focus:bg-slate-50 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10 transition-all outline-none text-slate-800 placeholder-slate-400 font-medium text-sm md:text-base"
                                placeholder="nama@siswa.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-2 ml-1 font-medium">{errors.email}</p>}
                        </div>

                        {/* Input Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl bg-white border-2 border-slate-200 focus:bg-slate-50 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10 transition-all outline-none text-slate-800 placeholder-slate-400 font-medium text-sm md:text-base"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-2 ml-1 font-medium">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between mt-2 mb-4 md:mb-6 px-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700" />
                                <span className="text-sm font-medium text-slate-600">Ingat saya</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-teal-700 hover:text-teal-600 transition-colors">
                                Lupa password?
                            </a>
                        </div>

                        {/* Tombol Berdampingan */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 md:py-4 bg-teal-800 text-white text-base md:text-lg font-bold rounded-xl shadow-lg shadow-teal-900/20 hover:bg-teal-900 active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                            
                            <Link
                                href="/register"
                                className="flex-1 py-3 md:py-4 bg-white text-teal-800 border-2 border-teal-800 text-base md:text-lg font-bold rounded-xl hover:bg-teal-50 active:scale-[0.98] transition-all duration-200 text-center flex items-center justify-center"
                            >
                                Buat akun
                            </Link>
                        </div>
                    </form>
                </div>

                {/* === TOMBOL KUNING === */}
                <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-amber-400 rounded-full items-center justify-center shadow-xl z-20 border-4 border-white cursor-pointer hover:scale-110 transition-all duration-300 group ${showInfo ? 'rotate-180 bg-rose-500 text-white' : 'text-amber-900'}`}
                >
                    {showInfo ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 ml-0.5 group-hover:text-amber-950">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    )}
                </button>

                {/* === KANAN: GAMBAR === */}
                <div className="hidden md:block w-1/2 relative bg-slate-100 overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt="School Classroom" 
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${showInfo ? 'scale-125 blur-md brightness-50' : 'hover:scale-105 brightness-90'}`}
                    />
                    <div className="absolute inset-0 bg-teal-950/20 mix-blend-multiply"></div>

                    {/* PANEL INFO - Ukuran font responsif */}
                    <div className={`absolute inset-0 bg-teal-900/80 backdrop-blur-md flex flex-col items-center justify-center p-8 md:p-12 text-center transition-all duration-500 transform ${showInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-md">
                            <span className="text-2xl md:text-3xl">🔍</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 tracking-tight">Cara Kerja Kembaliin</h3>
                        <div className="text-teal-50 space-y-3 md:space-y-4 text-left bg-white/10 p-5 md:p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                            <p className="flex items-start gap-3">
                                <span className="bg-amber-400 text-teal-900 font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shrink-0 text-xs md:text-sm">1</span>
                                <span className="text-xs md:text-base"><strong>Login</strong> dengan data siswa valid.</span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="bg-amber-400 text-teal-900 font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shrink-0 text-xs md:text-sm">2</span>
                                <span className="text-xs md:text-base"><strong>Lapor</strong> barang hilang/temu.</span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="bg-amber-400 text-teal-900 font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shrink-0 text-xs md:text-sm">3</span>
                                <span className="text-xs md:text-base"><strong>Sistem Cek</strong> otomatis.</span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="bg-amber-400 text-teal-900 font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shrink-0 text-xs md:text-sm">4</span>
                                <span className="text-xs md:text-base"><strong>Ambil</strong> di ruang BK/TU.</span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}