'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Briefcase,
  MessageCircle,
  Bot,
  Award,
  ChevronRight,
  Star,
  Users,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="font-bold text-white">Satpam Indonesia</span>
                <span className="text-gold font-bold ml-1">JAYA</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-white/60 hover:text-gold transition-colors">
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-gold to-gold-dark text-black rounded-xl hover:from-gold-light hover:to-gold transition-all"
              >
                Daftar Gratis
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-white/50"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-white/5 bg-navy-900">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="block text-sm text-white/60 hover:text-gold py-2">
                  {link.label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <Link href="/login" className="block w-full text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/70">
                  Masuk
                </Link>
                <Link href="/register" className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-black text-sm font-medium">
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-sm text-gold mb-8">
            <Star className="w-4 h-4" />
            Platform Digital Satpam No. 1 di Indonesia
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Platform Digital
            <br />
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Satpam Indonesia
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
            Komunitas, Edukasi, Karier & Sertifikasi dalam satu platform.
            Untuk seluruh Satpam Indonesia, dari Gada Pratama hingga Gada Utama.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-gold to-gold-dark text-black rounded-2xl hover:from-gold-light hover:to-gold transition-all shadow-xl shadow-gold/20"
            >
              Daftar Gratis
              <ChevronRight className="w-5 h-5 inline ml-1" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-base font-medium rounded-2xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              Lihat Demo
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> Gratis Selamanya
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> No Credit Card
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> 500K+ Anggota
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500K+', label: 'Satpam Aktif' },
              { value: '1.000+', label: 'Materi & Modul' },
              { value: '50.000+', label: 'Lowongan Tersedia' },
              { value: '200+', label: 'Perusahaan Mitra' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-gold">{stat.value}</p>
                <p className="text-sm text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Semua Kebutuhan Satpam dalam Satu Aplikasi</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Dari belajar materi hingga cari kerja, semua ada di sini.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 border border-white/5 hover:border-gold/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materi Preview */}
      <section className="py-24 px-4 bg-gradient-to-b from-navy-900 to-navy-800/50" id="materi">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">LMS Gada Pratama - Utama</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Kurikulum lengkap sesuai standar nasional.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tingkatanPreview.map((t) => (
              <div key={t.nama} className="p-8 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 border border-white/5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4`}>
                  <t.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{t.nama}</h3>
                <ul className="space-y-2">
                  {t.materi.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-sm text-white/40">
                      <CheckCircle className="w-4 h-4 text-green-400/50" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20">
            <h2 className="text-4xl font-bold mb-4">Siap Bergabung?</h2>
            <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
              Jadilah bagian dari komunitas Satpam Indonesia terbesar. Gratis selamanya.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-gradient-to-r from-gold to-gold-dark text-black rounded-2xl hover:from-gold-light hover:to-gold transition-all shadow-xl shadow-gold/20"
            >
              Daftar Sekarang
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Shield className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm text-white/30">
                &copy; 2026 Satpam Indonesia JAYA. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Bantuan'].map((item) => (
                <a key={item} href="#" className="text-sm text-white/30 hover:text-gold transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const navLinks = [
  { href: '#features', label: 'Fitur' },
  { href: '#materi', label: 'Materi' },
  { href: '/loker', label: 'Loker' },
  { href: '/forum', label: 'Forum' },
];

const features = [
  { icon: BookOpen, title: 'LMS Satpam Nasional', description: 'Kurikulum lengkap Gada Pratama, Madya, dan Utama dengan modul interaktif dan video pembelajaran.' },
  { icon: Briefcase, title: 'Portal Loker Security', description: 'Ribuan lowongan security dari perusahaan terpercaya di seluruh Indonesia. Apply langsung dari aplikasi.' },
  { icon: MessageCircle, title: 'Forum Komunitas', description: 'Diskusi, berbagi pengalaman, dan bertanya dengan sesama Satpam dari seluruh Indonesia.' },
  { icon: Bot, title: 'AI Assistant Security', description: 'Tanya apapun tentang keamanan, prosedur, dan tugas Satpam. Didukung AI canggih.' },
  { icon: Award, title: 'Sertifikat & KTA Digital', description: 'Simpan dan verifikasi KTA, sertifikat pelatihan, dan dokumen penting secara digital.' },
  { icon: Shield, title: 'Profile Digital Satpam', description: 'Buat profile profesional, tampilkan pengalaman, keahlian, dan badge verifikasi.' },
];

const tingkatanPreview = [
  {
    nama: 'Gada Pratama',
    icon: Shield,
    color: 'from-blue-500 to-blue-700',
    materi: ['Sejarah Satpam Indonesia', 'Tupoksi & Turjawali', 'Bela Diri Dasar', 'Penanganan Tamu', 'Etika Security'],
  },
  {
    nama: 'Gada Madya',
    icon: Users,
    color: 'from-gold to-gold-dark',
    materi: ['Leadership', 'Manajemen Risiko', 'Investigasi Internal', 'Crowd Control', 'Incident Report'],
  },
  {
    nama: 'Gada Utama',
    icon: Award,
    color: 'from-red-500 to-red-700',
    materi: ['Strategic Security', 'Crisis Management', 'Executive Protection', 'Cyber Security', 'Business Continuity'],
  },
];
