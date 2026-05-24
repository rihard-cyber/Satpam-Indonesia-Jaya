# API Documentation - SATPAM INDONESIA JAYA

## Base URL
```
http://localhost:8000/api
```

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "nama_lengkap": "Budi Santoso",
  "nama_panggilan": "Budi",
  "email": "budi@email.com",
  "phone": "08123456789",
  "tingkatan_id": "uuid-gada-pratama",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "budi@email.com",
  "password": "password123"
}
```

### Login Google
```http
POST /auth/login/google
Content-Type: application/json

{
  "google_token": "google-oauth-token",
  "email": "budi@gmail.com",
  "name": "Budi Santoso",
  "google_id": "123456789"
}
```

### Send OTP
```http
POST /auth/otp/send
Content-Type: application/json

{
  "email": "budi@email.com",
  "type": "email",
  "purpose": "register"
}
```

### Verify OTP
```http
POST /auth/otp/verify
Content-Type: application/json

{
  "email": "budi@email.com",
  "otp_code": "123456",
  "type": "email"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

---

## Profile

### Get Profile
```http
GET /profile
Authorization: Bearer {token}
```

### Update Profile
```http
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1995-08-15",
  "tinggi_cm": 170,
  "berat_kg": 65,
  "domisili": "Jakarta Timur",
  "provinsi": "DKI Jakarta",
  "pengalaman_kerja": "Security Officer di PT Secure Properti",
  "keahlian": ["Turjawali", "Bela Diri", "First Aid"],
  "nomor_sim": "SIM A & C",
  "bersedia_shift": true,
  "tentang_saya": "Satpam profesional..."
}
```

### Upload Photo
```http
POST /profile/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (image)
```

---

## KTA Digital

### Get My KTA
```http
GET /kta
Authorization: Bearer {token}
```

### Create KTA
```http
POST /kta
Authorization: Bearer {token}
Content-Type: application/json

{
  "nomor_kta": "KTA-2026-001234",
  "id_kta": "ID-SP-2026-5678",
  "tingkatan_id": "uuid",
  "tanggal_dikeluarkan": "2026-01-01",
  "tanggal_expired": "2028-12-31"
}
```

### Upload KTA Photos
```http
POST /kta/{id}/photos
Authorization: Bearer {token}
Content-Type: multipart/form-data

foto_depan: (image)
foto_belakang: (image)
```

---

## Materi (LMS)

### Get All Materi
```http
GET /materi?tingkatan_id=uuid
Authorization: Bearer {token}
```

### Get Materi Detail
```http
GET /materi/{id}
Authorization: Bearer {token}
```

### Update Progress
```http
POST /materi/{id}/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "is_completed": true,
  "last_position_seconds": 900
}
```

### Get My Progress
```http
GET /materi/progress
Authorization: Bearer {token}
```

---

## Loker (Job Vacancies)

### Get All Vacancies
```http
GET /loker?status=active&provinsi=Jakarta
Authorization: Bearer {token}
```

### Get Vacancy Detail
```http
GET /loker/{id}
Authorization: Bearer {token}
```

### Create Vacancy (HRD)
```http
POST /loker
Authorization: Bearer {token}
Content-Type: application/json

{
  "perusahaan_nama": "PT Secure Properti",
  "posisi": "Security Officer",
  "jumlah_kebutuhan": 5,
  "penempatan": "Jakarta Pusat",
  "provinsi": "DKI Jakarta",
  "gaji_min": 4500000,
  "gaji_max": 5500000,
  "shift_info": "Shift 8 Jam",
  "minimal_tinggi_cm": 165,
  "minimal_pendidikan": "SMA/SMK",
  "wajib_sertifikat": true,
  "deskripsi_tugas": "Menjaga keamanan...",
  "benefit": "BPJS, Makan, Seragam",
  "kontak_hrd_phone": "08123456789",
  "deadline": "2026-06-15"
}
```

### Apply Job
```http
POST /loker/{id}/apply
Authorization: Bearer {token}
Content-Type: multipart/form-data

cv: (file pdf/doc)
sertifikat: (file pdf)
catatan: "Saya berminat..."
```

### Get My Applications
```http
GET /loker/applications
Authorization: Bearer {token}
```

### Update Application Status (HRD)
```http
PUT /loker/applications/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "interview",
  "status_message": "Silakan hadir interview..."
}
```

---

## Forum

### Get Posts
```http
GET /forum/posts?category_id=uuid&page=1
```

### Get Post Detail
```http
GET /forum/posts/{id}
Authorization: Bearer {token}
```

### Create Post
```http
POST /forum/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "category_id": "uuid",
  "judul": "Tips Lulus Gada Madya",
  "konten": "Berdasarkan pengalaman saya..."
}
```

### Add Comment
```http
POST /forum/posts/{id}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "konten": "Terima kasih tipsnya!",
  "parent_id": null
}
```

### Toggle Like
```http
POST /forum/posts/{id}/like
Authorization: Bearer {token}
```

---

## AI Assistant

### Create Session
```http
POST /ai/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "judul": "Chat Security"
}
```

### Send Message
```http
POST /ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "session_id": "uuid",
  "message": "Apa tugas Danru?"
}
```

### Get Sessions
```http
GET /ai/sessions
Authorization: Bearer {token}
```

### Get Messages
```http
GET /ai/sessions/{id}/messages
Authorization: Bearer {token}
```

---

## Notifications

### Get All
```http
GET /notifications
Authorization: Bearer {token}
```

### Mark as Read
```http
POST /notifications/{id}/read
Authorization: Bearer {token}
```

### Mark All as Read
```http
POST /notifications/read-all
Authorization: Bearer {token}
```

---

## Admin Endpoints

### Get Users
```http
GET /admin/users?page=1&per_page=20
Authorization: Bearer {token} (admin)
```

### Verify User
```http
PUT /admin/users/{id}/verify
Authorization: Bearer {token} (admin)
```

### Pending Verifications
```http
GET /admin/verifications
Authorization: Bearer {token} (admin)
```

### Approve Verification
```http
POST /admin/verifications/{id}/approve
Authorization: Bearer {token} (admin)
```

### Statistics
```http
GET /admin/statistics
Authorization: Bearer {token} (admin)
```

---

## Response Format

### Success
```json
{
  "message": "Success message",
  "data": {},
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 20,
    "total": 200
  }
}
```

### Error
```json
{
  "message": "Error message",
  "errors": {
    "email": ["Email already exists"]
  }
}
```
