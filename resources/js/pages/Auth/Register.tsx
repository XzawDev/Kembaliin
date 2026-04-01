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

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F4F7F6] p-4 font-sans sm:p-8">
            <Head title="Daftar - Kembaliin" />

            {/* CONTAINER UTAMA */}
            <div className="relative flex min-h-[650px] w-full max-w-[1100px] flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] md:flex-row">
                {}
                <div className="relative order-2 hidden w-1/2 overflow-hidden bg-teal-900 md:order-1 md:block">
                    {}
                    <img
                        src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop"
                        alt="School Library"
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${showInfo ? 'scale-125 blur-md brightness-50' : 'brightness-90 hover:scale-105'}`}
                    />

                    {}
                    <div className="absolute inset-0 bg-teal-900/30 mix-blend-multiply"></div>

                    {}
                    <div className={`absolute top-10 right-10 left-10 transition-opacity duration-500 ${showInfo ? 'opacity-0' : 'opacity-100'}`}>
                        <p className="mb-2 text-xs font-bold tracking-widest text-teal-50/80 uppercase">Bergabunglah Bersama Kami</p>
                        <h2 className="text-4xl leading-tight font-extrabold text-white">
                            Jadilah Siswa yang <br /> Jujur & Peduli.
                        </h2>
                    </div>

                    {}
                    <div
                        className={`absolute inset-0 flex transform flex-col items-center justify-center bg-teal-900/80 p-12 text-center backdrop-blur-md transition-all duration-500 ${showInfo ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'}`}
                    >
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                            <span className="text-3xl">📝</span>
                        </div>
                        <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Syarat Pendaftaran</h3>
                        <div className="w-full space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 text-left text-teal-50 shadow-inner backdrop-blur-md">
                            <p className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-teal-900">
                                    1
                                </span>
                                <span className="text-sm">
                                    Gunakan <strong>Nama Lengkap</strong> sesuai absen.
                                </span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-teal-900">
                                    2
                                </span>
                                <span className="text-sm">Nomor WA wajib aktif untuk notifikasi.</span>
                            </p>
                            <p className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-teal-900">
                                    3
                                </span>
                                <span className="text-sm">Satu siswa hanya boleh punya satu akun.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {}
                <div className="relative z-10 order-1 flex w-full flex-col justify-center overflow-y-auto bg-white p-8 sm:p-12 md:order-2 md:w-1/2">
                    {}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>

                    {}
                    <Link
                        href="/login"
                        className="group relative z-10 mb-6 inline-flex w-max items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-teal-50 hover:text-teal-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Kembali ke Login
                    </Link>

                    <div className="relative z-10">
                        {}
                        <div className="mb-8">
                            <span className="text-xs font-bold tracking-wider text-teal-600 uppercase">Registrasi Siswa</span>
                            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Buat Akun Baru</h1>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {}
                            <div>
                                <label className="mb-1.5 ml-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                                    placeholder="Nama sesuai absen..."
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                            </div>

                            {}
                            <div>
                                <label className="mb-1.5 ml-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Email Sekolah / Pribadi
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                                    placeholder="siswa@sekolah.sch.id"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
                            </div>

                            {}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 ml-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        No. WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                                        placeholder="0812..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 ml-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">Kelas</label>
                                    <input
                                        type="text"
                                        value={data.kelas}
                                        onChange={(e) => setData('kelas', e.target.value)}
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                                        placeholder="X RPL 1"
                                        required
                                    />
                                </div>
                            </div>

                            {}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 ml-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                                        placeholder="••••••"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 ml-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        Konfirmasi
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                                        placeholder="••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {}
                            {(errors.password || errors.no_hp || errors.kelas) && (
                                <p className="rounded-lg bg-red-50 p-2 text-center text-xs font-medium text-red-500">
                                    Cek kembali data yang merah ya!
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 py-4 text-lg font-bold text-white shadow-lg shadow-teal-900/20 transition-all duration-200 hover:scale-[1.01] hover:bg-teal-900 active:scale-[0.98] disabled:opacity-70"
                            >
                                {processing ? (
                                    'Mendaftarkan...'
                                ) : (
                                    <>
                                        Daftar Sekarang
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
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
            </div>
        </div>
    );
}
