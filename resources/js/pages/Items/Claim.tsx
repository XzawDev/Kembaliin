// resources/js/pages/Items/Claim.tsx
import React from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';

interface Question {
    id: number;
    question: string;
}

interface Item {
    id: number;
    name: string;
}

export default function Claim({ item, questions }: { item: Item; questions: Question[] }) {
    const [answers, setAnswers] = React.useState<Record<number, string>>({});
    // const [description, setDescription] = React.useState('');
    const [processing, setProcessing] = React.useState(false);

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
        router.post(`/claim/${item.id}`, {
            answers: answersArray,
            // description: description,
        });
    };

    return (
        <>
            <Head title={`Klaim Barang: ${item.name}`} />
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-12">
                <div className="mx-auto max-w-2xl px-4">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h1 className="text-2xl font-bold">Klaim Barang: {item.name}</h1>
                        <p className="mt-2 text-sm text-slate-600">Jawab pertanyaan berikut untuk membuktikan bahwa barang ini milik Anda.</p>
                        <form onSubmit={submit} className="mt-6 space-y-4">
                            {questions.map((q) => (
                                <div key={q.id}>
                                    <label className="block text-sm font-medium text-slate-700">{q.question}</label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                            {/* <div>
                                <label className="block text-sm font-medium text-slate-700">Deskripsi tambahan (opsional)</label>
                                <textarea
                                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div> */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Ajukan Klaim'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
