<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Claim;
use App\Models\ItemVerificationQuestion;
use App\Models\ClaimVerificationAnswer;
use App\Enums\ItemStatus;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClaimController extends Controller
{
    /**
     * Mengajukan klaim barang
     */
    public function store(Request $request, $itemId)
    {
        $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:item_verification_questions,id',
            'answers.*.answer' => 'required|string',
        ]);

        $item = Item::with('verificationQuestions')->findOrFail($itemId);

        // Tidak boleh claim jika sudah dikembalikan
        if ($item->status === ItemStatus::SUDAH_DIKEMBALIKAN) {
            return response()->json(
                [
                    'message' => 'Barang sudah dikembalikan',
                ],
                400,
            );
        }

        try {
            DB::beginTransaction();

            // 1️ Buat claim
            $claim = Claim::create([
                'item_id' => $item->id,
                'user_id' => auth()->id(),
                'status' => 'PENDING',
            ]);

            $correctCount = 0;

            // 2️ Cek setiap jawaban
            foreach ($request->answers as $a) {
                $question = ItemVerificationQuestion::find($a['question_id']);

                $isCorrect = Hash::check($a['answer'], $question->answer_hash);

                if ($isCorrect) {
                    $correctCount++;
                }

                ClaimVerificationAnswer::create([
                    'claim_id' => $claim->id,
                    'question_id' => $question->id,
                    'answer' => $a['answer'],
                    'is_correct' => $isCorrect,
                ]);
            }

            // 3️ Rule kelulusan
            $totalQuestions = $item->verificationQuestions->count();

            // contoh rule: harus semua benar
            if ($correctCount === $totalQuestions) {
                $claim->status = 'APPROVED';
                $claim->save();

                $item->status = ItemStatus::DIKLAIM;
                $item->save();
            } else {
                $claim->status = 'REJECTED';
                $claim->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Klaim diproses',
                'correct_answers' => $correctCount,
                'total_questions' => $totalQuestions,
                'claim_status' => $claim->status,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(
                [
                    'message' => 'Gagal melakukan klaim',
                    'error' => $e->getMessage(),
                ],
                500,
            );
        }
    }
}
