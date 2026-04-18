// resources/js/Pages/Officer/Users/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface UserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    kelas: string;
    no_hp: string;
    is_active: boolean;
}

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => void;
    initialData?: UserFormData | null;
    editingId?: number | null;
    processing?: boolean;
}

export default function UserForm({ isOpen, onClose, onSubmit, initialData, editingId, processing = false }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'siswa',
        kelas: '',
        no_hp: '',
        is_active: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 'siswa',
                kelas: '',
                no_hp: '',
                is_active: true,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{editingId ? 'Edit User' : 'Tambah User'}</h2>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nama</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => {
                                const newRole = e.target.value;
                                setFormData({
                                    ...formData,
                                    role: newRole,
                                    kelas: newRole === 'siswa' ? formData.kelas : '',
                                });
                            }}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        >
                            <option value="siswa">Siswa</option>
                            <option value="petugas">Petugas</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {formData.role === 'siswa' && (
                        <div>
                            <label className="block text-sm font-medium">Kelas</label>
                            <input
                                type="text"
                                value={formData.kelas}
                                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                                placeholder="Contoh: X RPL 1"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium">No HP</label>
                        <input
                            type="text"
                            value={formData.no_hp}
                            onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            placeholder={editingId ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            id="is_active"
                        />
                        <label htmlFor="is_active" className="text-sm">
                            Aktif
                        </label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
