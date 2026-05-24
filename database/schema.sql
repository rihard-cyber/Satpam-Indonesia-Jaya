-- ============================================================
-- SATPAM INDONESIA JAYA - Database Schema
-- PostgreSQL 15+
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. MASTER DATA / REFERENCE TABLES
-- ============================================================

-- Tingkatan Satpam
CREATE TABLE tingkatan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode VARCHAR(20) UNIQUE NOT NULL, -- 'gada_pratama', 'gada_madya', 'gada_utama'
    nama VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO tingkatan (kode, nama, urutan) VALUES
('gada_pratama', 'Gada Pratama', 1),
('gada_madya', 'Gada Madya', 2),
('gada_utama', 'Gada Utama', 3);

-- Badge Verifikasi
CREATE TABLE badge_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode VARCHAR(30) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO badge_types (kode, nama) VALUES
('verified_satpam', 'Verified Satpam'),
('verified_danru', 'Verified Danru'),
('verified_instructor', 'Verified Instructor'),
('verified_company', 'Verified Company');

-- Kategori Forum
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    urutan INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO forum_categories (nama, slug, urutan) VALUES
('Tanya Jawab', 'tanya-jawab', 1),
('Berbagi Pengalaman', 'berbagi-pengalaman', 2),
('Informasi Training', 'informasi-training', 3),
('Informasi Loker', 'informasi-loker', 4),
('Keamanan Nasional', 'keamanan-nasional', 5),
('Bela Diri', 'bela-diri', 6),
('Peralatan Security', 'peralatan-security', 7);

-- Kategori Materi
CREATE TABLE materi_kategori (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tingkatan_id UUID REFERENCES tingkatan(id),
    urutan INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. USER & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(150) NOT NULL,
    nama_panggilan VARCHAR(50),
    foto_profil_url TEXT,
    tingkatan_id UUID REFERENCES tingkatan(id),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'danru', 'instructor', 'admin', 'superadmin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    google_id VARCHAR(100) UNIQUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP Verification
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    otp_code VARCHAR(6) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'whatsapp')),
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('register', 'login', 'forgot_password')),
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Tokens
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    device_info TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. PROFILES & DIGITAL KTA
-- ============================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    tinggi_cm INT,
    berat_kg INT,
    domisili TEXT,
    provinsi VARCHAR(100),
    kota_kabupaten VARCHAR(100),
    kecamatan VARCHAR(100),
    alamat_lengkap TEXT,
    kode_pos VARCHAR(10),
    pengalaman_kerja TEXT,
    keahlian TEXT[],
    bahasa TEXT[],
    nomor_sim VARCHAR(50),
    bersedia_shift BOOLEAN DEFAULT TRUE,
    bersedia_penempatan_luar_kota BOOLEAN DEFAULT FALSE,
    preferensi_penempatan TEXT,
    tentang_saya TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KTA (Kartu Tanda Anggota) Digital
CREATE TABLE kta_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nomor_kta VARCHAR(100) NOT NULL,
    id_kta VARCHAR(100) NOT NULL,
    tingkatan_id UUID NOT NULL REFERENCES tingkatan(id),
    tanggal_dikeluarkan DATE NOT NULL,
    tanggal_expired DATE NOT NULL,
    foto_depan_url TEXT,
    foto_belakang_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sertifikat
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jenis VARCHAR(100) NOT NULL,
    nama_sertifikat VARCHAR(255) NOT NULL,
    penerbit VARCHAR(255),
    nomor_sertifikat VARCHAR(100),
    tanggal_terbit DATE,
    tanggal_expired DATE,
    file_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. TRAINING MATERIALS (LMS)
-- ============================================================

CREATE TABLE materi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori_id UUID NOT NULL REFERENCES materi_kategori(id),
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    konten TEXT NOT NULL,
    ringkasan TEXT,
    durasi_menit INT,
    video_url TEXT,
    thumbnail_url TEXT,
    urutan INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO materi_kategori (nama, slug, tingkatan_id, urutan) VALUES
