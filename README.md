# SATPAM INDONESIA JAYA

Platform Digital Satpam Nasional — Komunitas, Edukasi, Karier & Sertifikasi.

## Deploy ke Vercel (1 menit)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fsatpam-indonesia-jaya&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&envDescription=Supabase%20project%20credentials)

### 1. Setup Supabase (gratis)
1. Daftar di [supabase.com](https://supabase.com)
2. Buat project baru
3. Buka **SQL Editor** → paste isi `supabase/migrations/00001_schema.sql` → Run
4. Buka **Project Settings** → **API** → copy URL & anon key

### 2. Deploy ke Vercel
1. Push repo ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Tambahkan environment variables dari Supabase
4. Deploy — selesai!

### 3. Jalankan Lokal
```bash
npm install
cp .env.example .env.local  # isi dengan credentials Supabase
npm run dev                  # → http://localhost:3000
```

## Struktur Project
```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── (dashboard)/     # Dashboard, Materi, Loker, Forum, AI, Profile
│   ├── landing/         # Landing page
│   └── api/             # Next.js API Routes (backend)
├── components/
│   ├── ui/              # Reusable UI (Button, Card, Input, etc.)
│   └── layout/          # Sidebar, Navbar, Layouts
├── lib/
│   ├── supabase/        # Supabase client (browser, server, admin)
│   ├── api-client.ts    # Frontend API client
│   └── utils.ts         # Utility functions
├── store/               # Zustand state management
└── types/               # TypeScript types
```

## Tech Stack
- **Next.js 16** — Full-stack React framework
- **Tailwind CSS v4** — Utility-first CSS
- **Supabase** — Auth, Database, Storage
- **Zustand** — State management
- **Lucide React** — Icons

## License
MIT
