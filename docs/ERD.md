# Entity Relationship Diagram - SATPAM INDONESIA JAYA

```mermaid
erDiagram
    %% ===== USERS & AUTH =====
    users ||--o| profiles : has
    users ||--o{ kta_documents : owns
    users ||--o{ certificates : owns
    users ||--o{ sessions : has
    users ||--o{ otp_codes : requests
    users ||--o{ materi_progress : learns
    users ||--o{ job_applications : applies
    users ||--o{ forum_posts : writes
    users ||--o{ forum_comments : comments
    users ||--o{ ai_chat_sessions : chats
    users ||--o{ notifications : receives
    users ||--o{ user_badges : has
    users ||--o{ verification_requests : submits
    users ||--o{ job_chat_messages : sends
    users ||--o{ materi : creates
    users ||--o{ job_vacancies : posts

    %% ===== TINGKATAN =====
    tingkatan ||--o{ users : "memiliki"
    tingkatan ||--o{ kta_documents : "memiliki"
    tingkatan ||--o{ materi_kategori : "memiliki"

    %% ===== MATERI / LMS =====
    materi_kategori ||--o{ materi : contains
    materi ||--o{ materi_progress : tracked

    %% ===== FORUM =====
    forum_categories ||--o{ forum_posts : contains
    forum_posts ||--o{ forum_comments : has
    forum_comments ||--o{ forum_comments : replies

    %% ===== JOB VACANCIES =====
    job_vacancies ||--o{ job_applications : receives
    job_applications ||--o{ job_chat_messages : has

    %% ===== BADGES =====
    badge_types ||--o{ user_badges : defines
    badge_types ||--o{ verification_requests : targets

    %% ===== AI CHAT =====
    ai_chat_sessions ||--o{ ai_chat_messages : contains

    %% ===== ENTITY DEFINITIONS =====
    users {
        uuid id PK
        string email UK
        string phone UK
        string password_hash
        string nama_lengkap
        string nama_panggilan
        string foto_profil_url
        uuid tingkatan_id FK
        string role
        boolean is_verified
        boolean is_active
        timestamp email_verified_at
        timestamp phone_verified_at
        string google_id UK
        timestamp last_login_at
        timestamp created_at
    }

    profiles {
        uuid id PK
        uuid user_id FK UK
        string tempat_lahir
        date tanggal_lahir
        int tinggi_cm
        int berat_kg
        text domisili
        string provinsi
        string kota_kabupaten
        string kecamatan
        text alamat_lengkap
        string kode_pos
        text pengalaman_kerja
        text[] keahlian
        text[] bahasa
        string nomor_sim
        boolean bersedia_shift
        boolean bersedia_penempatan_luar_kota
        text preferensi_penempatan
        text tentang_saya
    }

    kta_documents {
        uuid id PK
        uuid user_id FK
        string nomor_kta
        string id_kta
        uuid tingkatan_id FK
        date tanggal_dikeluarkan
        date tanggal_expired
        string foto_depan_url
        string foto_belakang_url
        string status
        uuid verified_by FK
    }

    certificates {
        uuid id PK
        uuid user_id FK
        string jenis
        string nama_sertifikat
        string penerbit
        string nomor_sertifikat
        date tanggal_terbit
        date tanggal_expired
        string file_url
        boolean is_verified
        uuid verified_by FK
    }

    tingkatan {
        uuid id PK
        string kode UK
        string nama
        text deskripsi
        int urutan
    }

    materi_kategori {
        uuid id PK
        string nama
        string slug UK
        uuid tingkatan_id FK
        int urutan
    }

    materi {
        uuid id PK
        uuid kategori_id FK
        string judul
        string slug UK
        text konten
        text ringkasan
        int durasi_menit
        string video_url
        string thumbnail_url
        int urutan
        boolean is_published
        uuid created_by FK
    }

    materi_progress {
        uuid id PK
        uuid user_id FK
        uuid materi_id FK
        boolean is_completed
        timestamp completed_at
        int last_position_seconds
    }

    job_vacancies {
        uuid id PK
        string perusahaan_nama
        string perusahaan_logo_url
        string posisi
        int jumlah_kebutuhan
        text penempatan
        string provinsi
        string kota_kabupaten
        numeric gaji_min
        numeric gaji_max
        string shift_info
        int minimal_tinggi_cm
        string minimal_pendidikan
        boolean wajib_sertifikat
        string pengalaman_minimal
        string jenis_kelamin
        date deadline
        text deskripsi_tugas
        text benefit
        string kontak_hrd_nama
        string kontak_hrd_phone
        string kontak_hrd_email
        string foto_lokasi_url
        string status
        uuid posted_by FK
    }

    job_applications {
        uuid id PK
        uuid vacancy_id FK
        uuid user_id FK
        string cv_url
        string sertifikat_url
        text catatan
        string status
        uuid reviewed_by FK
    }

    job_chat_messages {
        uuid id PK
        uuid application_id FK
        uuid sender_id FK
        text message
        string attachment_url
        boolean is_read
    }

    forum_categories {
        uuid id PK
        string nama
        string slug UK
        string icon
        int urutan
    }

    forum_posts {
        uuid id PK
        uuid category_id FK
        uuid user_id FK
        string judul
        string slug UK
        text konten
        string[] gambar_url
        boolean is_pinned
        boolean is_locked
        int views_count
        int likes_count
        int comments_count
    }

    forum_comments {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        uuid parent_id FK
        text konten
        int likes_count
    }

    notifications {
        uuid id PK
        uuid user_id FK
        string type
        string title
        text body
        jsonb data
        boolean is_read
        timestamp read_at
    }

    badge_types {
        uuid id PK
        string kode UK
        string nama
        string icon_url
    }

    user_badges {
        uuid id PK
        uuid user_id FK
        uuid badge_id FK
        uuid granted_by FK
        timestamp granted_at
        timestamp expires_at
    }

    verification_requests {
        uuid id PK
        uuid user_id FK
        uuid badge_id FK
        string status
        string kta_photo_url
        string selfie_photo_url
        string certificate_url
        string company_email
        text notes
        uuid reviewed_by FK
    }

    ai_chat_sessions {
        uuid id PK
        uuid user_id FK
        string judul
        string model
    }

    ai_chat_messages {
        uuid id PK
        uuid session_id FK
        uuid user_id FK
        string role
        text message
    }

    sessions {
        uuid id PK
        uuid user_id FK
        string token
        string refresh_token
        text device_info
        string ip_address
        timestamp expires_at
    }

    otp_codes {
        uuid id PK
        uuid user_id FK
        string email
        string phone
        string otp_code
        string type
        string purpose
        boolean is_used
        timestamp expires_at
    }
```
