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

INSERT INTO materi_kategori (nama, slug, tingkatan_id, urutan) VALUES
    ('Sejarah Satpam Indonesia', 'sejarah-satpam', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 1),
    ('Tupoksi Satpam', 'tupoksi-satpam', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 2),
    ('Turjawali', 'turjawali', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 3),
    ('Bela Diri Dasar', 'bela-diri-dasar', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 4),
    ('Penanganan Tamu & Pelayanan', 'penanganan-tamu', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 5),
    ('Peralatan & Perlengkapan', 'peralatan', (SELECT id FROM tingkatan WHERE kode='gada_pratama'), 6),
    ('Leadership', 'leadership', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 1),
    ('Manajemen Risiko', 'manajemen-risiko', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 2),
    ('Investigasi Internal', 'investigasi', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 3),
    ('Pengendalian Massa', 'crowd-control', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 4),
    ('Tanggap Darurat', 'emergency', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 5),
    ('Intelijen Dasar', 'intelijen', (SELECT id FROM tingkatan WHERE kode='gada_madya'), 6),
    ('Strategic Security Management', 'strategic-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 1),
    ('Crisis Management', 'crisis-management', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 2),
    ('Corporate Security', 'corporate-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 3),
    ('Cyber Security Awareness', 'cyber-security', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 4),
    ('Executive Protection', 'executive-protection', (SELECT id FROM tingkatan WHERE kode='gada_utama'), 5)
ON CONFLICT (slug) DO NOTHING;

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

-- Materi Seed Data (komprehensif: Gada Pratama, Madya, Utama)
INSERT INTO materi (kategori_id, judul, slug, konten, ringkasan, durasi_menit, urutan, is_published) VALUES
    ((SELECT id FROM materi_kategori WHERE slug='sejarah-satpam'), 'Sejarah dan Perkembangan Satpam Indonesia', 'sejarah-satpam-indonesia', 'Profesi Satpam di Indonesia dimulai tahun 1950-an. Secara resmi didirikan oleh Prof. Dr. Awaloedin Djamin, MBA pada 14 September 1980 melalui SK Kapolri No. Pol. Skep/126/IX/1980. Perkap No. 24 Tahun 2007 menjadi landasan hukum utama. UU No. 2 Tahun 2002 tentang Kepolisian RI menegaskan Satpam sebagai bagian sistem keamanan nasional. Jenjang karir: Gada Pratama, Madya, Utama.', 'Mempelajari sejarah berdirinya Satpam Indonesia dari masa ke masa', 20, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='sejarah-satpam'), 'Regulasi dan Dasar Hukum Satpam', 'regulasi-satpam', 'Dasar hukum Satpam: UU No. 2/2002 tentang Kepolisian RI, Perkap No. 24/2007 tentang Sistem Manajemen Pengamanan, Perkap No. 4/2012 tentang Pengamanan Swakarsa, PP No. 50/2012 tentang SMP. Hak: pelatihan, perlindungan hukum, gaji layak. Kewajiban: menjaga keamanan, melapor, menjaga rahasia, mematuhi kode etik.', 'Memahami regulasi yang mengatur profesi Satpam', 15, 2, true),
    ((SELECT id FROM materi_kategori WHERE slug='tupoksi-satpam'), 'Tugas Pokok Satpam', 'tugas-pokok-satpam', 'Tugas pokok Satpam: pengamanan fisik (aset), personel (karyawan), informasi (dokumen). Turjawali: Pengaturan lalu lintas/tamu, Penjagaan pos, Pengawalan barang/orang, Patroli rutin. Tujuan: menciptakan rasa aman dan nyaman.', 'Mengenal tugas-tugas utama seorang Satpam dalam keamanan', 15, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='tupoksi-satpam'), 'Wewenang dan Batasan Hukum Satpam', 'wewenang-satpam', 'Wewenang Satpam: menindak administratif (tegur, peringatan), memeriksa identitas/barang, mengamankan TKP. Batasan: TIDAK berwenang menyidik, menangkap (kecuali tangkap tangan), menggeledah rumah, menggunakan senpi (kecuali izin). Sanksi: KUHP 351-358 (penganiayaan), 335 (pemaksaan).', 'Batasan hukum dan kewenangan yang dimiliki Satpam', 12, 2, true),
    ((SELECT id FROM materi_kategori WHERE slug='turjawali'), 'Pengaturan dan Penjagaan', 'pengaturan-penjagaan', 'Turjawali: TUR (Pengaturan lalu lintas/tamu), JA (Penjagaan pos). Teknik pengaturan: isyarat tangan, posisi tegap, suara tegas. Penjagaan: statis (di pos), dinamis (bergerak), khusus (objek vital). Catat di buku laporan, buku tamu, buku inventaris.', 'Cara mengatur dan melaksanakan tugas penjagaan', 20, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='turjawali'), 'Pengawalan dan Patroli', 'pengawalan-patroli', 'Pengawalan: mengawal personel (VVIP), barang (uang/dokumen). Tahapan: briefing, persiapan cek kendaraan, pelaksanaan, evaluasi. Patroli: jalan kaki (area sempit), kendaraan (area luas), kombinasi. Teknik: rute acak, perhatikan titik buta, catat temuan, komunikasi berkala.', 'Prosedur pengawalan personel/barang dan teknik patroli', 25, 2, true),
    ((SELECT id FROM materi_kategori WHERE slug='bela-diri-dasar'), 'Teknik Bela Diri Dasar Satpam', 'teknik-bela-diri-dasar', 'Bela diri Satpam bersifat DEFENSIF. Teknik: kuncian (tangan, lengan, bahu), hindaran (samping, mundur, putar), bantingan (pinggang, kaki, bahu), lepas kuncian. Penggunaan borgol: posisi tangan di belakang, masukkan satu per satu, kunci, periksa kekencangan.', 'Dasar-dasar teknik bela diri defensif yang wajib dikuasai', 30, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='bela-diri-dasar'), 'Pertolongan Pertama First Aid', 'first-aid-satpam', 'DRABC: Danger, Response, Airway, Breathing, Circulation. Penanganan: luka bakar (air dingin 15 menit), patah tulang (immobilisasi), pingsan (recovery position), CPR (30:2, 5-6cm depth), perdarahan (tekan langsung). Isi P3K: kasa, perban, plester, antiseptik, sarung tangan, masker CPR.', 'Teknik pertolongan pertama DRABC, CPR, dan penanganan darurat', 25, 2, true),
    ((SELECT id FROM materi_kategori WHERE slug='penanganan-tamu'), 'Prosedur Penanganan Tamu', 'prosedur-tamu', 'Prosedur: sapa sopan, identifikasi (KTP/SIM), catat di buku tamu, beri tanda pengenal, arahkan. Tamu agresif: tetap tenang, jaga jarak 2m, gunakan bahasa menenangkan, minta rekan siaga, hubungi atasan/POLRI. Etika 5S: Senyum, Salam, Sapa, Sopan, Santun.', 'SOP penerimaan tamu, identifikasi, dan etika pelayanan', 15, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='peralatan'), 'Peralatan dan Perlengkapan Satpam', 'peralatan-satpam', 'Alat wajib: HT (komunikasi), borgol, tongkat, rompi, senter, peluit. Seragam: PDL (lapangan), PDH (harian), PDU (upacara). Atribut: topi, name tag, tanda pangkat. Perawatan: bersihkan, cek rutin, simpan aman, ganti baterai HT. HT: tekan PTT, bicara jelas, akhiri over.', 'Mengenal peralatan wajib dan cara penggunaannya', 12, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='leadership'), 'Kepemimpinan untuk Danru', 'leadership-danru', 'Danru minimal Gada Madya. Fungsi: planning (jadwal shift), organizing (bagi tugas), directing (briefing), controlling (evaluasi). Gaya: otoritatif (krisis), demokratis (normal), situasional. Briefing sebelum shift, debriefing setelah shift. Manajemen konflik: identifikasi, dengar, cari solusi, mediasi.', 'Kepemimpinan dan fungsi manajemen untuk Danru', 30, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='manajemen-risiko'), 'Manajemen Risiko Keamanan', 'manajemen-risiko', 'Langkah: identifikasi risiko (observasi, analisis data), analisis (probabilitas x dampak), evaluasi (level rendah/sedang/tinggi), mitigasi (cegah, kurangi, pindah, terima). Matriks risiko: Tinggi-Tinggi = Kritis. Dokumentasi: Risk Register, laporan insiden, analisis tren.', 'Cara mengidentifikasi dan menangani risiko keamanan', 35, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='investigasi'), 'Teknik Investigasi Internal', 'investigasi-internal', 'Prinsip: objektif, sistematis, rahasia, tepat waktu. Langkah: persiapan, pengumpulan data (CCTV, saksi, bukti), analisis (timeline, motif), kesimpulan. Teknik wawancara: saksi (buat nyaman, open question), tersangka (konfrontasi bukti, teknik REID). Dokumentasi: laporan 24 jam, perkembangan, akhir.', 'Langkah investigasi dan teknik wawancara internal', 40, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='crowd-control'), 'Pengendalian Massa', 'crowd-control', 'Tingkatan massa: pasif, aktif, agresif, anarkis. Teknik: barrier, jalur evakuasi, antrian, zonasi. Formasi: garis (halau), segitiga (buka jalan), lingkaran (lindungi objek), sapu (bersihkan). Komunikasi persuasif, tunjukkan kekuatan, minta bantuan aparat jika anarkis.', 'Teknik pengendalian massa dan formasi pengamanan', 30, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='emergency'), 'Prosedur Tanggap Darurat', 'tanggap-darurat', 'Jenis darurat: alam (gempa, banjir), kecelakaan (kebocoran gas), keamanan (perampokan), kesehatan (wabah). Sistem: deteksi (alarm, sensor), komunikasi (aktifkan alarm, hubungi berwenang), evakuasi (rute, titik kumpul), penanganan (P3K, pemadam). Tim: Commander, Evakuasi, P3K, Security, Logistik.', 'Prosedur evakuasi dan sistem tanggap darurat', 35, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='intelijen'), 'Intelijen Keamanan Dasar', 'intelijen-dasar', 'Siklus intelijen: perencanaan, pengumpulan (observasi, wawancara, data sekunder), pengolahan (verifikasi, klasifikasi, analisis pola), diseminasi (laporan, briefing). Indikator ancaman: mondar-mandir, memotret area terlarang, mencatat jadwal, social engineering, tailgating. Klasifikasi: biasa, terbatas, rahasia.', 'Pengumpulan informasi dan deteksi ancaman keamanan', 30, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='strategic-security'), 'Strategic Security Management', 'strategic-security', 'Komponen: Security Governance (kebijakan, struktur, SOP), Risk Management Framework (ERM, BIA, SRA), Security Architecture (physical, technical, administrative). KPI: jumlah insiden, response time, compliance rate. Budget: operasional, capital (CCTV), training, emergency. Audit: internal 6 bulan, eksternal 1 tahun.', 'Manajemen keamanan strategis untuk level Utama', 45, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='crisis-management'), 'Manajemen Krisis Perusahaan', 'crisis-management', 'Krisis: internal (kebakaran, mogok), eksternal (bencana, terorisme), reputasi (skandal). Tim: Crisis Manager, Operations, Communications, Legal, HR. Langkah: identifikasi, aktivasi tim, penanganan (prioritas keselamatan, komunikasi), pemulihan (business continuity, evaluasi). BCP: RTO, RPO, alternate site, DRP.', 'Penanganan krisis dan business continuity plan', 40, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='corporate-security'), 'Corporate Security', 'corporate-security', 'Aset: fisik (gedung, peralatan), intelektual (paten, database), manusia (karyawan). Defense in Depth: perimeter (pagar, CCTV), building (akses kontrol), area (biometrik, alarm), asset (brankas). Vendor management: screening, kontrak, audit, NDA. Compliance: ISO 31000, ISO 27001, audit internal/eksternal.', 'Proteksi aset perusahaan dan defense in depth', 35, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='cyber-security'), 'Cyber Security Awareness', 'cyber-security', 'Ancaman: malware (virus, ransomware), phishing (email palsu), social engineering (impersonasi), insider threat. Pencegahan: password 12+ karakter, kombinasi huruf/angka/simbol, jangan klik link mencurigakan, update software, kunci layar. Fisik: cek tailgating server, hancurkan dokumen sensitif.', 'Dasar keamanan siber untuk Satpam', 30, 1, true),
    ((SELECT id FROM materi_kategori WHERE slug='executive-protection'), 'Executive Protection', 'executive-protection', 'Prinsip: preventive, low profile, flexible, professional. Advance: site survey, route planning. Formasi: diamond, V, box. Perimeter: inner (langsung VVIP), middle (area venue), outer (area luar). Vehicle: pemeriksaan kendaraan, convoy, anti-ambush. Komunikasi: kode rahasia, check-in periodik, backup personel.', 'Perlindungan VVIP dan eksekutif perusahaan', 40, 1, true)
