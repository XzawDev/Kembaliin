import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Login() {
    const [showInfo, setShowInfo] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F4F7F6] p-4 font-sans sm:p-8">
            <Head title="Masuk - Kembaliin" />

            {}
            <div className="relative flex min-h-[600px] w-full max-w-[1100px] flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] md:flex-row">
                {}
                <div className="relative z-10 flex w-full flex-col justify-center bg-white p-10 sm:p-14 md:w-1/2">
                    {}
                    <div className="mb-10 flex items-center gap-3">
                        <div className="relative flex h-12 w-12 items-center justify-center">
                            {}
                            <svg
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-full w-full text-teal-800 drop-shadow-sm"
                            >
                                <path
                                    d="M24 4C16.268 4 10 10.268 10 18C10 28.5 24 44 24 44C24 44 38 28.5 38 18C38 10.268 31.732 4 24 4Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M24 11C20.134 11 17 14.134 17 18C17 19.933 17.784 21.683 19.05 22.95L24 28L28.95 22.95C30.216 21.683 31 19.933 31 18C31 14.134 27.866 11 24 11ZM24 24C22.343 24 21 22.657 21 21H23V16L18 21L23 26V23C25.761 23 28 20.761 28 18H26C26 19.105 25.105 20 24 20V24Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <span className="text-3xl font-extrabold tracking-tight text-slate-800">Kembaliin.</span>
                    </div>

                    <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900">Selamat Datang!</h1>
                    <p className="mb-8 font-medium text-slate-500">Silakan masuk untuk melapor atau mencari barangmu.</p>

                    <form onSubmit={submit} className="space-y-5">
                        {}
                        <div>
                            <label className="mb-2 ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase" htmlFor="email">
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-4 font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-700 focus:bg-slate-50 focus:ring-4 focus:ring-teal-700/10"
                                placeholder="nama@siswa.com"
                                required
                            />
                            {errors.email && <p className="mt-2 ml-1 text-sm font-medium text-red-500">{errors.email}</p>}
                        </div>

                        {}
                        <div>
                            <label className="mb-2 ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-4 font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-700 focus:bg-slate-50 focus:ring-4 focus:ring-teal-700/10"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="mt-2 ml-1 text-sm font-medium text-red-500">{errors.password}</p>}
                        </div>

                        <div className="mt-2 mb-6 flex items-center justify-between px-1">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700" />
                                <span className="text-sm font-medium text-slate-600">Ingat saya</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-teal-700 transition-colors hover:text-teal-600">
                                Lupa password?
                            </a>
                        </div>

                        {}
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-xl bg-teal-800 py-4 text-lg font-bold text-white shadow-lg shadow-teal-900/20 transition-all duration-200 hover:bg-teal-900 active:scale-[0.98] disabled:opacity-70"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>

                            <Link
                                href="/register"
                                className="flex flex-1 items-center justify-center rounded-xl border-2 border-teal-800 bg-white py-4 text-center text-lg font-bold text-teal-800 transition-all duration-200 hover:bg-teal-50 active:scale-[0.98]"
                            >
                                Buat akun
                            </Link>
                        </div>
                    </form>
                </div>

                {}
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`group absolute top-1/2 left-1/2 z-20 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-amber-400 shadow-xl transition-all duration-300 hover:scale-110 md:flex ${showInfo ? 'rotate-180 bg-rose-500 text-white' : 'text-amber-900'}`}
                    title="Cara Kerja Aplikasi"
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
                            className="ml-0.5 h-6 w-6 group-hover:text-amber-950"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                            />
                        </svg>
                    )}
                </button>

                {}
                <div className="relative hidden w-1/2 overflow-hidden bg-slate-100 md:block">
                    {}
                    <img
                        src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop"
                        alt="School Hallway"
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${showInfo ? 'scale-125 blur-md brightness-50' : 'brightness-90 hover:scale-105'}`}
                    />

                    {}
                    <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply"></div>

                    {}
                    <div
                        className={`absolute inset-0 flex transform flex-col items-center justify-center bg-teal-900/80 p-12 text-center backdrop-blur-md transition-all duration-500 ${showInfo ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'}`}
                    >
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                            <span className="text-3xl">🔍</span>
                        </div>
                        <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Cara Kerja Kembaliin</h3>
                        <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 text-left text-teal-50 shadow-inner backdrop-blur-md">
                            <p className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-teal-900">
                                    1
                                </span>
                                <span>
                                    <strong>Login/Daftar</strong> menggunakan data siswa yang valid.
                                </span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-teal-900">
                                    2
                                </span>
                                <span>
                                    <strong>Buat Laporan</strong> barang yang kamu temukan atau hilangkan.
                                </span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-teal-900">
                                    3
                                </span>
                                <span>
                                    <strong>Sistem Mencocokkan</strong> data secara otomatis.
                                </span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-teal-900">
                                    4
                                </span>
                                <span>
                                    <strong>Ambil Barang</strong> di ruang BK/TU sekolah!
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
