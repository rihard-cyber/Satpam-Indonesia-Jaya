<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'email',
        'phone',
        'password_hash',
        'nama_lengkap',
        'nama_panggilan',
        'foto_profil_url',
        'tingkatan_id',
        'role',
        'is_verified',
        'is_active',
        'email_verified_at',
        'phone_verified_at',
        'google_id',
        'last_login_at',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
    ];

    // Relationships
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function tingkatan()
    {
        return $this->belongsTo(Tingkatan::class);
    }

    public function kta()
    {
        return $this->hasMany(KTADocument::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function badges()
    {
        return $this->hasMany(UserBadge::class);
    }

    public function materiProgress()
    {
        return $this->hasMany(MateriProgress::class);
    }

    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function forumPosts()
    {
        return $this->hasMany(ForumPost::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function aiSessions()
    {
        return $this->hasMany(AIChatSession::class);
    }

    // Accessors
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByTingkatan($query, $tingkatanId)
    {
        return $query->where('tingkatan_id', $tingkatanId);
    }
}
