import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Hammer, ArrowLeft, Construction, Cog } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnderDevelopment() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB] p-6 font-sans">
            <Head title="Halaman Sedang Dikembangkan" />

            <div className="relative w-full max-w-lg text-center">
                {/* Decorative Background Elements */}
                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" />
                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50 md:p-12"
                >
                    {/* Icon Section */}
                    <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-3xl bg-teal-50"
                        />
                        <Hammer size={48} className="relative text-teal-600" />

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                            className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-amber-900 shadow-lg"
                        >
                            <Cog size={20} />
                        </motion.div>
                    </div>

                    {/* Text Content */}
                    <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Sedang Dikembangkan</h1>
                    <p className="mb-10 text-sm leading-relaxed font-medium text-slate-500 md:text-base">
                        Fitur ini masih dalam tahap pengerjaan oleh tim kami. <br className="hidden md:block" />
                        Kami akan segera hadir untuk memberikan pengalaman terbaik bagi Anda.
                    </p>

                    {/* Progress Indicator (Fake for visual) */}
                    <div className="mb-10 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            <span>Progress</span>
                            <span>91%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '91%' }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link
                        href="/home"
                        className="group inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/20 active:scale-95"
                    >
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Kembali ke Beranda
                    </Link>
                </motion.div>

                {/* Footer simple tag */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-xs font-bold tracking-widest text-slate-400 uppercase"
                >
                    Kembaliin Project &bull; 2024
                </motion.p>
            </div>
        </div>
    );
}
