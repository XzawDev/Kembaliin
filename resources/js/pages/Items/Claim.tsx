// resources/js/pages/Items/Claim.tsx
import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import { ShieldCheck, HelpCircle, ArrowRight, Loader2, Package } from 'lucide-react';

interface Question {
    id: number;
    question: string;
}

interface Item {
    id: number;
    slug: string;
    name: string;
}

export default function Claim({ item, questions }: { item: Item; questions: Question[] }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleAnswerChange = (questionId: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const allAnswered = questions.every((q) => answers[q.id]?.trim());
        if (!allAnswered) {
            alert('Harap jawab semua pertanyaan.');
            return;
        }

        const answersArray = Object.entries(answers).map(([qId, ans]) => ({
            question_id: parseInt(qId),
            answer: ans,
        }));

        setProcessing(true);
        router.post(
            `/claim/${item.slug}`,
            {
                answers: answersArray,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title={`Klaim Barang: ${item.name}`} />
            <Navbar />

            {/* Content Area - pt-24 to clear the fixed navbar */}
            <div className="mx-auto max-w-xl px-4 pt-24 pb-12 md:pt-32">
                {/* Progress/Header Section */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-100">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Verifikasi Kepemilikan</h1>
                    <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-500">
                        Untuk keamanan, harap jawab pertanyaan verifikasi untuk barang <span className="text-slate-900">"{item.name}"</span>.
                    </p>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
                    <div className="border-b border-slate-50 bg-slate-50/50 px-6 py-4 md:px-8">
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            <HelpCircle size={14} className="text-teal-500" />
                            Pertanyaan Keamanan
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 md:p-8">
                        <div className="space-y-6">
                            {questions.map((q, index) => (
                                <div
                                    key={q.id}
                                    className="group animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        <span className="mr-1 text-teal-600">{index + 1}.</span> {q.question}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ketik jawaban Anda di sini..."
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-4 text-sm font-black text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Ajukan Klaim Sekarang
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>

                            <Link
                                href={`/items/${item.slug}`}
                                className="block w-full py-2 text-center text-xs font-bold text-slate-400 transition-colors hover:text-slate-600"
                            >
                                Batalkan dan Kembali
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Secure Note */}
                {/* <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-100/50 bg-amber-50 p-4">
                    <div className="mt-0.5 text-amber-600">
                        <Package size={16} />
                    </div>
                    <p className="text-xs leading-relaxed text-amber-800">
                        <strong>Catatan:</strong> Jawaban Anda akan ditinjau oleh penemu barang atau petugas sekolah. Jika disetujui, Anda akan
                        mendapatkan informasi kontak untuk pengambilan barang.
                    </p>
                </div> */}
            </div>
        </div>
    );
}
