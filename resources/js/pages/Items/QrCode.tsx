import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Props {
    item: {
        id: number;
        name: string;
        qr_code: string;
    };
    qrCodeDataUri: string;   // new prop
}

export default function QrCode({ item, qrCodeDataUri }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="QR Code Penyerahan" />
            <div className="max-w-2xl mx-auto py-10 px-4">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">QR Code Penyerahan Barang</h1>
                    <p className="text-slate-600 mb-6">
                        Tunjukkan QR code ini kepada petugas saat menyerahkan{' '}
                        <span className="font-bold">{item.name}</span>.
                    </p>
                    <div className="flex justify-center mb-6">
                        <img 
                            src={qrCodeDataUri} 
                            alt="QR Code" 
                            className="w-64 h-64 border border-slate-200 rounded-2xl" 
                        />
                    </div>
                    <p className="text-sm text-slate-500 mb-8">
                        Atau gunakan token:{' '}
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded">{item.qr_code}</span>
                    </p>
                    <Link
                        href="/Siswa/dashboard"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}