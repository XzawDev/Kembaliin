import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Register() {
    const [showInfo, setShowInfo] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        no_hp: '',
        kelas: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 sm:p-8 font-sans">
            <Head title="Daftar - Kembaliin" />

            {/* CONTAINER UTAMA */}
            <div className="flex flex-col md:flex-row w-full max-w-[1100px] min-h-[650px] bg-white rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden relative">
                
                {}
                <div className="hidden md:block w-1/2 relative bg-teal-900 overflow-hidden order-2 md:order-1">
                    
                    {}
                    <img 
                        src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop" 
                        alt="School Library" 
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${showInfo ? 'scale-125 blur-md brightness-50' : 'hover:scale-105 brightness-90'}`}
                    />
                    
                    {}
                    <div className="absolute inset-0 bg-teal-900/30 mix-blend-multiply"></div>

                    {}
                    <div className={`absolute top-10 left-10 right-10 transition-opacity duration-500 ${showInfo ? 'opacity-0' : 'opacity-100'}`}>
                        <p className="text-teal-50/80 font-bold tracking-widest uppercase text-xs mb-2">Bergabunglah Bersama Kami</p>
                        <h2 className="text-white text-4xl font-extrabold leading-tight">Jadilah Siswa yang <br/> Jujur & Peduli.</h2>
                    </div>

                    {}
                    <div className={`absolute inset-0 bg-teal-900/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center transition-all duration-500 transform ${showInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                            <span className="text-3xl">📝</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Syarat Pendaftaran</h3>
                        <div className="text-teal-50 space-y-4 text-left bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner w-full">
                            <p className="flex items-start gap-3">
                                <span className="bg-amber-400 text-teal-900 font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0 text-xs">1</span>
                                <span className="text-sm">Gunakan <strong>Nama Lengkap</strong> sesuai absen.</span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="bg-amber-400 text-teal-900 font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0 text-xs">2</span>
                                <span className="text-sm">Nomor WA wajib aktif untuk notifikasi.</span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="bg-amber-400 text-teal-900 font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0 text-xs">3</span>
                                <span className="text-sm">Satu siswa hanya boleh punya satu akun.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative z-10 overflow-y-auto order-1 md:order-2 bg-white">
                    
                    {}
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>

                    {}
                    <Link 
                        href="/login" 
                        className="relative z-10 inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-700 mb-6 transition-all w-max group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Kembali ke Login
                    </Link>

                    <div className="relative z-10">
                        {}
                        <div className="mb-8">
                            <span className="text-teal-600 font-bold tracking-wider text-xs uppercase">Registrasi Siswa</span>
                            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">Buat Akun Baru</h1>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                                    placeholder="Nama sesuai absen..."
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                            </div>

                            {}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Email Sekolah / Pribadi</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                                    placeholder="siswa@sekolah.sch.id"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>

                            {}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">No. WhatsApp</label>
                                    <input
                                        type="text"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                                        placeholder="0812..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Kelas</label>
                                    <input
                                        type="text"
                                        value={data.kelas}
                                        onChange={(e) => setData('kelas', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                                        placeholder="X RPL 1"
                                        required
                                    />
                                </div>
                            </div>

                            {}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                                        placeholder="••••••"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Konfirmasi</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                                        placeholder="••••••"
                                        required
                                    />
                                </div>
                            </div>
                            
                            {}
                            {(errors.password || errors.no_hp || errors.kelas) && (
                                <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg font-medium text-center">
                                    Cek kembali data yang merah ya!
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-teal-800 text-white text-lg font-bold rounded-xl shadow-lg shadow-teal-900/20 hover:bg-teal-900 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 mt-4 flex items-center justify-center gap-2"
                            >
                                {processing ? 'Mendaftarkan...' : (
                                    <>
                                        Daftar Sekarang 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {}
                <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-amber-400 rounded-full items-center justify-center shadow-xl z-20 border-4 border-white cursor-pointer hover:scale-110 transition-all duration-300 group ${showInfo ? 'rotate-180 bg-rose-500 text-white' : 'text-amber-900'}`}
                >
                    {showInfo ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 ml-0.5 group-hover:text-amber-950">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    )}
                </button>

            </div>
        </div>
    );
}