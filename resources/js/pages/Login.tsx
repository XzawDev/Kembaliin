import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post('/login');
    };

    return (
        // Background utama warna abu-abu khas Apple (#F5F5F7)
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex items-center justify-center p-4 sm:p-8">
            <Head title="Masuk - Kembaliin" />

            {/* BENTO GRID CONTAINER */}
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                
                {/* BENTO BOX 1: HERO / BRANDING (Kotak Lebar - 2 Kolom) */}
                <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-sm border border-gray-100 overflow-hidden relative group">
                    {/* Efek gradient tipis di pojok untuk estetika */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-all duration-700"></div>
                    
                    <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-[1.2rem] bg-black text-white mb-8 shadow-md">
                            {/* Ikon Koper/Barang */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 10.5b0 0-0 8.25m-16.5 0v8.25m-16.5-8.25H3.75m16.5 0H20.25m-16.5 0a2.25 2.25 0 00-2.25 2.25v6a2.25 2.25 0 002.25 2.25h16.5a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25H3.75z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                            Platform pintar untuk <br className="hidden sm:block"/> barang hilangmu.
                        </h1>
                        <p className="text-gray-500 text-lg max-w-md font-medium leading-relaxed">
                            Kembaliin dirancang dengan sistem yang aman untuk memudahkan pelaporan dan penemuan barang di lingkungan sekolah.
                        </p>
                    </div>
                </div>

                {/* BENTO BOX 2: FORM LOGIN (Kotak Tinggi - 2 Baris) */}
                <div className="md:col-span-1 md:row-span-2 bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col relative z-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Masuk</h2>
                        <p className="text-gray-500 text-sm font-medium">Gunakan akun yang terdaftar</p>
                    </div>

                    <form onSubmit={submit} className="flex-1 flex flex-col justify-center space-y-5">
                        {/* Input Email dengan desain Soft Gray */}
                        <div>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-[#F5F5F7] border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-[#1D1D1F] placeholder-gray-400 font-semibold"
                                placeholder="Alamat Email"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.email}</p>}
                        </div>

                        {/* Input Password */}
                        <div>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-[#F5F5F7] border-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-[#1D1D1F] placeholder-gray-400 font-semibold"
                                placeholder="Password"
                                required
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.password}</p>}
                        </div>

                        {/* Tombol Hitam Elegan */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 mt-6 bg-[#1D1D1F] text-white text-lg font-bold rounded-2xl shadow-lg shadow-gray-300/50 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center"
                        >
                            {processing ? 'Memproses...' : 'Lanjutkan'}
                        </button>
                    </form>
                </div>

                {/* BENTO BOX 3: INFO KEAMANAN (Kotak Kecil Kiri Bawah) - Mode Gelap */}
                <div className="bg-[#1D1D1F] text-white rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-sm border border-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-9 h-9 text-blue-400 mb-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight mb-1">Aman & Rahasia</h3>
                        <p className="text-gray-400 text-sm font-medium">Seluruh data pelaporan dilindungi oleh sistem.</p>
                    </div>
                </div>

                {/* BENTO BOX 4: LINK REGISTER (Kotak Kecil Tengah Bawah) */}
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-center items-center text-center shadow-sm border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-[#F5F5F7] rounded-[1.2rem] flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                        <span className="text-2xl">👋</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight mb-1 text-[#1D1D1F]">Siswa Baru?</h3>
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors flex items-center gap-1">
                        Buat akun sekarang 
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}