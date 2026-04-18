import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User, Mail, Phone, School, Lock, Upload, X, Camera } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    no_hp: string | null;
    kelas: string | null;
    foto: string | null;
    role: string;
}

interface Props {
    user: User;
    kelasList: string[];
}

export default function ProfileEdit({ user, kelasList }: Props) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(user.foto ? `/storage/${user.foto}` : null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name,
        no_hp: user.no_hp || '',
        kelas: user.kelas || '',
        photo: null as File | null,
        current_password: '',
        password: '',
        password_confirmation: '',
        _method: 'PUT',
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
        post('/profile', {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
                setShowPasswordForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Profil" />
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50/50 p-6">
                        <h1 className="text-xl font-bold text-slate-900">Pengaturan Profil</h1>
                        <p className="mt-1 text-sm text-slate-500">Kelola informasi akun Anda</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 p-6">
                        {/* Foto Profil */}
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                            <div className="relative">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover" />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-100 text-slate-400">
                                        <User size={40} />
                                    </div>
                                )}
                                <label className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-teal-600 p-1.5 transition hover:bg-teal-700">
                                    <Camera size={14} className="text-white" />
                                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                </label>
                                {photoPreview && (
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 hover:bg-red-600"
                                    >
                                        <X size={12} className="text-white" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-sm font-medium text-slate-700">Foto Profil</p>
                                <p className="mt-1 text-xs text-slate-500">Format JPG, PNG maks 2MB</p>
                            </div>
                        </div>

                        {/* Nama */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                <User size={14} className="mr-1 inline" /> Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 focus:border-teal-500 focus:ring-teal-500"
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email (readonly) */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                <Mail size={14} className="mr-1 inline" /> Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-500"
                            />
                            <p className="mt-1 text-xs text-slate-400">Email tidak dapat diubah</p>
                        </div>

                        {/* Nomor HP */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                <Phone size={14} className="mr-1 inline" /> Nomor WhatsApp
                            </label>
                            <input
                                type="text"
                                value={data.no_hp}
                                onChange={(e) => setData('no_hp', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="08123456789"
                            />
                            {errors.no_hp && <p className="mt-1 text-xs text-red-500">{errors.no_hp}</p>}
                        </div>

                        {/* Kelas (dropdown) */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                <School size={14} className="mr-1 inline" /> Kelas
                            </label>
                            <select
                                value={data.kelas}
                                onChange={(e) => setData('kelas', e.target.value)}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 focus:border-teal-500 focus:ring-teal-500"
                            >
                                <option value="">Pilih Kelas</option>
                                {kelasList.map((kelas) => (
                                    <option key={kelas} value={kelas}>
                                        {kelas}
                                    </option>
                                ))}
                            </select>
                            {errors.kelas && <p className="mt-1 text-xs text-red-500">{errors.kelas}</p>}
                        </div>

                        {/* Ubah Password */}
                        <div className="border-t border-slate-200 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                            >
                                {showPasswordForm ? 'Sembunyikan form password' : 'Ubah Password'}
                            </button>

                            {showPasswordForm && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Password Saat Ini</label>
                                        <input
                                            type="password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5"
                                            placeholder="Masukkan password lama"
                                        />
                                        {errors.current_password && <p className="mt-1 text-xs text-red-500">{errors.current_password}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Password Baru</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5"
                                            placeholder="Minimal 6 karakter"
                                        />
                                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tombol Simpan */}
                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/Siswa/dashboard')}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
