<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use App\Models\OTPCode;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * Register new user
     * 
     * @bodyParam nama_lengkap string required Nama lengkap user
     * @bodyParam email string required Email aktif
     * @bodyParam phone string required Nomor WhatsApp
     * @bodyParam password string required Password (min 8 chars)
     * @bodyParam password_confirmation string required Konfirmasi password
     * @bodyParam tingkatan_id string ID tingkatan (gada_pratama/madya/utama)
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'nama_panggilan' => $request->nama_panggilan,
            'email' => $request->email,
            'phone' => $request->phone,
            'tingkatan_id' => $request->tingkatan_id,
            'password_hash' => Hash::make($request->password),
        ]);

        // Create profile
        $user->profile()->create([]);

        // Send OTP
        $this->sendOTP($user, 'email');
        $this->sendOTP($user, 'whatsapp');

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan verifikasi OTP.',
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    /**
     * Login with email & password
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun Anda telah dinonaktifkan.'
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;
        $user->update(['last_login_at' => now()]);

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => new UserResource($user->load(['profile', 'tingkatan', 'badges.badge'])),
            'token' => $token,
        ]);
    }

    /**
     * Login with Google OAuth
     */
    public function loginGoogle(Request $request)
    {
        $request->validate(['google_token' => 'required|string']);

        // Verify Google token with Google API
        // $googleUser = Google::verify($request->google_token);

        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'nama_lengkap' => $request->name,
                'google_id' => $request->google_id,
                'password_hash' => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
                'is_verified' => true,
            ]
        );

        if (!$user->google_id) {
            $user->update(['google_id' => $request->google_id]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login Google berhasil.',
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Login with WhatsApp OTP
     */
    public function loginWhatsApp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp_code' => 'required|string|size:6',
        ]);

        $otp = OTPCode::where('phone', $request->phone)
            ->where('otp_code', $request->otp_code)
            ->where('type', 'whatsapp')
            ->where('purpose', 'login')
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Kode OTP tidak valid atau kadaluarsa.'], 400);
        }

        $otp->update(['is_used' => true]);

        $user = User::where('phone', $request->phone)->first();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Send OTP to email or WhatsApp
     */
    public function sendOTP(Request $request)
    {
        $request->validate([
            'email' => 'required_without:phone|email',
            'phone' => 'required_without:email|string',
            'type' => 'required|in:email,whatsapp',
            'purpose' => 'required|in:register,login,forgot_password',
        ]);

        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OTPCode::create([
            'user_id' => optional(User::where('email', $request->email)->first())->id,
            'email' => $request->email,
            'phone' => $request->phone,
            'otp_code' => $otpCode,
            'type' => $request->type,
            'purpose' => $request->purpose,
            'expires_at' => now()->addMinutes(5),
        ]);

        // TODO: Send email via Mail::to()
        // TODO: Send WhatsApp via external API

        return response()->json([
            'message' => 'Kode OTP telah dikirim.',
            'debug_otp' => app()->environment('local') ? $otpCode : null,
        ]);
    }

    /**
     * Verify OTP code
     */
    public function verifyOTP(Request $request)
    {
        $request->validate([
            'email' => 'required_without:phone|email',
            'phone' => 'required_without:email|string',
            'otp_code' => 'required|string|size:6',
            'type' => 'required|in:email,whatsapp',
        ]);

        $otp = OTPCode::where(function ($q) use ($request) {
            if ($request->email) $q->where('email', $request->email);
            if ($request->phone) $q->where('phone', $request->phone);
        })
            ->where('otp_code', $request->otp_code)
            ->where('type', $request->type)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Kode OTP tidak valid.'], 400);
        }

        $otp->update(['is_used' => true]);

        if ($request->email) {
            $user = User::where('email', $request->email)->first();
            if ($user) {
                $user->update([
                    'email_verified_at' => now(),
                    'is_verified' => true,
                ]);
            }
        }

        return response()->json(['message' => 'Verifikasi berhasil.']);
    }

    /**
     * Logout & revoke token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => new UserResource($request->user()->load([
                'profile', 'tingkatan', 'kta', 'badges.badge',
                'certificates', 'materiProgress'
            ])),
        ]);
    }
}
