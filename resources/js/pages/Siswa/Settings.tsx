import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User, Mail, Phone, GraduationCap, Key, Save, Camera, X } from 'lucide-react';

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

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Pengaturan Akun</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola informasi profil dan keamanan akun Anda.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Foto Profil */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <h2 className="text-base font-bold text-slate-800">Foto Profil</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col items-center gap-6 sm:flex-row">
                                <div className="relative">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Profile"
                                            className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover"
                                        />
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
                        </div>
                    </div>

                    {/* Informasi Profil */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <h2 className="text-base font-bold text-slate-800">Informasi Profil</h2>
                        </div>
                        <div className="space-y-5 p-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Email</label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-2.5 pr-4 pl-10 text-sm text-slate-500"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-400">Email tidak dapat diubah</p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Nomor WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            value={data.no_hp}
                                            onChange={(e) => setData('no_hp', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none"
                                            placeholder="08123456789"
                                        />
                                    </div>
                                    {errors.no_hp && <p className="mt-1 text-xs text-red-500">{errors.no_hp}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Kelas</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            value={data.kelas}
                                            onChange={(e) => setData('kelas', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-indigo-500 focus:outline-none"
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {kelasList.map((kelas) => (
                                                <option key={kelas} value={kelas}>
                                                    {kelas}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.kelas && <p className="mt-1 text-xs text-red-500">{errors.kelas}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ubah Password */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 text-left transition-colors hover:bg-slate-100"
                        >
                            <span className="text-base font-bold text-slate-800">Ubah Password</span>
                            <Key size={18} className={`text-slate-500 transition-transform ${showPasswordForm ? 'rotate-90' : ''}`} />
                        </button>

                        {showPasswordForm && (
                            <div className="space-y-5 p-6">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Password Saat Ini</label>
                                    <input
                                        type="password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none"
                                        placeholder="••••••••"
                                    />
                                    {errors.current_password && <p className="mt-1 text-xs text-red-500">{errors.current_password}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Password Baru</label>
                                    <input
                                        type="password"
                                        value={data.new_password}
                                        onChange={(e) => setData('new_password', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none"
                                        placeholder="•••••••• (minimal 6 karakter)"
                                    />
                                    {errors.new_password && <p className="mt-1 text-xs text-red-500">{errors.new_password}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={data.new_password_confirmation}
                                        onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70"
                        >
                            <Save size={18} />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
