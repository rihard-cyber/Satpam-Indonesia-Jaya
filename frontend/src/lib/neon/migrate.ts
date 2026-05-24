import { sql } from './db';

const migration = `
-- Tingkatan
CREATE TABLE IF NOT EXISTS tingkatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    urutan INT DEFAULT 0
);
INSERT INTO tingkatan (kode, nama, urutan) VALUES
    ('gada_pratama', 'Gada Pratama', 1),
    ('gada_madya', 'Gada Madya', 2),
    ('gada_utama', 'Gada Utama', 3)
ON CONFLICT (kode) DO NOTHING;

-- Users (extends NextAuth)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nama_lengkap TEXT NOT NULL DEFAULT '',
    nama_panggilan TEXT,
    foto_profil_url TEXT,
    phone TEXT,
    password_hash TEXT,
    tingkatan_id UUID REFERENCES tingkatan(id),
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts (NextAuth)
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

-- Sessions (NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

-- Verification Tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    UNIQUE(identifier, token)
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KTA
CREATE TABLE IF NOT EXISTS kta_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nomor_kta TEXT NOT NULL,
    id_kta TEXT NOT NULL,
    tingkatan_id UUID REFERENCES tingkatan(id),
    tanggal_dikeluarkan DATE NOT NULL,
    tanggal_expired DATE NOT NULL,
    foto_depan_url TEXT,
    foto_belakang_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jenis TEXT NOT NULL,
    nama_sertifikat TEXT NOT NULL,
    penerbit TEXT,
    file_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materi Kategori
CREATE TABLE IF NOT EXISTS materi_kategori (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tingkatan_id UUID REFERENCES tingkatan(id),
    urutan INT DEFAULT 0
);

-- Materi
CREATE TABLE IF NOT EXISTS materi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kategori_id UUID NOT NULL REFERENCES materi_kategori(id),
    judul TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    konten TEXT DEFAULT '',
    ringkasan TEXT,
    durasi_menit INT,
    video_url TEXT,
    urutan INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materi Progress
CREATE TABLE IF NOT EXISTS materi_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    materi_id UUID NOT NULL REFERENCES materi(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, materi_id)
);

-- Job Vacancies
CREATE TABLE IF NOT EXISTS job_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perusahaan_nama TEXT NOT NULL,
    perusahaan_logo_url TEXT,
    posisi TEXT NOT NULL,
    jumlah_kebutuhan INT DEFAULT 1,
    penempatan TEXT NOT NULL,
    gaji_min NUMERIC,
    gaji_max NUMERIC,
    deskripsi_tugas TEXT NOT NULL,
    kontak_hrd_phone TEXT,
    status TEXT DEFAULT 'active',
    posted_by TEXT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES job_vacancies(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cv_url TEXT NOT NULL,
    status TEXT DEFAULT 'diproses',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vacancy_id, user_id)
);

-- Forum Categories
CREATE TABLE IF NOT EXISTS forum_categories (
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
    ('Keamanan Nasional', 'keamanan-nasional', 5)
ON CONFLICT (slug) DO NOTHING;

-- Forum Posts
CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES forum_categories(id),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    judul TEXT NOT NULL,
    konten TEXT NOT NULL,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum Comments
CREATE TABLE IF NOT EXISTS forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    konten TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materi Seed Data
INSERT INTO materi (kategori_id, judul, slug, konten, ringkasan, durasi_menit, urutan, is_published) VALUES
    ((SELECT id FROM materi_kategori WHERE slug='sejarah-satpam'), 'Sejarah dan Perkembangan Satpam di Indonesia', 'sejarah-satpam-indonesia', 'Satuan Pengamanan (Satpam) telah ada sejak zaman kolonial Belanda...', 'Mempelajari sejarah panjang satpam Indonesia dari masa ke masa', 15, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='sejarah-satpam'), 'Regulasi dan Dasar Hukum Satpam', 'regulasi-satpam', 'Dasar hukum utama profesi Satpam adalah Perkap No. 24 Tahun 2007...', 'Memahami regulasi yang mengatur profesi satpam', 20, 2, true),
    ((SELECT id FROM materi_kategori WHERE slug='tupoksi-satpam'), 'Tugas Pokok Satpam', 'tugas-pokok-satpam', 'Tugas pokok Satpam meliputi pengamanan fisik, personel, dan informasi...', 'Mengenal tugas-tugas utama seorang satpam', 15, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='tupoksi-satpam'), 'Wewenang dan Batasan Satpam', 'wewenang-satpam', 'Satpam memiliki wewenang terbatas yang diatur oleh undang-undang...', 'Batasan hukum dan wewenang yang dimiliki satpam', 10, 2, true),
    ((SELECT id FROM materi_kategori WHERE slug='turjawali'), 'Pengaturan Penjagaan', 'pengaturan-penjagaan', 'Teknik pengaturan penjagaan yang efektif meliputi...', 'Cara mengatur dan melaksanakan tugas penjagaan', 20, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='turjawali'), 'Tata Cara Pengawalan', 'tata-cara-pengawalan', 'Pengawalan dilakukan dengan prosedur standar operasi yang ketat...', 'Prosedur pengawalan yang benar dan profesional', 25, 2, true),
    ((SELECT id FROM materi_kategori WHERE slug='bela-diri-dasar'), 'Teknik Bela Diri Dasar', 'teknik-bela-diri-dasar', 'Teknik dasar bela diri untuk satpam mencakup kuncian, bantingan, dan hindaran...', 'Dasar-dasar teknik bela diri yang wajib dikuasai', 30, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='bela-diri-dasar'), 'Penggunaan Alat Pengaman', 'penggunaan-alat-pengaman', 'Alat pengaman seperti tongkat, borgol, dan alat komunikasi...', 'Cara menggunakan alat pengaman dengan benar', 15, 2, true)
ON CONFLICT (slug) DO NOTHING;

-- AI Chat
CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

export async function runMigration() {
  const statements = migration
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    try {
      await sql.query(stmt + ';');
    } catch (err) {
      console.error('Migration error (skipping):', (err as Error).message);
    }
  }

  console.log('Migration completed');
}
