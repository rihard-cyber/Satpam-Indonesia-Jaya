# Flowchart Sistem - SATPAM INDONESIA JAYA

## 1. Authentication Flow

```mermaid
flowchart TD
    A[Mulai] --> B{Punya Akun?}
    B -->|Tidak| C[Register]
    C --> C1[Isi Form Pendaftaran]
    C1 --> C2{Nama Lengkap, Email,\nNo WA, Password}
    C2 --> C3[Pilih Tingkatan:\nGada Pratama / Madya / Utama]
    C3 --> C4[Centang Syarat & Ketentuan]
    C4 --> C5[Kirim OTP ke Email & WA]
    C5 --> C6{Verifikasi OTP}
    C6 -->|Gagal| C7[Resend OTP]
    C7 --> C5
    C6 -->|Berhasil| C8[Akun Terverifikasi]
    C8 --> D[Dashboard Home]
    
    B -->|Ya| E[Login]
    E --> E1{Pilih Metode}
    E1 -->|Email| E2[Input Email & Password]
    E1 -->|Google| E3[OAuth Google Login]
    E1 -->|WhatsApp| E4[Input No WA + OTP]
    E2 --> E5{Validasi}
    E3 --> E5
    E4 --> E5
    E5 -->|Gagal| E6[Tampilkan Error]
    E6 --> E
    E5 -->|Berhasil| D
```

## 2. Profile & Digital KTA Flow

```mermaid
flowchart TD
    A[Profile Page] --> B[Edit Profile]
    B --> B1[Foto Profil]
    B --> B2[Data Diri]
    B --> B3[Pengalaman & Keahlian]
    B --> B4[Pengaturan]
    
    A --> C[KTA Digital]
    C --> C1[Upload KTA]
    C1 --> C2[Input Nomor KTA]
    C1 --> C3[Input ID KTA]
    C1 --> C4[Pilih Tingkatan]
    C1 --> C5[Tanggal Dikeluarkan]
    C1 --> C6[Tanggal Expired]
    C1 --> C7[Upload Foto Depan]
    C1 --> C8[Upload Foto Belakang]
    C1 --> C9[Submit Verifikasi]
    C9 --> C10{Verifikasi Admin}
    C10 -->|Pending| C11[Menunggu Verifikasi]
    C10 -->|Verified| C12[KTA Terverifikasi + Badge]
    C10 -->|Rejected| C13[Perbaiki Dokumen]
    C13 --> C1
    
    A --> D[Sertifikat]
    D --> D1[Upload Sertifikat]
    D1 --> D2[Jenis Sertifikat]
    D2 --> D3[Ijazah Satpam]
    D2 --> D4[Gada Pratama/Madya/Utama]
    D2 --> D5[Bela Diri / Damkar / First Aid]
    D2 --> D6[Upload File]
    D6 --> D7[Verifikasi]
```

## 3. LMS / Materi Flow

```mermaid
flowchart TD
    A[Materi Satpam] --> B{Pilih Tingkatan}
    B --> C[Gada Pratama]
    B --> D[Gada Madya]
    B --> E[Gada Utama]
    
    C --> C1[Daftar Materi Pratama]
    C1 --> C2[Sejarah Satpam]
    C1 --> C3[Tupoksi]
    C1 --> C4[Turjawali]
    C1 --> C5[Bela Diri Dasar]
    C1 --> C6[Borgol & Tongkat]
    C1 --> C7[Penanganan Tamu]
    C1 --> C8[Pengamanan Gedung]
    C1 --> C9[Public Service]
    
    D --> D1[Daftar Materi Madya]
    D1 --> D2[Leadership]
    D1 --> D3[Manajemen Risiko]
    D1 --> D4[Investigasi Internal]
    D1 --> D5[Analisa Ancaman]
    D1 --> D6[Crowd Control]
    D1 --> D7[Emergency Response]
    D1 --> D8[SOP Perusahaan]
    D1 --> D9[Intelijen Dasar]
    D1 --> D10[Audit Keamanan]
    D1 --> D11[Incident Report]
    
    E --> E1[Daftar Materi Utama]
    E1 --> E2[Strategic Security Mgmt]
    E1 --> E3[Crisis Management]
    E1 --> E4[Corporate Security]
    E1 --> E5[Executive Protection]
    E1 --> E6[Cyber Security]
    E1 --> E7[Business Continuity]
    E1 --> E8[Counter Terrorism]
    E1 --> E9[Risk Intelligence]
    E1 --> E10[National Security]
    
    C2 --> F[Baca Materi]
    C3 --> F
    D2 --> F
    E2 --> F
    
    F --> G[Tandai Selesai]
    G --> H[Progress Tersimpan]
    H --> I{100% Selesai?}
    I -->|Ya| J[Sertifikat Penyelesaian]
    I -->|Tidak| K[Lanjutkan Belajar]
```