-- Gada Pratama
('Sejarah Satpam Indonesia', 'sejarah-satpam', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 1),
('Tupoksi Satpam', 'tupoksi-satpam', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 2),
('Turjawali', 'turjawali', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 3),
('Bela Diri Dasar', 'bela-diri-dasar', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 4),
('Penggunaan Borgol & Tongkat', 'borgol-tongkat', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 5),
('Penanganan Tamu', 'penanganan-tamu', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 6),
('Pengamanan Gedung & Aset', 'pengamanan-gedung-aset', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 7),
('Public Service & Etika Security', 'public-service-etika', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 8),
-- Gada Madya
('Leadership', 'leadership', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 1),
('Manajemen Risiko', 'manajemen-risiko', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 2),
('Investigasi Internal', 'investigasi-internal', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 3),
('Analisa Ancaman', 'analisa-ancaman', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 4),
('Crowd Control', 'crowd-control', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 5),
('Emergency Response', 'emergency-response', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 6),
('SOP Perusahaan', 'sop-perusahaan', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 7),
('Intelijen Dasar', 'intelijen-dasar', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 8),
('Audit Keamanan', 'audit-keamanan', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 9),
('Incident Report', 'incident-report', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 10),
-- Gada Utama
('Strategic Security Management', 'strategic-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 1),
('Crisis Management', 'crisis-management', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 2),
('Corporate Security', 'corporate-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 3),
('Executive Protection', 'executive-protection', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 4),
('Cyber Security Awareness', 'cyber-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 5),
('Business Continuity', 'business-continuity', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 6),
('Counter Terrorism Awareness', 'counter-terrorism', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 7),
('Risk Intelligence', 'risk-intelligence', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 8),
('National Security Analysis', 'national-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 9);

-- Progress Belajar User
CREATE TABLE materi_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    materi_id UUID NOT NULL REFERENCES materi(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    last_position_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, materi_id)
);

-- ============================================================
-- 5. JOB VACANCIES (PORTAL LOKER)
-- ============================================================

CREATE TABLE job_vacancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perusahaan_nama VARCHAR(255) NOT NULL,
    perusahaan_logo_url TEXT,
    posisi VARCHAR(255) NOT NULL,
    jumlah_kebutuhan INT DEFAULT 1,
    penempatan TEXT NOT NULL,
    provinsi VARCHAR(100),
    kota_kabupaten VARCHAR(100),
    gaji_min NUMERIC(15,2),
    gaji_max NUMERIC(15,2),
    shift_info TEXT,
    minimal_tinggi_cm INT,
    minimal_pendidikan VARCHAR(100),
    wajib_sertifikat BOOLEAN DEFAULT FALSE,
    pengalaman_minimal VARCHAR(100),
    jenis_kelamin VARCHAR(20) CHECK (jenis_kelamin IN ('laki', 'perempuan', 'semua')),
    deadline DATE,
    deskripsi_tugas TEXT NOT NULL,
    benefit TEXT,
    kontak_hrd_nama VARCHAR(100),
    kontak_hrd_phone VARCHAR(20),
    kontak_hrd_email VARCHAR(255),
    foto_lokasi_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    posted_by UUID REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vacancy_id UUID NOT NULL REFERENCES job_vacancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cv_url TEXT NOT NULL,
    sertifikat_url TEXT,
    catatan TEXT,
    status VARCHAR(20) DEFAULT 'diproses' CHECK (status IN ('diproses', 'interview', 'diterima', 'ditolak')),
    status_message TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vacancy_id, user_id)
);

-- Chat HRD (antara pelamar dan perusahaan)
CREATE TABLE job_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. FORUM KOMUNITAS
-- ============================================================

CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES forum_categories(id),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    konten TEXT NOT NULL,
    gambar_url TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES forum_comments(id),
    konten TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id, comment_id)
);

-- ============================================================
-- 7. VERIFICATION SYSTEM
-- ============================================================

CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badge_types(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    kta_photo_url TEXT,
    selfie_photo_url TEXT,
    certificate_url TEXT,
    company_email VARCHAR(255),
    notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badge_types(id),
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, badge_id)
);

-- ============================================================
-- 8. AI CHAT HISTORY
-- ============================================================

CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    judul VARCHAR(255) DEFAULT 'Chat Security',
    model VARCHAR(50) DEFAULT 'gemini',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. INDEXES
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_kta_user_id ON kta_documents(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_materi_kategori ON materi(kategori_id);
CREATE INDEX idx_materi_progress_user ON materi_progress(user_id);
CREATE INDEX idx_job_vacancies_status ON job_vacancies(status);
CREATE INDEX idx_job_applications_user ON job_applications(user_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_user ON forum_posts(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_ai_chat_sessions_user ON ai_chat_sessions(user_id);

-- ============================================================
-- 11. TRIGGERS & FUNCTIONS
-- ============================================================

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_kta_updated_at BEFORE UPDATE ON kta_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_job_vacancies_updated_at BEFORE UPDATE ON job_vacancies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 12. ERD RELATIONSHIPS (for documentation)
-- ============================================================
/*
ERD SUMMARY:

users 1:1 profiles
users 1:N kta_documents
users 1:N certificates
users 1:N materi_progress
users 1:N job_applications
users 1:N forum_posts
users 1:N forum_comments
users 1:N ai_chat_sessions
users 1:N notifications
users M:N badge_types (via user_badges)

tingkatan 1:N users
tingkatan 1:N kta_documents
tingkatan 1:N materi_kategori

materi_kategori 1:N materi
materi 1:N materi_progress

forum_categories 1:N forum_posts
forum_posts 1:N forum_comments
forum_comments 1:N forum_comments (self-ref parent_id)

job_vacancies 1:N job_applications
job_applications 1:N job_chat_messages

badge_types 1:N user_badges
badge_types 1:N verification_requests
*/
