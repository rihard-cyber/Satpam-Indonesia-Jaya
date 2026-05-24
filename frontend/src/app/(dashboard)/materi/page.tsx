'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  BookOpen,
  Lock,
  PlayCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  GraduationCap,
  Shield,
  Search,
  Award,
} from 'lucide-react';

const tingkatanList = [
  { kode: 'gada_pratama', nama: 'Gada Pratama', icon: Shield, color: 'from-blue-500 to-blue-700', materiCount: 8, progress: 100 },
  { kode: 'gada_madya', nama: 'Gada Madya', icon: GraduationCap, color: 'from-gold to-gold-dark', materiCount: 10, progress: 45 },
  { kode: 'gada_utama', nama: 'Gada Utama', icon: Award, color: 'from-red-500 to-red-700', materiCount: 9, progress: 0 },
];

export default function MateriPage() {
  const [selectedTingkatan, setSelectedTingkatan] = useState('gada_pratama');
  const [searchQuery, setSearchQuery] = useState('');

  const selected = tingkatanList.find((t) => t.kode === selectedTingkatan);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Materi Satpam</h1>
          <p className="text-white/40 mt-1">LMS Gada Pratama, Madya & Utama</p>
        </div>

        {/* Tingkatan Tabs */}
        <div className="grid grid-cols-3 gap-3">
          {tingkatanList.map((t) => (
            <button
              key={t.kode}
              onClick={() => setSelectedTingkatan(t.kode)}
              className={`relative p-4 rounded-2xl border text-left transition-all ${
                selectedTingkatan === t.kode
                  ? 'border-gold/30 bg-gradient-to-br from-navy-700 to-navy-800 shadow-lg shadow-gold/5'
                  : 'border-white/5 bg-navy-800/50 hover:bg-navy-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                  <t.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{t.nama}</p>
                  <p className="text-xs text-white/40">{t.materiCount} Materi</p>
                </div>
                {t.progress > 0 && (
                  <div className="w-8 h-8 rounded-full border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold">{t.progress}%</span>
                  </div>
                )}
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all"
                  style={{ width: `${t.progress}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
          <Search className="w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder={`Cari materi ${selected?.nama || '...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
          />
        </div>

        {/* Materi List */}
        <div className="space-y-3">
          {(selectedTingkatan === 'gada_pratama' ? materiPratama : selectedTingkatan === 'gada_madya' ? materiMadya : materiUtama).map((materi, i) => (
            <Card
              key={materi.judul}
              variant="glass"
              hover
              className="group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-colors">
                  {materi.isLocked ? (
                    <Lock className="w-5 h-5 text-white/20" />
                  ) : materi.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-gold" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white group-hover:text-gold transition-colors">
                      {materi.judul}
                    </h3>
                    {materi.isCompleted && <Badge variant="success" size="sm">Selesai</Badge>}
                  </div>
                  <p className="text-xs text-white/40 mt-1 line-clamp-2">{materi.deskripsi}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-white/30">
                      <Clock className="w-3 h-3" />
                      {materi.durasi}
                    </div>
                    {materi.isCompleted && materi.nilai && (
                      <Badge variant="gold" size="sm">Nilai: {materi.nilai}</Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant={materi.isLocked ? 'ghost' : 'primary'}
                  size="sm"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  disabled={materi.isLocked}
                >
                  {materi.isCompleted ? 'Ulangi' : 'Mulai'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

type MateriItem = {
  judul: string;
  deskripsi: string;
  durasi: string;
  isCompleted: boolean;
  isLocked: boolean;
  nilai?: string;
};

const materiPratama: MateriItem[] = [
  { judul: 'Sejarah Satpam Indonesia', deskripsi: 'Mempelajari sejarah berdirinya Satpam Indonesia, pendiri Awaloedin Djamin, dan perkembangannya.', durasi: '15 menit', isCompleted: true, isLocked: false, nilai: 'A' },
  { judul: 'Tupoksi Satpam', deskripsi: 'Tugas, Pokok, dan Fungsi Satpam dalam lingkungan kerja.', durasi: '20 menit', isCompleted: true, isLocked: false, nilai: 'A' },
  { judul: 'Turjawali', deskripsi: 'Pengaturan, Penjagaan, Pengawalan, dan Patroli.', durasi: '25 menit', isCompleted: false, isLocked: false },
  { judul: 'Bela Diri Dasar', deskripsi: 'Teknik dasar bela diri untuk Satpam.', durasi: '30 menit', isCompleted: false, isLocked: false },
  { judul: 'Penggunaan Borgol & Tongkat', deskripsi: 'Teknik penggunaan borgol dan tongkat yang benar.', durasi: '20 menit', isCompleted: false, isLocked: false },
  { judul: 'Penanganan Tamu', deskripsi: 'Prosedur penanganan tamu di lingkungan kerja.', durasi: '15 menit', isCompleted: false, isLocked: false },
  { judul: 'Pengamanan Gedung & Aset', deskripsi: 'Strategi pengamanan gedung dan aset perusahaan.', durasi: '25 menit', isCompleted: false, isLocked: false },
  { judul: 'Public Service & Etika Security', deskripsi: 'Pelayanan publik dan etika profesi security.', durasi: '20 menit', isCompleted: false, isLocked: false },
];

const materiMadya: MateriItem[] = [
  { judul: 'Leadership', deskripsi: 'Kepemimpinan untuk Danru dan Madya.', durasi: '30 menit', isCompleted: false, isLocked: false },
  { judul: 'Manajemen Risiko', deskripsi: 'Identifikasi, analisa, dan mitigasi risiko keamanan.', durasi: '35 menit', isCompleted: false, isLocked: false },
  { judul: 'Investigasi Internal', deskripsi: 'Teknik investigasi internal perusahaan.', durasi: '40 menit', isCompleted: false, isLocked: false },
  { judul: 'Analisa Ancaman', deskripsi: 'Menganalisa potensi ancaman keamanan.', durasi: '25 menit', isCompleted: false, isLocked: false },
  { judul: 'Crowd Control', deskripsi: 'Pengendalian massa dan keramaian.', durasi: '30 menit', isCompleted: false, isLocked: false },
  { judul: 'Emergency Response', deskripsi: 'Tanggap darurat dan prosedur evakuasi.', durasi: '35 menit', isCompleted: false, isLocked: false },
  { judul: 'SOP Perusahaan', deskripsi: 'Standar Operasional Prosedur perusahaan.', durasi: '20 menit', isCompleted: false, isLocked: false },
  { judul: 'Intelijen Dasar', deskripsi: 'Dasar-dasar intelijen keamanan.', durasi: '30 menit', isCompleted: false, isLocked: false },
  { judul: 'Audit Keamanan', deskripsi: 'Melakukan audit sistem keamanan.', durasi: '35 menit', isCompleted: false, isLocked: false },
  { judul: 'Incident Report', deskripsi: 'Pembuatan laporan insiden keamanan.', durasi: '20 menit', isCompleted: false, isLocked: false },
];

const materiUtama: MateriItem[] = [
  { judul: 'Strategic Security Management', deskripsi: 'Manajemen keamanan strategis tingkat atas.', durasi: '45 menit', isCompleted: false, isLocked: true },
  { judul: 'Crisis Management', deskripsi: 'Penanganan krisis perusahaan.', durasi: '40 menit', isCompleted: false, isLocked: true },
  { judul: 'Corporate Security', deskripsi: 'Keamanan korporasi dan bisnis.', durasi: '35 menit', isCompleted: false, isLocked: true },
  { judul: 'Executive Protection', deskripsi: 'Perlindungan eksekutif dan VVIP.', durasi: '40 menit', isCompleted: false, isLocked: true },
  { judul: 'Cyber Security Awareness', deskripsi: 'Kesadaran keamanan siber.', durasi: '30 menit', isCompleted: false, isLocked: true },
  { judul: 'Business Continuity', deskripsi: 'Kelangsungan bisnis dan pemulihan bencana.', durasi: '35 menit', isCompleted: false, isLocked: true },
  { judul: 'Counter Terrorism Awareness', deskripsi: 'Kesadaran kontra-terorisme.', durasi: '40 menit', isCompleted: false, isLocked: true },
  { judul: 'Risk Intelligence', deskripsi: 'Intelijen risiko dan analisis prediktif.', durasi: '35 menit', isCompleted: false, isLocked: true },
  { judul: 'National Security Analysis', deskripsi: 'Analisis keamanan nasional.', durasi: '45 menit', isCompleted: false, isLocked: true },
];
