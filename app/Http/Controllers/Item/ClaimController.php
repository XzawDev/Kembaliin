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
use Inertia\Inertia;

class ClaimController extends Controller
{
    /**
     * Tampilkan halaman klaim dengan pertanyaan-pertanyaan
     * Jika user sudah pernah klaim, langsung redirect ke halaman hasil
     */
    public function create(Item $item)
    {
        // Pastikan item bisa diklaim
        if ($item->report_type->value !== 'ditemukan' || $item->report_status->value === 'ditutup') {
            abort(403, 'Item tidak dapat diklaim.');
        }

        // Pastikan bukan pemilik item
        if ($item->user_id === Auth::id()) {
            abort(403, 'Anda tidak dapat mengklaim barang sendiri.');
        }

        // Cek apakah user sudah pernah mengajukan klaim untuk item ini
        $existingClaim = Claim::where('item_id', $item->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingClaim) {
            // Redirect ke halaman hasil berdasarkan status klaim
            switch ($existingClaim->status) {
                case Claim::STATUS_APPROVED:
                    $reporter = $item->user;
                    return redirect()->route('claim.success', $item->id)
                        ->with('message', 'Anda sudah berhasil mengklaim barang ini.')
                        ->with('contact', [
                            'name' => $reporter->name,
                            'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                            'class' => $reporter->kelas ?? '-',
                        ])
                        ->with('officer_contact', 'Petugas: 08123456789');
                case Claim::STATUS_PENDING:
                    return redirect()->route('claim.failed', $item->id)
                        ->with('message', 'Anda sudah mengajukan klaim. Klaim sedang diproses petugas.');
                case Claim::STATUS_REJECTED:
                    return redirect()->route('claim.failed', $item->id)
                        ->with('message', 'Klaim Anda ditolak. Silakan hubungi petugas.');
                default:
                    return redirect()->route('claim.failed', $item->id)
                        ->with('message', 'Status klaim tidak diketahui. Silakan hubungi petugas.');
            }
        }

        // Jika belum pernah klaim, tampilkan form
        $questions = $item->verificationQuestions()->get(['id', 'question']);
        return Inertia::render('Items/Claim', [
            'item' => $item,
            'questions' => $questions,
        ]);
    }

    /**
     * Memproses pengajuan klaim dari halaman web
     */
    public function storeClaim(Request $request, Item $item)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:item_verification_questions,id',
            'answers.*.answer' => 'required|string',
        ]);

        $user = Auth::user();

        // Validasi item
        if ($item->report_type->value !== 'ditemukan' || $item->report_status->value === 'ditutup') {
            return redirect()->route('claim.failed', $item->id)
                ->with('message', 'Item tidak dapat diklaim.');
        }

        // Cek apakah sudah pernah klaim
        $existingClaim = Claim::where('item_id', $item->id)->where('user_id', $user->id)->first();
        if ($existingClaim) {
            return redirect()->route('claim.failed', $item->id)
                ->with('message', 'Anda sudah mengajukan klaim untuk barang ini.');
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
            $claim = Claim::create([
                'item_id' => $item->id,
                'user_id' => $user->id,
                'status' => $allCorrect ? Claim::STATUS_APPROVED : Claim::STATUS_PENDING,
            ]);

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
                return redirect()->route('claim.success', $item->id)
                    ->with('message', 'Jawaban benar! Anda dapat menghubungi pelapor.')
                    ->with('contact', [
                        'name' => $reporter->name,
                        'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                        'class' => $reporter->kelas ?? '-',
                    ])
                    ->with('officer_contact', 'Petugas: 08123456789');
            } else {
                return redirect()->route('claim.failed', $item->id)
                    ->with('message', 'Jawaban Anda salah. Klaim akan diproses petugas.');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Claim store error: ' . $e->getMessage());
            return redirect()->route('claim.error', $item->id)
                ->with('message', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        }
    }

    /**
     * Tampilkan halaman sukses klaim
     */
    public function success(Item $item)
    {
        return Inertia::render('Items/SuksesKlaim', [
            'item' => $item,
            'message' => session('message', 'Klaim berhasil'),
            'contact' => session('contact'),
            'officer_contact' => session('officer_contact', 'Hubungi petugas'),
        ]);
    }

    /**
     * Tampilkan halaman gagal klaim
     */
    public function failed(Item $item)
    {
        return Inertia::render('Items/GagalKlaim', [
            'item' => $item,
            'message' => session('message', 'Klaim gagal. Silakan coba lagi.'),
        ]);
    }

    /**
     * Tampilkan halaman error klaim
     */
    public function error(Item $item)
    {
        return Inertia::render('Items/ErrorKlaim', [
            'item' => $item,
            'message' => session('message', 'Terjadi kesalahan sistem.'),
        ]);
    }

    /**
     * API endpoint untuk modal klaim (JSON response)
     */
    public function getQuestions(Item $item)
    {
        if ($item->report_type->value !== 'ditemukan' || $item->report_status->value === 'ditutup') {
            return response()->json(['message' => 'Item tidak dapat diklaim'], 403);
        }

        $questions = $item->verificationQuestions()->get(['id', 'question']);
        return response()->json($questions);
    }

    /**
     * API endpoint untuk submit klaim dari modal
     */
    public function store(Request $request, Item $item)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:item_verification_questions,id',
            'answers.*.answer' => 'required|string',
        ]);

        $user = Auth::user();

        if ($item->report_type->value !== 'ditemukan' || $item->report_status->value === 'ditutup') {
            return response()->json(['message' => 'Item tidak dapat diklaim'], 403);
        }

        $existingClaim = Claim::where('item_id', $item->id)->where('user_id', $user->id)->first();
        if ($existingClaim) {
            return response()->json(['message' => 'Anda sudah mengajukan klaim untuk barang ini'], 400);
        }

        $questions = $item->verificationQuestions()->get();
        $answersData = $request->answers;

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
            $claim = Claim::create([
                'item_id' => $item->id,
                'user_id' => $user->id,
                'status' => $allCorrect ? Claim::STATUS_APPROVED : Claim::STATUS_PENDING,
            ]);

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
                    'officer_contact' => 'Petugas: 08123456789',
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