-- ============================================================
-- SATPAM INDONESIA JAYA - Supabase Migration
-- Apply this in Supabase SQL Editor (one-click setup)
-- ============================================================

-- 1. TINGKATAN
CREATE TABLE tingkatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    urutan INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO tingkatan (kode, nama, urutan) VALUES
    ('gada_pratama', 'Gada Pratama', 1),
    ('gada_madya', 'Gada Madya', 2),
    ('gada_utama', 'Gada Utama', 3);

-- 2. PROFILES (extends Supabase Auth users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_lengkap TEXT NOT NULL,
    nama_panggilan TEXT,
    foto_profil_url TEXT,
    tingkatan_id UUID REFERENCES tingkatan(id),
    tempat_lahir TEXT,
    tanggal_lahir DATE,
    tinggi_cm INT,
    berat_kg INT,
    domisili TEXT,
    provinsi TEXT,
    pengalaman_kerja TEXT,
    keahlian TEXT[],
    bahasa TEXT[],
    nomor_sim TEXT,
    bersedia_shift BOOLEAN DEFAULT TRUE,
    bersedia_penempatan_luar_kota BOOLEAN DEFAULT FALSE,
    tentang_saya TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'danru', 'admin', 'superadmin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. KTA DIGITAL
CREATE TABLE kta_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nomor_kta TEXT NOT NULL,
    id_kta TEXT NOT NULL,
    tingkatan_id UUID REFERENCES tingkatan(id),
    tanggal_dikeluarkan DATE NOT NULL,
    tanggal_expired DATE NOT NULL,
    foto_depan_url TEXT,
    foto_belakang_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CERTIFICATES
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    jenis TEXT NOT NULL,
    nama_sertifikat TEXT NOT NULL,
    penerbit TEXT,
    nomor_sertifikat TEXT,
    file_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MATERI KATEGORI
CREATE TABLE materi_kategori (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tingkatan_id UUID REFERENCES tingkatan(id),
    urutan INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO materi_kategori (nama, slug, tingkatan_id, urutan) VALUES
    ('Sejarah Satpam Indonesia', 'sejarah-satpam', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 1),
    ('Tupoksi Satpam', 'tupoksi-satpam', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 2),
    ('Turjawali', 'turjawali', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 3),
    ('Bela Diri Dasar', 'bela-diri-dasar', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 4),
    ('Leadership', 'leadership', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 1),
    ('Manajemen Risiko', 'manajemen-risiko', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 2),
    ('Strategic Security Management', 'strategic-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 1),
    ('Crisis Management', 'crisis-management', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 2);

-- 6. MATERI
CREATE TABLE materi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kategori_id UUID NOT NULL REFERENCES materi_kategori(id),
    judul TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    konten TEXT NOT NULL DEFAULT '',
    ringkasan TEXT,
    durasi_menit INT,
    video_url TEXT,
    urutan INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MATERI PROGRESS
CREATE TABLE materi_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    materi_id UUID NOT NULL REFERENCES materi(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    last_position_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, materi_id)
);

-- 8. JOB VACANCIES
CREATE TABLE job_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perusahaan_nama TEXT NOT NULL,
    perusahaan_logo_url TEXT,
    posisi TEXT NOT NULL,
    jumlah_kebutuhan INT DEFAULT 1,
    penempatan TEXT NOT NULL,
    gaji_min NUMERIC,
    gaji_max NUMERIC,
    shift_info TEXT,
    minimal_pendidikan TEXT,
    wajib_sertifikat BOOLEAN DEFAULT FALSE,
    deadline DATE,
    deskripsi_tugas TEXT NOT NULL,
    benefit TEXT,
    kontak_hrd_phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    posted_by UUID REFERENCES auth.users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. JOB APPLICATIONS
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES job_vacancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_url TEXT NOT NULL,
    status TEXT DEFAULT 'diproses' CHECK (status IN ('diproses', 'interview', 'diterima', 'ditolak')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vacancy_id, user_id)
);

-- 10. FORUM CATEGORIES
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    urutan INT DEFAULT 0
);
INSERT INTO forum_categories (nama, slug, urutan) VALUES
    ('Tanya Jawab', 'tanya-jawab', 1),
    ('Berbagi Pengalaman', 'berbagi-pengalaman', 2),
    ('Informasi Training', 'informasi-training', 3),
    ('Informasi Loker', 'informasi-loker', 4),
    ('Keamanan Nasional', 'keamanan-nasional', 5);

-- 11. FORUM POSTS
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES forum_categories(id),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    judul TEXT NOT NULL,
    konten TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FORUM COMMENTS
CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES forum_comments(id),
    konten TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. BADGE TYPES
CREATE TABLE badge_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL
);
INSERT INTO badge_types (kode, nama) VALUES
    ('verified_satpam', 'Verified Satpam'),
    ('verified_danru', 'Verified Danru'),
    ('verified_instructor', 'Verified Instructor');

-- 15. USER BADGES
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badge_types(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 16. AI CHAT SESSIONS
CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    judul TEXT DEFAULT 'Chat Security',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AI CHAT MESSAGES
CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_kta_user_id ON kta_documents(user_id);
CREATE INDEX idx_materi_kategori ON materi(kategori_id);
CREATE INDEX idx_job_vacancies_status ON job_vacancies(status);
CREATE INDEX idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE is_read = FALSE;

-- ============================================================
-- RLS POLICIES (Row Level Security)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kta_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE materi_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles: user can CRUD own, admin can read all
CREATE POLICY "profiles_own" ON profiles
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "profiles_admin" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
    );

-- KTA: user can CRUD own
CREATE POLICY "kta_own" ON kta_documents
    FOR ALL USING (auth.uid() = user_id);

-- Certificates: user can CRUD own
CREATE POLICY "certificates_own" ON certificates
    FOR ALL USING (auth.uid() = user_id);

-- Materi progress: user can manage own
CREATE POLICY "materi_progress_own" ON materi_progress
    FOR ALL USING (auth.uid() = user_id);

-- Job applications: user can CRUD own, company can read own vacancy
CREATE POLICY "applications_own" ON job_applications
    FOR ALL USING (auth.uid() = user_id);

-- Forum: authenticated users can CRUD, public can read
CREATE POLICY "forum_posts_read" ON forum_posts
    FOR SELECT USING (true);
CREATE POLICY "forum_posts_own" ON forum_posts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "forum_comments_read" ON forum_comments
    FOR SELECT USING (true);
CREATE POLICY "forum_comments_own" ON forum_comments
    FOR ALL USING (auth.uid() = user_id);

-- Notifications: user can read own
CREATE POLICY "notifications_own" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- AI Chat: user can manage own
CREATE POLICY "ai_sessions_own" ON ai_chat_sessions
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "ai_messages_own" ON ai_chat_messages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM ai_chat_sessions WHERE id = session_id AND user_id = auth.uid())
    );

-- Badges: readable by all authenticated, manageable by admin
CREATE POLICY "badges_read" ON user_badges
    FOR SELECT USING (true);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, nama_lengkap, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nama_lengkap', NEW.email), 'user');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
