import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    id: number;
    hash: string;
    email: string;
}

export default function VerifyEmailPage({ id, hash, email }: Props) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/email/verify/${id}/${hash}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/Siswa/dashboard';
                }, 2000);
            } else {
                setError(data.message || 'Terjadi kesalahan');
            }
        } catch (err) {
            setError('Gagal memverifikasi email. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Verifikasi Email" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
                    {!success ? (
                        <>
                            <h2 className="mb-4 text-2xl font-bold">Verifikasi Email</h2>
                            <p className="mb-6 text-gray-600">
                                Klik tombol di bawah untuk memverifikasi alamat email Anda:
                                <br />
                                <strong>{email}</strong>
                            </p>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : 'Verifikasi Email'}
                            </button>
                            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                        </>
                    ) : (
                        <>
                            <div className="mb-4 text-5xl text-green-600">✓</div>
                            <h2 className="mb-2 text-2xl font-bold">Email Berhasil Diverifikasi!</h2>
                            <p className="text-gray-600">Anda akan dialihkan ke dashboard...</p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
