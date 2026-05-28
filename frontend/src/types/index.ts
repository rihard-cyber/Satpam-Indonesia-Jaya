export interface User {
  id: string;
  email: string;
  phone?: string;
  nama_lengkap: string;
  nama_panggilan?: string;
  foto_profil_url?: string;
  tingkatan_id?: string;
  tingkatan?: Tingkatan;
  role: 'user' | 'danru' | 'instructor' | 'admin' | 'superadmin';
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Tingkatan {
  id: string;
  kode: 'gada_pratama' | 'gada_madya' | 'gada_utama';
  nama: string;
  urutan: number;
}

export interface Profile {
  id: string;
  user_id: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  tinggi_cm?: number;
  berat_kg?: number;
  domisili?: string;
  provinsi?: string;
  kota_kabupaten?: string;
  pengalaman_kerja?: string;
  keahlian?: string[];
  bahasa?: string[];
  nomor_sim?: string;
  bersedia_shift: boolean;
  bersedia_penempatan_luar_kota: boolean;
  tentang_saya?: string;
}

export interface KTADocument {
  id: string;
  user_id: string;
  nomor_kta: string;
  id_kta: string;
  tingkatan_id: string;
  tingkatan?: Tingkatan;
  tanggal_dikeluarkan: string;
  tanggal_expired: string;
  foto_depan_url?: string;
  foto_belakang_url?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface Certificate {
  id: string;
  user_id: string;
  jenis: string;
  nama_sertifikat: string;
  penerbit?: string;
  nomor_sertifikat?: string;
  tanggal_terbit?: string;
  tanggal_expired?: string;
  file_url: string;
  is_verified: boolean;
}

export interface MateriKategori {
  id: string;
  nama: string;
  slug: string;
  tingkatan_id: string;
  urutan: number;
  materi?: Materi[];
}

export interface Materi {
  id: string;
  kategori_id: string;
  judul: string;
  slug: string;
  konten: string;
  ringkasan?: string;
  durasi_menit?: number;
  video_url?: string;
  thumbnail_url?: string;
  urutan: number;
  is_published: boolean;
  progress?: MateriProgress;
}

export interface MateriProgress {
  id: string;
  user_id: string;
  materi_id: string;
  is_completed: boolean;
  completed_at?: string;
  last_position_seconds: number;
}

export interface JobVacancy {
  id: string;
  perusahaan_nama: string;
  perusahaan_logo_url?: string;
  posisi: string;
  jumlah_kebutuhan: number;
  penempatan: string;
  provinsi?: string;
  kota_kabupaten?: string;
  gaji_min?: number;
  gaji_max?: number;
  shift_info?: string;
  minimal_tinggi_cm?: number;
  minimal_pendidikan?: string;
  wajib_sertifikat: boolean;
  pengalaman_minimal?: string;
  jenis_kelamin?: string;
  deadline?: string;
  deskripsi_tugas: string;
  benefit?: string;
  kontak_hrd_nama?: string;
  kontak_hrd_phone?: string;
  kontak_hrd_email?: string;
  status: 'active' | 'closed' | 'draft';
  is_verified: boolean;
  created_at: string;
}

export interface JobApplication {
  id: string;
  vacancy_id: string;
  vacancy?: JobVacancy;
  user_id: string;
  user?: User;
  cv_url: string;
  sertifikat_url?: string;
  catatan?: string;
  status: 'diproses' | 'interview' | 'diterima' | 'ditolak';
  status_message?: string;
  created_at: string;
}

export interface ForumCategory {
  id: string;
  nama: string;
  slug: string;
  icon?: string;
  urutan: number;
}

export interface ForumPost {
  id: string;
  category_id: string;
  category?: ForumCategory;
  user_id: string;
  user?: User;
  judul: string;
  slug: string;
  konten: string;
  gambar_url?: string[];
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface ForumComment {
  id: string;
  post_id: string;
  user_id: string;
  user?: User;
  parent_id?: string;
  konten: string;
  likes_count: number;
  replies?: ForumComment[];
  created_at: string;
}

export interface AIChatSession {
  id: string;
  user_id: string;
  judul: string;
  model: string;
  created_at: string;
}

export interface AIChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface BadgeType {
  id: string;
  kode: string;
  nama: string;
  icon_url?: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge: BadgeType;
  granted_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}

// ==========================================
// TIER 1: PAYMENT GATEWAY
// ==========================================
export interface PaymentPlan {
  id: string;
  code: string;
  nama: string;
  deskripsi?: string;
  harga: number;
  durasi_hari: number;
  fitur: string[];
  type: 'loker' | 'course' | 'sertifikat' | 'patrol';
  is_active: boolean;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_id?: string;
  plan?: PaymentPlan;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'expired';
  payment_method?: string;
  midtrans_order_id?: string;
  midtrans_transaction_id?: string;
  midtrans_redirect_url?: string;
  paid_at?: string;
  expires_at?: string;
}

export interface CoursePurchase {
  id: string;
  user_id: string;
  payment_id: string;
  course_code: string;
  course_nama: string;
  access_until: string;
  is_active: boolean;
}

// ==========================================
// TIER 2: PATROLI DIGITAL
// ==========================================
export interface PatrolShift {
  id: string;
  user_id: string;
  user?: User;
  shift_date: string;
  shift_type: 'pagi' | 'siang' | 'malam';
  patrol_route?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  start_time?: string;
  end_time?: string;
  total_checkpoints: number;
  completed_checkpoints: number;
  notes?: string;
}

export interface PatrolCheckpoint {
  id: string;
  nama: string;
  lokasi_lat?: number;
  lokasi_lng?: number;
  radius_meters: number;
  qr_code?: string;
  is_active: boolean;
}

export interface PatrolLog {
  id: string;
  shift_id: string;
  checkpoint_id?: string;
  checkpoint?: PatrolCheckpoint;
  user_id: string;
  scan_method: 'gps' | 'qr' | 'manual';
  status: 'ok' | 'skip' | 'missed' | 'issue';
  timestamp: string;
  foto_url?: string;
  catatan?: string;
  lokasi_lat?: number;
  lokasi_lng?: number;
}

// ==========================================
// TIER 2: ABSENSI
// ==========================================
export interface AttendanceLog {
  id: string;
  user_id: string;
  user?: User;
  shift_id?: string;
  type: 'checkin' | 'checkout';
  method: 'qr' | 'gps' | 'manual';
  timestamp: string;
  foto_url?: string;
  lokasi_lat?: number;
  lokasi_lng?: number;
  lokasi_nama?: string;
  device_info?: string;
}

// ==========================================
// TIER 2: DASHBOARD KOMANDAN
// ==========================================
export interface GuardTeam {
  id: string;
  nama_team: string;
  commander_id: string;
  commander?: User;
  perusahaan?: string;
  lokasi?: string;
  is_active: boolean;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  user?: User;
  role: 'komandan' | 'danru' | 'anggota';
  joined_at: string;
}

// ==========================================
// TIER 3: LAPORAN KEJADIAN
// ==========================================
export interface IncidentReport {
  id: string;
  user_id: string;
  user?: User;
  shift_id?: string;
  nomor_laporan?: string;
  jenis_kejadian: 'pencurian' | 'kebakaran' | 'kecelakaan' | 'perkelahian' | 'pengancaman' | 'penyusupan' | 'kerusakan_aset' | 'kehilangan_barang' | 'pelanggaran_sop' | 'kecurigaan' | 'darurat_medis' | 'bencana_alam' | 'pelanggaran_lalu_lintas' | 'lainnya';
  tingkat_darurat: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
  judul: string;
  deskripsi: string;
  lokasi?: string;
  lokasi_lat?: number;
  lokasi_lng?: number;
  foto_url: string[];
  video_url: string[];
  korban_jiwa: number;
  korban_luka: number;
  kerugian_perkiraan?: number;
  tindakan_awal?: string;
  status: 'dilaporkan' | 'diverifikasi' | 'ditangani' | 'selesai' | 'ditutup';
  handled_by?: string;
  handler?: User;
  handled_at?: string;
  resolved_at?: string;
  resolved_notes?: string;
  created_at: string;
}

// ==========================================
// TIER 3: PANIC BUTTON
// ==========================================
export interface PanicAlert {
  id: string;
  user_id: string;
  user?: User;
  type: 'panic' | 'emergency' | 'backup';
  lokasi_lat?: number;
  lokasi_lng?: number;
  lokasi_nama?: string;
  message?: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'false_alarm';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

// ==========================================
// TIER 4: CHAT REAL-TIME
// ==========================================
export interface ChatRoom {
  id: string;
  nama?: string;
  type: 'direct' | 'group' | 'team';
  team_id?: string;
  created_by?: string;
  members?: ChatRoomMember[];
  last_message?: ChatMessage;
}

export interface ChatRoomMember {
  id: string;
  room_id: string;
  user_id: string;
  user?: User;
  last_read_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  user?: User;
  message: string;
  attachment_url?: string;
  type: 'text' | 'image' | 'file' | 'location' | 'system';
  created_at: string;
}
