import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Props {
    item: {
        id: number;
        name: string;
        qr_code: string;
    };
    qrCodeDataUri: string; // new prop
}

export default function QrCode({ item, qrCodeDataUri }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="QR Code Penyerahan" />
            <div className="mx-auto max-w-2xl px-4 py-10">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="mb-4 text-2xl font-bold text-slate-900">QR Code Penyerahan Barang</h1>
                    <p className="mb-6 text-slate-600">
                        Tunjukkan QR code ini kepada petugas saat menyerahkan <span className="font-bold">{item.name}</span>.
                    </p>
                    <div className="mb-6 flex justify-center">
                        <img src={qrCodeDataUri} alt="QR Code" className="h-64 w-64 rounded-2xl border border-slate-200" />
                    </div>
                    <p className="mb-8 text-sm text-slate-500">
                        Atau gunakan token: <span className="rounded bg-slate-100 px-2 py-1 font-mono">{item.qr_code}</span>
                    </p>
                    <Link href="/Siswa/dashboard" className="inline-block rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
