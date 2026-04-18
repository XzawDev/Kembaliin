<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Claim;
use App\Models\ClaimVerificationAnswer;
use App\Models\User; // ← Tambahkan ini
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ClaimController extends Controller
{
    /**
     * Tampilkan halaman klaim atau redirect sesuai status
     */
    public function create(Item $item)
    {
        // 1. Cek apakah ada klaim yang sudah disetujui (status APPROVED)
        $approvedClaim = Claim::where('item_id', $item->id)->where('status', Claim::STATUS_APPROVED)->first();

        if ($approvedClaim) {
            // Jika user yang login adalah pemilik klaim tersebut, arahkan ke sukses
            if ($approvedClaim->user_id === Auth::id()) {
                $reporter = $item->user;
                return redirect()
                    ->route('claim.success', $item)
                    ->with('message', 'Anda sudah berhasil mengklaim barang ini.')
                    ->with('contact', [
                        'name' => $reporter->name,
                        'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                        'class' => $reporter->kelas ?? '-',
                    ])
                    ->with('officer_contact', 'Petugas: 08123456789'); // fallback, tidak masalah karena kasus ini jarang
            }

            // User lain mencoba mengklaim barang yang sudah diklaim
            return redirect()->route('claim.already', $item)->with('message', 'Barang ini sudah diklaim oleh pengguna lain. Jika Anda merasa barang ini milik Anda, silakan hubungi petugas.');
        }

        // 2. Validasi item dapat diklaim
        if ($item->report_type->value !== 'ditemukan' || $item->report_status->value === 'ditutup') {
            abort(403, 'Item tidak dapat diklaim.');
        }

        // 3. Pemilik barang tidak bisa mengklaim sendiri
        if ($item->user_id === Auth::id()) {
            abort(403, 'Anda tidak dapat mengklaim barang sendiri.');
        }

        // 4. Cek apakah user sudah memiliki klaim (pending/rejected)
        $existingClaim = Claim::where('item_id', $item->id)->where('user_id', Auth::id())->first();

        if ($existingClaim) {
            switch ($existingClaim->status) {
                case Claim::STATUS_APPROVED:
                    $reporter = $item->user;
                    return redirect()
                        ->route('claim.success', $item)
                        ->with('message', 'Anda sudah berhasil mengklaim barang ini.')
                        ->with('contact', [
                            'name' => $reporter->name,
                            'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                            'class' => $reporter->kelas ?? '-',
                        ])
                        ->with('officer_contact', 'Petugas: 08123456789');
                case Claim::STATUS_PENDING:
                    return redirect()->route('claim.pending', $item)->with('message', 'Klaim Anda sedang menunggu verifikasi petugas.');
                case Claim::STATUS_REJECTED:
                    return redirect()->route('claim.failed', $item)->with('message', 'Klaim Anda ditolak. Silakan hubungi petugas.');
                default:
                    return redirect()->route('claim.failed', $item)->with('message', 'Status klaim tidak diketahui. Silakan hubungi petugas.');
            }
        }

        // 5. Tampilkan form klaim dengan pertanyaan
        $questions = $item->verificationQuestions()->get(['id', 'question']);
        return Inertia::render('Items/Claim', [
            'item' => $item,
            'questions' => $questions,
        ]);
    }

    /**
     * Memproses pengajuan klaim
     */
    public function storeClaim(Request $request, Item $item)
    {
        // 1. Cek apakah sudah ada klaim approved dari user lain
        $approvedClaim = Claim::where('item_id', $item->id)->where('status', Claim::STATUS_APPROVED)->first();
        if ($approvedClaim && $approvedClaim->user_id !== Auth::id()) {
            return redirect()->route('claim.already', $item)->with('message', 'Barang ini sudah diklaim oleh pengguna lain. Silakan hubungi petugas untuk bantuan lebih lanjut.');
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:item_verification_questions,id',
            'answers.*.answer' => 'required|string',
        ]);

        $user = Auth::user();

        if ($item->report_type->value !== 'ditemukan' || $item->report_status->value === 'ditutup') {
            return redirect()->route('claim.failed', $item)->with('message', 'Item tidak dapat diklaim.');
        }

        // Cek apakah user sudah pernah klaim (pending/rejected) untuk item ini
        $existingClaim = Claim::where('item_id', $item->id)->where('user_id', $user->id)->first();
        if ($existingClaim) {
            return redirect()->route('claim.failed', $item)->with('message', 'Anda sudah mengajukan klaim untuk barang ini.');
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

            // Jika klaim berhasil, ubah handling_status item menjadi 'diklaim'
            if ($allCorrect) {
                $item->handling_status = 'diklaim';
                $item->save();
            }

            DB::commit();

            if ($allCorrect) {
                $reporter = $item->user;

                // Ambil data petugas langsung dari database berdasarkan verified_by yang sudah ada di item
                $officer = null;
                if ($item->verified_by) {
                    $officer = User::find($item->verified_by);
                }

                if ($officer) {
                    $officer_contact = [
                        'name' => $officer->name,
                        'phone' => $officer->no_hp ?? 'Tidak tersedia',
                        'wa_link' => 'https://wa.me/' . ltrim($officer->no_hp, '0'),
                    ];
                } else {
                    $officer_contact = [
                        'name' => 'Petugas',
                        'phone' => 'Hubungi kantor sekolah',
                        'wa_link' => '#',
                    ];
                }

                return redirect()
                    ->route('claim.success', $item)
                    ->with('message', 'Jawaban benar! Anda dapat menghubungi pelapor.')
                    ->with('contact', [
                        'name' => $reporter->name,
                        'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                        'class' => $reporter->kelas ?? '-',
                    ])
                    ->with('officer_contact', $officer_contact);
            } else {
                return redirect()->route('claim.pending', $item)->with('message', 'Klaim Anda sedang menunggu verifikasi petugas.');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Claim store error: ' . $e->getMessage());
            return redirect()->route('claim.error', $item)->with('message', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        }
    }

    /**
     * Halaman sudah diklaim (untuk user lain)
     */
    public function already(Item $item)
    {
        return Inertia::render('Items/AlreadyClaimed', [
            'item' => $item,
            'message' => session('message', 'Barang ini sudah diklaim oleh pengguna lain. Silakan hubungi petugas.'),
            'officer_contact' => session('officer_contact', 'Petugas: 08123456789'),
        ]);
    }

    /**
     * Halaman sukses klaim
     */
    public function success(Item $item)
    {
        $user = Auth::user();
        $claim = Claim::where('item_id', $item->id)->where('user_id', $user->id)->where('status', Claim::STATUS_APPROVED)->first();

        if ($claim) {
            // Ambil pelapor hanya dengan kolom yang diperlukan
            $reporter = $item->user()->first(['id', 'name', 'no_hp', 'kelas']);
            $contact = [
                'name' => $reporter->name,
                'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                'class' => $reporter->kelas ?? '-',
            ];

            // Ambil petugas hanya dengan kolom yang diperlukan
            $officer = $item->verifiedBy()->first(['id', 'name', 'no_hp']);
            if ($officer) {
                $officer_contact = [
                    'name' => $officer->name,
                    'phone' => $officer->no_hp ?? 'Tidak tersedia',
                    'wa_link' => 'https://wa.me/' . ltrim($officer->no_hp, '0'),
                ];
            } else {
                $officer_contact = [
                    'name' => 'Petugas',
                    'phone' => 'Hubungi kantor sekolah',
                    'wa_link' => '#',
                ];
            }

            $message = session('message', 'Anda sudah berhasil mengklaim barang ini.');
        } else {
            $contact = null;
            $officer_contact = null;
            $message = session('message', 'Klaim berhasil');
        }

        return Inertia::render('Items/SuksesKlaim', [
            'item' => $item,
            'message' => $message,
            'contact' => $contact,
            'officer_contact' => $officer_contact,
        ]);
    }

    /**
     * API endpoint untuk mengambil data klaim yang disetujui (digunakan saat refresh halaman)
     */
    public function getClaimData(Item $item)
    {
        $user = Auth::user();
        $claim = Claim::where('item_id', $item->id)->where('user_id', $user->id)->where('status', Claim::STATUS_APPROVED)->first();

        if (!$claim) {
            return response()->json(['error' => 'No approved claim found'], 404);
        }

        $reporter = $item->user()->first(['id', 'name', 'no_hp', 'kelas']);
        $officer = $item->verifiedBy()->first(['id', 'name', 'no_hp']);

        if ($officer) {
            $officer_contact = [
                'name' => $officer->name,
                'phone' => $officer->no_hp ?? 'Tidak tersedia',
                'wa_link' => 'https://wa.me/' . ltrim($officer->no_hp, '0'),
            ];
        } else {
            $officer_contact = [
                'name' => 'Petugas',
                'phone' => 'Hubungi kantor sekolah',
                'wa_link' => '#',
            ];
        }

        return response()->json([
            'message' => 'Anda sudah berhasil mengklaim barang ini.',
            'contact' => [
                'name' => $reporter->name,
                'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                'class' => $reporter->kelas ?? '-',
            ],
            'officer_contact' => $officer_contact,
        ]);
    }

    /**
     * Halaman gagal klaim
     */
    public function failed(Item $item)
    {
        return Inertia::render('Items/GagalKlaim', [
            'item' => $item,
            'message' => session('message', 'Klaim gagal. Silakan coba lagi.'),
        ]);
    }

    /**
     * Halaman error klaim
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

            if ($allCorrect) {
                $item->handling_status = 'diklaim';
                $item->save();
            }

            DB::commit();

            if ($allCorrect) {
                $reporter = $item->user;
                // Untuk API, kita tetap kirim array officer_contact yang benar
                $officer = null;
                if ($item->verified_by) {
                    $officer = User::find($item->verified_by);
                }
                if ($officer) {
                    $officer_contact = [
                        'name' => $officer->name,
                        'phone' => $officer->no_hp ?? 'Tidak tersedia',
                        'wa_link' => 'https://wa.me/' . ltrim($officer->no_hp, '0'),
                    ];
                } else {
                    $officer_contact = 'Petugas: 08123456789'; // fallback
                }
                return response()->json([
                    'success' => true,
                    'message' => 'Jawaban benar! Anda dapat menghubungi pelapor.',
                    'contact' => [
                        'name' => $reporter->name,
                        'phone' => $reporter->no_hp ?? 'Tidak tersedia',
                        'class' => $reporter->kelas ?? '-',
                    ],
                    'officer_contact' => $officer_contact,
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

    public function index()
    {
        $user = Auth::user();
        $claims = Claim::with([
            'item' => function ($query) {
                $query->select('id', 'slug', 'name', 'handling_status', 'report_status', 'user_id');
            },
            'item.images',
        ]) // muat relasi images
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Tambahkan image_url dari gambar pertama
        $claims->getCollection()->transform(function ($claim) {
            if ($claim->item && $claim->item->images->isNotEmpty()) {
                $claim->item->image_url = asset('storage/' . $claim->item->images->first()->image_path);
            } else {
                $claim->item->image_url = null;
            }
            return $claim;
        });

        return Inertia::render('Siswa/PengajuanBarang', [
            'claims' => $claims,
        ]);
    }

    public function pending(Item $item)
    {
        $user = Auth::user();
        $claim = Claim::where('item_id', $item->id)->where('user_id', $user->id)->where('status', Claim::STATUS_PENDING)->first();

        if (!$claim) {
            return redirect()->route('items.show', $item->slug)->with('error', 'Tidak ada klaim pending untuk barang ini.');
        }

        return Inertia::render('Items/ClaimPending', [
            'item' => $item,
            'claim' => $claim,
        ]);
    }

    public function pendingClaims()
    {
        $claims = Claim::with(['item', 'user'])
            ->where('status', Claim::STATUS_PENDING)
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return Inertia::render('Officer/PendingClaims', ['claims' => $claims]);
    }

    public function allClaims(Request $request)
    {
        $query = Claim::with(['item', 'user']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $claims = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Officer/AllClaims', [
            'claims' => $claims,
            'currentStatus' => $request->get('status', 'all'),
        ]);
    }

    public function showClaimDetail(Claim $claim)
    {
        $claim->load([
            'item' => function ($q) {
                $q->with(['user', 'category', 'images']);
            },
            'user',
            'verificationAnswers.question',
        ]);

        // Transformasi gambar
        if ($claim->item->images->isNotEmpty()) {
            $claim->item->images->transform(function ($img) {
                $img->url = asset('storage/' . $img->image_path);
                return $img;
            });
        }

        return Inertia::render('Officer/ClaimDetail', [
            'claim' => $claim,
        ]);
    }

    public function verifyManual(Request $request, Claim $claim)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string',
            'proof_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $claim->status = $request->status;
        $claim->admin_notes = $request->admin_notes;
        $claim->verified_by = Auth::id();

        // Upload foto bukti jika ada
        if ($request->hasFile('proof_image')) {
            // Hapus file lama jika ada
            if ($claim->proof_image) {
                Storage::disk('public')->delete($claim->proof_image);
            }
            $path = $request->file('proof_image')->store('claim-proofs', 'public');
            $claim->proof_image = $path;
        }

        $claim->save();

        if ($request->status === 'approved') {
            $item = $claim->item;
            $item->handling_status = 'diklaim';
            $item->save();
        }

        return back()->with('success', 'Klaim berhasil diverifikasi.');
    }

    public function uploadProof(Request $request, Claim $claim)
{
    $request->validate([
        'proof_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    // Hanya petugas yang bisa upload, dan claim harus sudah approved
    if ($claim->status !== 'approved') {
        return back()->with('error', 'Hanya klaim yang sudah disetujui yang dapat diunggah bukti.');
    }

    // Hapus file lama jika ada
    if ($claim->proof_image) {
        Storage::disk('public')->delete($claim->proof_image);
    }

    $path = $request->file('proof_image')->store('claim-proofs', 'public');
    $claim->proof_image = $path;
    $claim->save();

    return back()->with('success', 'Foto bukti berhasil diunggah.');
}
}
