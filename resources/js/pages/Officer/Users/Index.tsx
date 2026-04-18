// resources/js/Pages/Officer/Users/Index.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import { Plus, Edit, Trash2, Search, Shield, UserCheck, UserX, Filter, Mail, Phone, Eye } from 'lucide-react';
import UserForm from './UserForm';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    kelas: string | null;
    no_hp: string | null;
    is_active: boolean;
    foto: string | null;
}

interface Props {
    users: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        role?: string;
        is_active?: string;
    };
}

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [activeFilter, setActiveFilter] = useState(filters.is_active || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [processing, setProcessing] = useState(false);

    // PERBAIKAN: Mengganti route() dengan string URL manual
    const handleFilter = () => {
        router.get(
            '/officer/users',
            {
                search,
                role: roleFilter,
                is_active: activeFilter,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(`/officer/users/${id}`);
        }
    };

    const openAddModal = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleSubmit = (data: any) => {
        setProcessing(true);
        if (editingUser) {
            router.put(`/officer/users/${editingUser.id}`, data, {
                onSuccess: () => {
                    setModalOpen(false);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
            });
        } else {
            router.post('/officer/users', data, {
                onSuccess: () => {
                    setModalOpen(false);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
            });
        }
    };

    const initialFormData = editingUser
        ? {
              name: editingUser.name,
              email: editingUser.email,
              role: editingUser.role,
              kelas: editingUser.kelas || '',
              no_hp: editingUser.no_hp || '',
              is_active: editingUser.is_active,
              password: '',
              password_confirmation: '',
          }
        : {
              name: '',
              email: '',
              role: 'siswa',
              kelas: '',
              no_hp: '',
              is_active: true,
              password: '',
              password_confirmation: '',
          };

    return (
        <OfficerLayout>
            <Head title="Manajemen User" />

            <div className="mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">Manajemen User</h1>
                        <p className="mt-1 text-sm text-slate-500">Kelola data siswa dan petugas yang terdaftar.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-95"
                    >
                        <Plus size={20} />
                        Tambah User
                    </button>
                </div>

                {/* Filters Section */}
                <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
                        <div className="md:col-span-5">
                            <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-400 uppercase">Cari Nama / Email</label>
                            <div className="relative">
                                <Search className="absolute top-3 left-4 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Ketik nama atau email..."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-11 text-sm focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-3">
                            <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-400 uppercase">Role</label>
                            <select
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">Semua Role</option>
                                <option value="siswa">Siswa</option>
                                <option value="petugas">Petugas</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-400 uppercase">Status</label>
                            <select
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Aktif</option>
                                <option value="0">Non-Aktif</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={handleFilter}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800"
                            >
                                <Filter size={18} />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* DESKTOP VIEW: Table */}
                <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">User</th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Role & Kelas</th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold tracking-widest text-slate-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.data.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                                                {user.foto ? (
                                                    <img src={`/storage/${user.foto}`} className="h-full w-full object-cover" alt={user.name} />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-teal-100 font-bold text-teal-700 uppercase">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                    user.role === 'petugas' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                            {user.kelas && <span className="text-xs font-medium text-slate-500">• {user.kelas}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_active ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                                                <UserCheck size={14} /> Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase">
                                                <UserX size={14} /> Non-Aktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {/* PERBAIKAN: Mengganti route() menjadi URL Manual */}
                                            <Link
                                                href={`/officer/users/${user.id}`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-teal-500 hover:text-teal-600"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={14} />
                                            </Link>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-indigo-500 hover:text-indigo-600"
                                                title="Edit User"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-50"
                                                title="Hapus User"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE VIEW: Cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {users.data.map((user) => (
                        <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-100">
                                        {user.foto ? (
                                            <img src={`/storage/${user.foto}`} className="h-full w-full object-cover" alt={user.name} />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-teal-100 font-bold text-teal-700 uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{user.name}</h3>
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                                                user.role === 'petugas' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'
                                            }`}
                                        >
                                            {user.role} {user.kelas && `• ${user.kelas}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {user.is_active ? (
                                        <UserCheck size={18} className="text-emerald-500" />
                                    ) : (
                                        <UserX size={18} className="text-rose-500" />
                                    )}
                                </div>
                            </div>

                            <div className="mb-5 space-y-2 border-y border-slate-50 py-4">
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                    <Mail size={14} className="text-slate-400" /> {user.email}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                    <Phone size={14} className="text-slate-400" /> {user.no_hp || 'Belum diatur'}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {/* PERBAIKAN: Mengganti route() menjadi URL Manual */}
                                <Link
                                    href={`/officer/users/${user.id}`}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-[10px] font-bold text-slate-700 transition-all active:bg-slate-50"
                                >
                                    <Eye size={14} /> Detail
                                </Link>
                                <button
                                    onClick={() => openEditModal(user)}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-[10px] font-bold text-slate-700 transition-all active:bg-slate-50"
                                >
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-100 py-2.5 text-[10px] font-bold text-rose-600 transition-all active:bg-rose-50"
                                >
                                    <Trash2 size={14} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {users.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-xs font-bold transition-all ${
                                    link.active
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                        : 'border border-slate-200 bg-white text-slate-500 hover:border-teal-600 hover:text-teal-600'
                                } ${!link.url ? 'cursor-not-allowed opacity-40' : 'active:scale-95'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            <UserForm
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={initialFormData}
                editingId={editingUser?.id}
                processing={processing}
            />
        </OfficerLayout>
    );
}
