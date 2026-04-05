import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function VerifyEmail() {
    const { auth } = usePage().props as any;
    const [sending, setSending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    // Cek apakah email sudah terverifikasi
    const isVerified = auth.user?.email_verified_at !== null;

    // Load cooldown dari localStorage jika ada
    useEffect(() => {
        const lastSent = localStorage.getItem('last_verification_email_sent');
        if (lastSent) {
            const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
            if (elapsed < 60) {
                setCooldown(60 - elapsed);
                setCanResend(false);
            } else {
                localStorage.removeItem('last_verification_email_sent');
                setCanResend(true);
            }
        }
    }, []);

    // Timer cooldown
    useEffect(() => {
        let timer: number;
        if (cooldown > 0) {
            timer = setTimeout(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        localStorage.removeItem('last_verification_email_sent');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const resend = () => {
        if (sending || !canResend) return;

        setSending(true);
        router.post(
            '/email/verification-notification',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Set cooldown
                    const now = Date.now();
                    localStorage.setItem('last_verification_email_sent', now.toString());
                    setCooldown(60);
                    setCanResend(false);
                    setSending(false);
                },
                onError: () => {
                    setSending(false);
                },
                onFinish: () => {
                    // Already handled
                },
            },
        );
    };

    return (
        <>
            <Head title="Verifikasi Email" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
                    <h2 className="mb-4 text-2xl font-bold">Verifikasi Email Anda</h2>

                    {isVerified ? (
                        <div className="mb-4 rounded-md bg-green-100 p-3 text-green-700">
                            Email Anda sudah terverifikasi. Anda dapat mengakses dashboard.
                            <div className="mt-2">
                                <button
                                    onClick={() => router.visit('/Siswa/dashboard')}
                                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                >
                                    Ke Dashboard
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="mb-4 text-gray-600">
                                Kami telah mengirimkan link verifikasi ke email <strong>{auth.user?.email}</strong>. Silakan cek inbox atau folder
                                spam.
                            </p>
                            <button
                                onClick={resend}
                                disabled={sending || !canResend}
                                className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {sending ? 'Mengirim...' : !canResend ? `Kirim Ulang (${cooldown}s)` : 'Kirim Ulang Email Verifikasi'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
