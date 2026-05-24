<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\MateriController;
use App\Http\Controllers\Api\LokerController;
use App\Http\Controllers\Api\ForumController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\SertifikatController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes - SATPAM INDONESIA JAYA
|--------------------------------------------------------------------------
*/

// ============================================================
// PUBLIC ROUTES (No Auth)
// ============================================================

// Auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/login/google', [AuthController::class, 'loginGoogle']);
    Route::post('/login/whatsapp', [AuthController::class, 'loginWhatsApp']);
    Route::post('/otp/send', [AuthController::class, 'sendOTP']);
    Route::post('/otp/verify', [AuthController::class, 'verifyOTP']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Public Data
Route::get('/materi/public', [MateriController::class, 'publicList']);
Route::get('/loker/public', [LokerController::class, 'publicList']);
Route::get('/forum/posts', [ForumController::class, 'index']);

// ============================================================
// PROTECTED ROUTES (Sanctum Auth)
// ============================================================

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refreshToken']);

    // Profile
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/photo', [ProfileController::class, 'uploadPhoto']);
        Route::get('/badges', [ProfileController::class, 'badges']);
    });

    // KTA Digital
    Route::prefix('kta')->group(function () {
        Route::get('/', [SertifikatController::class, 'ktaIndex']);
        Route::post('/', [SertifikatController::class, 'ktaStore']);
        Route::put('/{id}', [SertifikatController::class, 'ktaUpdate']);
        Route::post('/{id}/photos', [SertifikatController::class, 'ktaUploadPhotos']);
    });

    // Certificates
    Route::prefix('certificates')->group(function () {
        Route::get('/', [SertifikatController::class, 'index']);
        Route::post('/', [SertifikatController::class, 'store']);
        Route::delete('/{id}', [SertifikatController::class, 'destroy']);
    });

    // Materi (LMS)
    Route::prefix('materi')->group(function () {
        Route::get('/', [MateriController::class, 'index']);
        Route::get('/{id}', [MateriController::class, 'show']);
        Route::post('/{id}/progress', [MateriController::class, 'updateProgress']);
        Route::get('/progress', [MateriController::class, 'myProgress']);
    });

    // Job Vacancies
    Route::prefix('loker')->group(function () {
        Route::get('/', [LokerController::class, 'index']);
        Route::get('/{id}', [LokerController::class, 'show']);
        Route::post('/', [LokerController::class, 'store']); // For companies
        Route::put('/{id}', [LokerController::class, 'update']);
        Route::post('/{id}/apply', [LokerController::class, 'apply']);
        Route::get('/applications', [LokerController::class, 'myApplications']);
        Route::get('/{id}/applicants', [LokerController::class, 'applicants']);
        Route::put('/applications/{id}/status', [LokerController::class, 'updateApplicationStatus']);
    });

    // Chat HRD
    Route::prefix('loker/chat')->group(function () {
        Route::get('/{applicationId}', [LokerController::class, 'chatMessages']);
        Route::post('/{applicationId}', [LokerController::class, 'sendChatMessage']);
    });

    // Forum
    Route::prefix('forum')->group(function () {
        Route::get('/categories', [ForumController::class, 'categories']);
        Route::get('/posts/{id}', [ForumController::class, 'show']);
        Route::post('/posts', [ForumController::class, 'store']);
        Route::put('/posts/{id}', [ForumController::class, 'update']);
        Route::delete('/posts/{id}', [ForumController::class, 'destroy']);
        Route::post('/posts/{id}/like', [ForumController::class, 'toggleLike']);
        Route::get('/posts/{id}/comments', [ForumController::class, 'comments']);
        Route::post('/posts/{id}/comments', [ForumController::class, 'storeComment']);
        Route::delete('/comments/{id}', [ForumController::class, 'destroyComment']);
    });

    // AI Assistant
    Route::prefix('ai')->group(function () {
        Route::get('/sessions', [AIController::class, 'sessions']);
        Route::post('/sessions', [AIController::class, 'createSession']);
        Route::delete('/sessions/{id}', [AIController::class, 'deleteSession']);
        Route::get('/sessions/{id}/messages', [AIController::class, 'messages']);
        Route::post('/chat', [AIController::class, 'chat']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    // Verification
    Route::prefix('verification')->group(function () {
        Route::post('/request', [ProfileController::class, 'requestVerification']);
        Route::get('/status', [ProfileController::class, 'verificationStatus']);
    });
});

// ============================================================
// ADMIN ROUTES (Admin Middleware)
// ============================================================

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    Route::put('/users/{id}/verify', [AdminController::class, 'verifyUser']);
    Route::get('/verifications', [AdminController::class, 'verifications']);
    Route::post('/verifications/{id}/approve', [AdminController::class, 'approveVerification']);
    Route::post('/verifications/{id}/reject', [AdminController::class, 'rejectVerification']);
    Route::get('/kta/pending', [AdminController::class, 'pendingKTA']);
    Route::post('/kta/{id}/verify', [AdminController::class, 'verifyKTA']);
    Route::get('/loker/pending', [AdminController::class, 'pendingLoker']);
    Route::post('/loker/{id}/verify', [AdminController::class, 'verifyLoker']);
    Route::get('/statistics', [AdminController::class, 'statistics']);
    Route::get('/reports', [AdminController::class, 'reports']);
});