ON CONFLICT (slug) DO NOTHING;

-- Migrations for existing tables
ALTER TABLE materi ADD COLUMN IF NOT EXISTS ringkasan TEXT;
ALTER TABLE materi ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE materi ADD COLUMN IF NOT EXISTS durasi_menit INT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nama_panggilan TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS foto_profil_url TEXT;

-- AI Chat
CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEW FEATURE TABLES - Super App Security
-- ============================================================

-- 1. PAYMENTS / PREMIUM LISTINGS (Tier 1 - Monetization)
CREATE TABLE IF NOT EXISTS payment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    deskripsi TEXT,
    harga NUMERIC(15,2) NOT NULL,
    durasi_hari INT NOT NULL,
    fitur TEXT[],
    type TEXT NOT NULL DEFAULT 'loker' CHECK (type IN ('loker', 'course', 'sertifikat', 'patrol')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO payment_plans (code, nama, deskripsi, harga, durasi_hari, fitur, type) VALUES
    ('loker_premium_30', 'Premium Listing 30 Hari', 'Lowongan tampil di urutan atas dengan badge premium', 50000, 30, ARRAY['Badge Premium', 'Urutan Atas', 'Prioritas Verifikasi'], 'loker'),
    ('loker_premium_60', 'Premium Listing 60 Hari', 'Lowongan tampil premium selama 60 hari', 80000, 60, ARRAY['Badge Premium', 'Urutan Atas', 'Prioritas Verifikasi', 'Highlight Warna'], 'loker'),
    ('loker_premium_90', 'Premium Listing 90 Hari', 'Lowongan tampil premium selama 90 hari', 120000, 90, ARRAY['Badge Premium', 'Urutan Atas', 'Prioritas Verifikasi', 'Highlight Warna', 'Push Notification'], 'loker'),
    ('course_pratama', 'Kursus Gada Pratama', 'Akses penuh semua materi Gada Pratama + sertifikat', 150000, 365, ARRAY['Semua Materi Pratama', 'Sertifikat Digital', 'Konsultasi'], 'course'),
    ('course_madya', 'Kursus Gada Madya', 'Akses penuh semua materi Gada Madya + sertifikat', 200000, 365, ARRAY['Semua Materi Madya', 'Sertifikat Digital', 'Konsultasi Danru'], 'course'),
    ('course_utama', 'Kursus Gada Utama', 'Akses penuh semua materi Gada Utama + sertifikat', 300000, 365, ARRAY['Semua Materi Utama', 'Sertifikat Digital', 'Konsultasi Ahli'], 'course'),
    ('sertifikat_digital', 'Sertifikat Digital Tervalidasi', 'Terbitkan sertifikat digital dengan QR code verifikasi', 75000, 0, ARRAY['QR Code', 'Verifikasi Online', 'Tanda Tangan Digital'], 'sertifikat')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    plan_id UUID REFERENCES payment_plans(id),
    amount NUMERIC(15,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
    payment_method TEXT,
    midtrans_order_id TEXT,
    midtrans_transaction_id TEXT,
    midtrans_redirect_url TEXT,
    paid_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Premium job listings
ALTER TABLE job_vacancies ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE job_vacancies ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;
ALTER TABLE job_vacancies ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id);

-- 2. COURSE PURCHASES (Paid training)
CREATE TABLE IF NOT EXISTS course_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    payment_id UUID REFERENCES payments(id),
    course_code TEXT NOT NULL,
    course_nama TEXT NOT NULL,
    access_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PATROLI DIGITAL (Tier 2)
CREATE TABLE IF NOT EXISTS patrol_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    shift_date DATE NOT NULL,
    shift_type TEXT NOT NULL CHECK (shift_type IN ('pagi', 'siang', 'malam')),
    patrol_route TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'missed')),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    total_checkpoints INT DEFAULT 0,
    completed_checkpoints INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patrol_checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    lokasi_lat NUMERIC(10,7),
    lokasi_lng NUMERIC(10,7),
    radius_meters INT DEFAULT 20,
    qr_code TEXT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patrol_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID NOT NULL REFERENCES patrol_shifts(id),
    checkpoint_id UUID REFERENCES patrol_checkpoints(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    scan_method TEXT NOT NULL CHECK (scan_method IN ('gps', 'qr', 'manual')),
    status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'skip', 'missed', 'issue')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    foto_url TEXT,
    catatan TEXT,
    lokasi_lat NUMERIC(10,7),
    lokasi_lng NUMERIC(10,7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ABSENSI QR (Tier 2)
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    shift_id UUID REFERENCES patrol_shifts(id),
    type TEXT NOT NULL CHECK (type IN ('checkin', 'checkout')),
    method TEXT NOT NULL CHECK (method IN ('qr', 'gps', 'manual')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    foto_url TEXT,
    lokasi_lat NUMERIC(10,7),
    lokasi_lng NUMERIC(10,7),
    lokasi_nama TEXT,
    device_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LAPORAN KEJADIAN (Tier 3)
CREATE TABLE IF NOT EXISTS incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    shift_id UUID REFERENCES patrol_shifts(id),
    nomor_laporan TEXT UNIQUE,
    jenis_kejadian TEXT NOT NULL CHECK (jenis_kejadian IN (
        'pencurian', 'kebakaran', 'kecelakaan', 'perkelahian',
        'pengancaman', 'penyusupan', 'kerusakan_aset', 'kehilangan_barang',
        'pelanggaran_sop', 'kecurigaan', 'darurat_medis', 'bencana_alam',
        'pelanggaran_lalu_lintas', 'lainnya'
    )),
    tingkat_darurat TEXT NOT NULL DEFAULT 'rendah' CHECK (tingkat_darurat IN ('rendah', 'sedang', 'tinggi', 'kritis')),
    judul TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    lokasi TEXT,
    lokasi_lat NUMERIC(10,7),
    lokasi_lng NUMERIC(10,7),
    foto_url TEXT[],
    video_url TEXT[],
    korban_jiwa INT DEFAULT 0,
    korban_luka INT DEFAULT 0,
    kerugian_perkiraan NUMERIC(15,2),
    tindakan_awal TEXT,
    status TEXT NOT NULL DEFAULT 'dilaporkan' CHECK (status IN (
        'dilaporkan', 'diverifikasi', 'ditangani', 'selesai', 'ditutup'
    )),
    handled_by TEXT REFERENCES users(id),
    handled_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolved_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PANIC BUTTON (Tier 3)
CREATE TABLE IF NOT EXISTS panic_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL DEFAULT 'panic' CHECK (type IN ('panic', 'emergency', 'backup')),
    lokasi_lat NUMERIC(10,7),
    lokasi_lng NUMERIC(10,7),
    lokasi_nama TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'false_alarm')),
    acknowledged_by TEXT REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DASHBOARD KOMANDAN (Tier 2) - team/guard management
CREATE TABLE IF NOT EXISTS guard_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_team TEXT NOT NULL,
    commander_id TEXT NOT NULL REFERENCES users(id),
    perusahaan TEXT,
    lokasi TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES guard_teams(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    role TEXT NOT NULL DEFAULT 'anggota' CHECK (role IN ('komandan', 'danru', 'anggota')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 8. AI INCIDENT ANALYSIS (Tier 3 enhancement)
ALTER TABLE ai_chat_messages ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 9. REAL-TIME CHAT (Tier 4)
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT,
    type TEXT NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group', 'team')),
    team_id UUID REFERENCES guard_teams(id),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachment_url TEXT,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'location', 'system')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_patrol_shifts_user ON patrol_shifts(user_id, shift_date);
CREATE INDEX IF NOT EXISTS idx_patrol_logs_shift ON patrol_logs(shift_id);
CREATE INDEX IF NOT EXISTS idx_patrol_logs_user ON patrol_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_patrol_logs_timestamp ON patrol_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance_logs(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_incident_reports_user ON incident_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_panic_alerts_status ON panic_alerts(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_user ON chat_room_members(user_id);`;

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
