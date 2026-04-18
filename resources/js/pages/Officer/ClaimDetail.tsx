// resources/js/pages/Officer/ClaimDetail.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout';
import { ArrowLeft, Check, X, Package, User, FileText, AlertCircle, Upload } from 'lucide-react';

interface Claim {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    admin_notes?: string;
    proof_image_url?: string | null;
    item: {
        name: string;
        slug: string;
        description: string | null;
        location: string;
        date: string;
        report_type: 'hilang' | 'ditemukan';
        category: { name: string };
        user: { name: string; email: string; no_hp?: string; kelas?: string };
        images: { url: string }[];
    };
    user: { name: string; email: string; no_hp?: string; kelas?: string };
    verificationAnswers?: { id: number; answer: string; is_correct: boolean; question: { question: string } }[];
}

export default function ClaimDetail({ claim }: { claim: Claim }) {
    const [processing, setProcessing] = useState(false);
    const [notes, setNotes] = useState(claim?.admin_notes || '');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
        }
    };

    const handleVerify = (status: 'approved' | 'rejected') => {
        if (!confirm(`Konfirmasi: ${status === 'approved' ? 'Setujui' : 'Tolak'} klaim ini?`)) return;
        setProcessing(true);
        const formData = new FormData();
        formData.append('status', status);
        formData.append('admin_notes', notes);
        router.post(`/officer/claims/${claim.id}/verify`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => setProcessing(false),
        });
    };

    const handleUploadProof = () => {
        if (!proofFile) return;
        if (!confirm('Unggah foto bukti pengambilan barang?')) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('proof_image', proofFile);
        router.post(`/officer/claims/${claim.id}/upload-proof`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => {
                setUploading(false);
                setProofFile(null);
                setProofPreview(null);
            },
        });
    };

    if (!claim || !claim.item) {
        return (
            <OfficerLayout>
                <div className="flex min-h-[50vh] items-center justify-center p-8 text-center text-slate-500">Data klaim tidak ditemukan.</div>
            </OfficerLayout>
        );
    }

    return (
        <OfficerLayout>
            <Head title={`Klaim: ${claim.item.name}`} />

            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/officer/claims"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 md:text-xl">Detail Verifikasi Klaim</h1>
                            <p className="text-xs text-slate-500">ID Klaim: #{claim.id}</p>
                        </div>
                    </div>
                    <StatusBadge status={claim.status} />
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* KOLOM KIRI */}
                        <div className="border-b border-slate-200 p-5 md:p-8 lg:border-r lg:border-b-0">
                            <div className="mb-8">
                                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-bold tracking-wider text-slate-800 uppercase">
                                    <Package size={16} className="text-indigo-500" /> Informasi Barang
                                </h2>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    {claim.item.images && claim.item.images.length > 0 ? (
                                        <img
                                            src={claim.item.images[0].url}
                                            alt={claim.item.name}
                                            className="h-32 w-full shrink-0 rounded-lg border border-slate-200 object-cover sm:w-28 md:h-36 md:w-32"
                                        />
                                    ) : (
                                        <div className="flex h-32 w-full shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 sm:w-28 md:h-36 md:w-32">
                                            <Package size={24} className="mb-1 opacity-50" />
                                            No Image
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-lg leading-tight font-bold text-slate-900">{claim.item.name}</h3>
                                        <div className="space-y-1.5 text-sm text-slate-700">
                                            <p>
                                                <strong className="font-semibold text-slate-500">Tipe Laporan:</strong>{' '}
                                                <span className="capitalize">{claim.item.report_type}</span>
                                            </p>
                                            <p>
                                                <strong className="font-semibold text-slate-500">Kategori:</strong> {claim.item.category?.name || '-'}
                                            </p>
                                            <p>
                                                <strong className="font-semibold text-slate-500">Lokasi:</strong> {claim.item.location}
                                            </p>
                                            <p>
                                                <strong className="font-semibold text-slate-500">Tanggal:</strong> {claim.item.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-3">
                                    <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Deskripsi</span>
                                    <p className="text-sm text-slate-700">{claim.item.description || 'Tidak ada deskripsi tambahan.'}</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm font-bold tracking-wider text-slate-800 uppercase">
                                    <User size={16} className="text-indigo-500" /> Data Pelapor (Penemu)
                                </h2>
                                <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                                    <InfoBlock label="Nama Lengkap" value={claim.item.user?.name} />
                                    <InfoBlock label="Kelas" value={claim.item.user?.kelas} />
                                    <InfoBlock label="Email" value={claim.item.user?.email} />
                                    <InfoBlock label="No. Handphone" value={claim.item.user?.no_hp} />
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN */}
                        <div className="bg-slate-50/50 p-5 md:p-8">
                            <div className="mb-8">
                                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold tracking-wider text-slate-800 uppercase">
                                    <User size={16} className="text-amber-500" /> Identitas Pengklaim
                                </h2>
                                <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                                    <InfoBlock label="Nama Lengkap" value={claim.user?.name} />
                                    <InfoBlock label="Kelas" value={claim.user?.kelas} />
                                    <InfoBlock label="Email" value={claim.user?.email} />
                                    <InfoBlock label="No. Handphone" value={claim.user?.no_hp} />
                                </div>
                            </div>

                            <div>
                                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold tracking-wider text-slate-800 uppercase">
                                    <FileText size={16} className="text-emerald-500" /> Jawaban Verifikasi
                                </h2>
                                {claim.verificationAnswers && claim.verificationAnswers.length > 0 ? (
                                    <div className="space-y-4">
                                        {claim.verificationAnswers.map((item, idx) => (
                                            <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        <span className="mr-1 text-slate-400">{idx + 1}.</span>
                                                        {item.question.question}
                                                    </p>
                                                    <span
                                                        className={`inline-flex w-max shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${item.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                                    >
                                                        {item.is_correct ? <Check size={12} /> : <X size={12} />}
                                                        {item.is_correct ? 'Sesuai' : 'Tidak Sesuai'}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-sm text-slate-700">
                                                    <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                        Jawaban Pengklaim:
                                                    </span>
                                                    {item.answer}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
                                        <AlertCircle size={16} /> Tidak ada data jawaban verifikasi.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN KEPUTUSAN */}
                    <div className="border-t border-slate-200 bg-white p-5 md:p-8">
                        <h2 className="mb-4 text-sm font-bold tracking-wider text-slate-800 uppercase">Keputusan Akhir</h2>

                        <div className="mb-5">
                            <label className="mb-2 block text-xs font-semibold text-slate-600">Catatan Petugas / Alasan Penolakan (Opsional)</label>
                            <textarea
                                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 transition-all outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                rows={3}
                                placeholder="Tulis catatan yang akan dilihat oleh pengklaim..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={claim.status !== 'pending' || processing}
                            />
                        </div>

                        {claim.status === 'pending' ? (
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    onClick={() => handleVerify('rejected')}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50 sm:w-auto"
                                >
                                    Tolak Klaim
                                </button>
                                <button
                                    onClick={() => handleVerify('approved')}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
                                >
                                    Setujui Klaim
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                                <AlertCircle size={18} className="text-slate-400" />
                                <p>
                                    Klaim ini telah diproses dan ditetapkan sebagai{' '}
                                    <strong className="text-slate-800 uppercase">{claim.status === 'approved' ? 'Disetujui' : 'Ditolak'}</strong>.
                                </p>
                            </div>
                        )}

                        {/* Upload Bukti (hanya untuk klaim approved) */}
                        {claim.status === 'approved' && (
                            <div className="mt-6 border-t border-slate-100 pt-6">
                                <h3 className="mb-3 text-sm font-bold text-slate-800">Foto Bukti Pengambilan Barang</h3>

                                {claim.proof_image_url && (
                                    <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                        <p className="mb-2 text-xs font-semibold text-slate-600">Bukti Pengambilan:</p>
                                        <img src={claim.proof_image_url} className="max-h-48 rounded border object-cover" />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="mb-2 block text-xs font-semibold text-slate-600">Upload / Ganti Foto Bukti</label>
                                    <div className="flex items-center gap-3">
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                            <Upload size={16} />
                                            Pilih Foto
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProofChange}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                        </label>
                                        {proofPreview && (
                                            <div className="relative">
                                                <img src={proofPreview} alt="Preview" className="h-12 w-12 rounded object-cover" />
                                                <button
                                                    onClick={() => {
                                                        setProofFile(null);
                                                        setProofPreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-0.5 text-white"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">Format: JPG, PNG, maks 2MB</p>
                                </div>
                                {proofFile && (
                                    <button
                                        onClick={handleUploadProof}
                                        disabled={uploading}
                                        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {uploading ? 'Mengunggah...' : 'Simpan Bukti'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </OfficerLayout>
    );
}

function InfoBlock({ label, value }: { label: string; value: string | undefined }) {
    return (
        <div>
            <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</span>
            <span className="block text-sm font-medium text-slate-800">{value || '-'}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'pending') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold tracking-wide text-amber-700 uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                Menunggu Verifikasi
            </span>
        );
    }
    if (status === 'approved') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-700 uppercase">
                <Check size={14} /> Disetujui
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold tracking-wide text-red-700 uppercase">
            <X size={14} /> Ditolak
        </span>
    );
}
