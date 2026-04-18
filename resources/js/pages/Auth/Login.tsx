import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
    const { auth } = usePage().props as any;
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            window.location.replace('/home');
        }
    }, [auth]);

    useEffect(() => {
        const handlePageshow = (event: PageTransitionEvent) => {
            if (event.persisted && auth?.user) {
                window.location.replace('/home');
            }
        };
        window.addEventListener('pageshow', handlePageshow);
        return () => window.removeEventListener('pageshow', handlePageshow);
    }, [auth]);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB] p-4 font-sans md:p-8">
            <Head title="Masuk - Kembaliin" />

            <div className="relative flex w-full max-w-[1100px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] md:min-h-[600px] md:flex-row">
                {/* Left Side: Form */}
                <div className="relative z-10 flex w-full flex-col justify-center p-6 sm:p-10 md:w-1/2 md:p-14">
                    {/* LOGO REPLACED HERE */}
                    {/* <div className="mb-6 flex items-center md:mb-10">
                        <Link href="/">
                            <img
                                src="/logo.png" // Make sure the image is in your public folder
                                alt="Kembaliin"
                                className="h-5 w-auto object-contain md:h-5"
                            />
                        </Link>
                    </div> */}

                    <Link
                        href="/home"
                        className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-[#0f766e] sm:mb-8 sm:text-sm"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-slate-900 md:mb-3 md:text-4xl">Selamat Datang!</h1>
                    <p className="mb-6 text-sm font-medium text-slate-500 md:mb-8 md:text-base">Silakan masuk untuk melapor atau mencari barangmu.</p>

                    <form onSubmit={submit} className="space-y-4 md:space-y-5">
                        {/* Email Input */}
                        <div>
                            <label
                                className="mb-1.5 ml-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase md:text-xs"
                                htmlFor="email"
                            >
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3 font-medium text-slate-800 transition-all outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-700/5 md:px-5 md:py-4"
                                placeholder="nama@siswa.com"
                                required
                            />
                            {errors.email && <p className="mt-2 text-xs font-medium text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label
                                className="mb-1.5 ml-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase md:text-xs"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3 font-medium text-slate-800 transition-all outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-700/5 md:px-5 md:py-4"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="mt-2 text-xs font-medium text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700" />
                                <span className="text-xs font-medium text-slate-600 md:text-sm">Ingat saya</span>
                            </label>
                            <a href="#" className="text-xs font-bold text-teal-700 hover:text-teal-600 md:text-sm">
                                Lupa password?
                            </a>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8 md:gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-xl bg-teal-800 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-900/10 transition-all hover:bg-teal-900 active:scale-[0.98] disabled:opacity-70 md:py-4 md:text-lg"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>

                            <Link
                                href="/register"
                                className="flex flex-1 items-center justify-center rounded-xl border-2 border-teal-800 bg-white py-3.5 text-center text-base font-bold text-teal-800 transition-all hover:bg-teal-50 active:scale-[0.98] md:py-4 md:text-lg"
                            >
                                Buat akun
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Info Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`group absolute top-1/2 left-1/2 z-20 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-amber-400 shadow-xl transition-all duration-300 hover:scale-110 md:flex ${showInfo ? 'rotate-180 bg-rose-500 text-white' : 'text-amber-900'}`}
                >
                    {showInfo ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="ml-0.5 h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                            />
                        </svg>
                    )}
                </button>

                {/* Right Side: Image/Info (Hidden on Mobile) */}
                <div className="relative hidden w-1/2 overflow-hidden bg-slate-100 md:block">
                    <img
                        src="/foto_kelas.jpg"
                        alt="School Hallway"
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${showInfo ? 'scale-110 blur-sm brightness-50' : 'brightness-90 hover:scale-105'}`}
                    />
                    <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply"></div>
                    <div
                        className={`absolute inset-0 flex transform flex-col items-center justify-center bg-teal-900/80 p-12 text-center backdrop-blur-md transition-all duration-500 ${showInfo ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'}`}
                    >
                        <h3 className="mb-6 text-3xl font-bold text-white">Cara Kerja Kembaliin</h3>
                        <div className="space-y-4 text-left text-teal-50">
                            {[
                                { n: 1, t: 'Login/Daftar', d: 'Gunakan data siswa valid.' },
                                { n: 2, t: 'Buat Laporan', d: 'Input barang temuan/hilang.' },
                                { n: 3, t: 'Matching', d: 'Sistem mencocokkan data.' },
                                { n: 4, t: 'Ambil', d: 'Ambil barang di ruang BK/TU.' },
                            ].map((step) => (
                                <p key={step.n} className="flex items-start gap-3">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-teal-900">
                                        {step.n}
                                    </span>
                                    <span className="text-sm">
                                        <strong>{step.t}</strong>: {step.d}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
