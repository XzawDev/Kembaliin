import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User, Mail, Phone, GraduationCap, Key, Save, Camera, X, ChevronRight, ShieldCheck, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        no_hp: string | null;
        kelas: string | null;
        role: string;
        foto: string | null;
    };
    kelasList: string[];
}

export default function Settings({ user, kelasList }: Props) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(user.foto ? `/storage/${user.foto}` : null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        no_hp: user.no_hp || '',
        kelas: user.kelas || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
        photo: null as File | null,
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const removePhoto = () => {
        setData('photo', null);
        setPhotoPreview(null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('no_hp', data.no_hp);
        formData.append('kelas', data.kelas);
        if (data.photo) formData.append('photo', data.photo);
        if (data.current_password) formData.append('current_password', data.current_password);
        if (data.new_password) formData.append('new_password', data.new_password);
        if (data.new_password_confirmation) formData.append('new_password_confirmation', data.new_password_confirmation);

        router.post('/Siswa/pengaturan', formData, {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'new_password', 'new_password_confirmation');
                setShowPasswordForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Akun" />

            <div className="mx-auto max-w-5xl">
                {/* Page Title Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Pengaturan Akun</h1>
                    <p className="text-sm font-medium text-slate-500">Kelola informasi profil, kontak, dan keamanan akun Anda.</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: Profile Card (Takes 4 cols on desktop) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-slate-50 shadow-inner ring-1 ring-slate-200">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                                    <User size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -right-2 -bottom-2 cursor-pointer rounded-2xl bg-teal-600 p-2.5 text-white shadow-xl shadow-teal-600/20 transition-transform hover:scale-110 active:scale-95">
                                            <Camera size={18} />
                                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                        </label>
                                    </div>

                                    <div className="mt-5 text-center">
                                        <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                                        <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold tracking-wider text-teal-600 uppercase">
                                            {/* <BadgeCheck size={14} /> */}
                                            <span>{user.role}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 w-full space-y-4 border-t border-slate-100 pt-6">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="rounded-lg bg-slate-100 p-2">
                                                <Mail size={16} />
                                            </div>
                                            <span className="truncate text-sm font-medium">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="rounded-lg bg-slate-100 p-2">
                                                <GraduationCap size={16} />
                                            </div>
                                            <span className="text-sm font-medium">Kelas {user.kelas || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            {/* <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
                                <p className="text-xs leading-relaxed font-medium text-teal-800">
                                    <strong>Tips:</strong> Gunakan foto wajah yang jelas agar petugas dapat mengenali Anda saat pengambilan barang.
                                </p>
                            </div> */}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Forms (Takes 8 cols on desktop) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Section: Basic Info */}
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
                            <div className="border-b border-slate-100 bg-white px-6 py-5">
                                <h2 className="text-base font-bold text-slate-800">Informasi Identitas</h2>
                            </div>
                            <div className="space-y-6 p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pr-4 pl-12 text-sm font-semibold transition-all outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/5"
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Nomor WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="tel"
                                                value={data.no_hp}
                                                placeholder="08..."
                                                onChange={(e) => setData('no_hp', e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pr-4 pl-12 text-sm font-semibold transition-all outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Pilih Kelas</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            value={data.kelas}
                                            onChange={(e) => setData('kelas', e.target.value)}
                                            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pr-4 pl-12 text-sm font-semibold transition-all outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/5"
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {kelasList.map((kelas) => (
                                                <option key={kelas} value={kelas}>
                                                    {kelas}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Security */}
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
                            <button
                                type="button"
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="flex w-full items-center justify-between px-6 py-5 transition-colors hover:bg-slate-50"
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-slate-800">Keamanan Akun</h3>
                                        <p className="text-xs font-medium text-slate-500">Password</p>
                                    </div>
                                </div>
                                <ChevronRight
                                    className={`text-slate-400 transition-transform duration-300 ${showPasswordForm ? 'rotate-90 text-teal-600' : ''}`}
                                    size={20}
                                />
                            </button>

                            <AnimatePresence>
                                {showPasswordForm && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-slate-50/30"
                                    >
                                        <div className="space-y-5 border-t border-slate-100 p-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    Password Saat Ini
                                                </label>
                                                <input
                                                    type="password"
                                                    value={data.current_password}
                                                    onChange={(e) => setData('current_password', e.target.value)}
                                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/5"
                                                />
                                            </div>
                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                        Password Baru
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={data.new_password}
                                                        onChange={(e) => setData('new_password', e.target.value)}
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/5"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                        Konfirmasi
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={data.new_password_confirmation}
                                                        onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/5"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Save Action */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-95 disabled:opacity-70 md:w-auto"
                            >
                                {processing ? (
                                    'Menyimpan...'
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Simpan Perubahan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
