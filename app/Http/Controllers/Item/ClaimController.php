<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Claim;
use App\Models\ClaimVerificationAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClaimController extends Controller
{
    /**
     * Mendapatkan pertanyaan verifikasi untuk item tertentu.
     */
    public function getQuestions(Item $item)
    {
        // Pastikan item bisa diklaim (ditemukan dan belum ditutup)
        if ($item->report_type !== 'ditemukan' || $item->report_status === 'ditutup') {
            return response()->json(['message' => 'Item tidak dapat diklaim'], 403);
        }

        $questions = $item->verificationQuestions()->get(['id', 'question']);
        return response()->json($questions);
    }

    /**
     * Memproses pengajuan klaim dan memverifikasi jawaban.
     */
    public function store(Request $request, Item $item)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:item_verification_questions,id',
            'answers.*.answer' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Validasi item
        if ($item->report_type !== 'ditemukan' || $item->report_status === 'ditutup') {
            return response()->json(['message' => 'Item tidak dapat diklaim'], 403);
        }

        // Cek apakah user sudah pernah klaim
        $existingClaim = Claim::where('item_id', $item->id)->where('user_id', $user->id)->first();
        if ($existingClaim) {
            return response()->json(
                [
                    'message' => 'Anda sudah mengajukan klaim untuk barang ini',
                ],
                400,
            );
        }

        $questions = $item->verificationQuestions()->get();
        $answersData = $request->answers;

        // Verifikasi semua jawaban
        $allCorrect = true;
        foreach ($questions as $q) {
            $found = collect($answersData)->firstWhere('question_id', $q->id);
            if (!$found || !Hash::check($found['answer'], $q->answer_hash)) {
                $allCorrect = false;
                break;
            }
        }

        DB::beginTransaction();
        try {
            // Simpan klaim
            $claim = Claim::create([
                'item_id' => $item->id,
                'user_id' => $user->id,
                'description' => $request->description,
                'status' => $allCorrect ? Claim::STATUS_APPROVED : Claim::STATUS_PENDING,
            ]);

            // Simpan jawaban
            foreach ($answersData as $ans) {
                $question = $questions->find($ans['question_id']);
                $isCorrect = $question ? Hash::check($ans['answer'], $question->answer_hash) : false;
                ClaimVerificationAnswer::create([
                    'claim_id' => $claim->id,
                    'question_id' => $ans['question_id'],
                    'answer' => $ans['answer'],
                    'is_correct' => $isCorrect,
                ]);
            }

            DB::commit();

            if ($allCorrect) {
                $reporter = $item->user;
                return response()->json([
                    'success' => true,
                    'message' => 'Jawaban benar! Anda dapat menghubungi pelapor.',
                    'contact' => [
                        'name' => $reporter->name,
                        'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                        'class' => $reporter->kelas ?? '-',
                    ],
                    'officer_contact' => 'Petugas: 08123456789', // ganti dengan nomor petugas sesungguhnya
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Jawaban Anda salah. Klaim akan diproses petugas.',
                ]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan'], 500);
        }
    }
}