## 4. Portal Loker Flow

```mermaid
flowchart TD
    A[Portal Loker] --> B[Pencari Kerja]
    A --> C[Perusahaan / HRD]
    
    B --> B1[Daftar Lowongan]
    B1 --> B2[Filter: Penempatan, Gaji,\nPendidikan, Shift]
    B2 --> B3[Detail Lowongan]
    B3 --> B4[Apply Lamaran]
    B4 --> B5[Upload CV]
    B4 --> B6[Upload Sertifikat]
    B4 --> B7[Tulis Catatan]
    B4 --> B8[Submit]
    B8 --> B9[Status: Diproses]
    B9 --> B10{Update dari HRD}
    B10 -->|Interview| B11[Jadwal Interview]
    B10 -->|Diterima| B12[Selamat!]
    B10 -->|Ditolak| B13[Coba Loker Lain]
    B3 --> B14[Chat HRD]
    
    C --> C1[Buat Lowongan]
    C1 --> C2[Form Lengkap Perusahaan]
    C1 --> C3[Detail Posisi & Persyaratan]
    C1 --> C4[Kontak HRD]
    C1 --> C5[Publish Lowongan]
    C5 --> C6[Daftar Pelamar]
    C6 --> C7[Review Lamaran]
    C7 --> C8[Update Status]
    C8 --> C9[Kirim Pesan ke Pelamar]
```

## 5. AI Assistant Flow

```mermaid
flowchart TD
    A[AI Assistant] --> B[New Chat]
    A --> C[History Chat]
    
    B --> D[Input Pertanyaan]
    D --> E{AI Processing}
    E --> F[Knowledge Base Security]
    E --> G[Gemini / OpenAI API]
    
    F --> H[Generate Jawaban]
    G --> H
    
    H --> I[Tampilkan Response]
    I --> J{Ada Pertanyaan Lagi?}
    J -->|Ya| D
    J -->|Tidak| K[Simpan Session]
    
    D --> D1[Contoh Pertanyaan:]
    D1 --> D2["Apa tugas Danru?"]
    D1 --> D3["Cara membuat incident report?"]
    D1 --> D4["Apa itu Turjawali?"]
    D1 --> D5["SOP kehilangan barang?"]
    D1 --> D6["Perbedaan Gada Madya & Utama?"]
```

## 6. Forum Komunitas Flow

```mermaid
flowchart TD
    A[Forum] --> B[Kategori Forum]
    B --> C[Tanya Jawab]
    B --> D[Berbagi Pengalaman]
    B --> E[Info Training]
    B --> F[Info Loker]
    B --> G[Keamanan Nasional]
    B --> H[Bela Diri]
    B --> I[Peralatan Security]
    
    C --> J[Daftar Post]
    D --> J
    E --> J
    J --> K[Baca Post]
    K --> L[Like]
    K --> M[Komentar]
    K --> N[Reply Komentar]
    K --> O[Share]
    
    A --> P[Buat Post Baru]
    P --> P1[Pilih Kategori]
    P --> P2[Judul]
    P --> P3[Konten]
    P --> P4[Upload Gambar]
    P --> P5[Publish]
```

## 7. Struktur Navigasi Aplikasi

```mermaid
flowchart TD
    A[Aplikasi SATPAM INDONESIA JAYA] --> B[Home / Dashboard]
    A --> C[Materi Satpam]
    A --> D[Loker]
    A --> E[Forum]
    A --> F[AI Assistant]
    A --> G[Sertifikat]
    A --> H[Profile]
    A --> I[Notifikasi]
    
    B --> B1[Statistik Belajar]
    B --> B2[Materi Terbaru]
    B --> B3[Loker Terbaru]
    B --> B4[Aktivitas Forum]
    B --> B5[Progress Belajar]
    
    C --> C1[Gada Pratama]
    C --> C2[Gada Madya]
    C --> C3[Gada Utama]
    C --> C4[Progress Saya]
    
    D --> D1[Cari Loker]
    D --> D2[Lamaran Saya]
    D --> D3[Pasang Loker - HRD]
    
    E --> E1[Semua Post]
    E --> E2[Kategori]
    E --> E3[Buat Post]
    E --> E4[Post Saya]
    
    H --> H1[Edit Profile]
    H --> H2[KTA Digital]
    H --> H3[Sertifikat]
    H --> H4[Badge]
    H --> H5[Pengaturan]
    
    I --> I1[Notifikasi Baru]
    I --> I2[History Notifikasi]
```

## 8. Arsitektur Sistem

```mermaid
flowchart LR
    subgraph Frontend
        A[Next.js App]
        B[React Native\nMobile App]
    end
    
    subgraph Backend
        C[Next.js API Routes\natau Laravel API]
        D[REST API / GraphQL]
    end
    
    subgraph Services
        E[Google OAuth]
        F[Gemini AI]
        G[OpenAI API]
        H[WhatsApp API]
        I[SMTP Email]
    end
    
    subgraph Storage
        J[(PostgreSQL)]
        K[(Firebase Storage\n/ AWS S3)]
        L[(Redis Cache)]
    end
    
    A --> D
    B --> D
    D --> C
    C --> J
    C --> K
    C --> L
    C --> E
    C --> F
    C --> G
    C --> H
    C --> I
```

## 9. Struktur Folder Project

```
satpam-indonesia-jaya/
├── frontend/                          # Next.js Web App
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── src/
│   │   ├── app/                       # App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── materi/
│   │   │   │   ├── loker/
│   │   │   │   ├── forum/
│   │   │   │   ├── ai-assistant/
│   │   │   │   ├── sertifikat/
│   │   │   │   ├── profile/
│   │   │   │   └── notifications/
│   │   │   ├── landing/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                    # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   ├── auth/
│   │   │   ├── materi/
│   │   │   ├── loker/
│   │   │   ├── forum/
│   │   │   ├── ai-assistant/
│   │   │   ├── profile/
│   │   │   └── sertifikat/
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── store/                     # State management
│   │   └── styles/
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── backend/                           # Laravel API (alternatif)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   ├── AuthController.php
│   │   │   │   │   ├── ProfileController.php
│   │   │   │   │   ├── MateriController.php
│   │   │   │   │   ├── LokerController.php
│   │   │   │   │   ├── ForumController.php
│   │   │   │   │   ├── AIController.php
│   │   │   │   │   ├── SertifikatController.php
│   │   │   │   │   ├── NotificationController.php
│   │   │   │   │   └── AdminController.php
│   │   │   │   └── Controller.php
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── composer.json
│
├── database/
│   └── schema.sql                     # Full PostgreSQL schema
│
├── docs/
│   ├── ERD.md
│   ├── FLOWCHART.md
│   ├── API.md
│   ├── ROADMAP.md
│   └── PITCH_DECK.md
│
├── mobile/                            # React Native / Expo
│   ├── app/
│   ├── components/
│   ├── screens/
│   └── package.json
│
└── README.md
```

## 10. Color System

```mermaid
flowchart LR
    subgraph "Theme Colors"
        A["#1A1A2E\nNavy Dark"]
        B["#16213E\nNavy Medium"]
        C["#0F3460\nNavy Blue"]
        D["#D4AF37\nGold"]
        E["#FFFFFF\nWhite"]
        F["#000000\nBlack"]
        G["#E94560\nAccent Red"]
    end
```
