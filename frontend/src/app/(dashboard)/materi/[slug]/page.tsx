'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  BookOpen,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  MessageCircle,
  Download,
} from 'lucide-react';

export default function MateriDetailPage() {
  const params = useParams();
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>
            Kembali
          </Button>
          <Badge variant="gold" size="md">Gada Pratama</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="gradient">
              <CardContent>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Sejarah Satpam Indonesia
                </h1>
                <div className="flex items-center gap-4 text-sm text-white/40 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    15 menit
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Modul Teori
                  </div>
                </div>

                <div className="aspect-video rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 border border-white/5 flex items-center justify-center mb-6">
                  <button className="w-16 h-16 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center hover:bg-gold/30 transition-colors">
                    <PlayCircle className="w-8 h-8 text-gold" />
                  </button>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-4">Sejarah Berdirinya Satpam Indonesia</h3>
                  <div className="text-white/60 text-sm leading-relaxed space-y-4">
                    <p>
                      Satuan Pengamanan (Satpam) Indonesia didirikan pada tahun 1980 oleh Prof. Dr. H. Awaloedin Djamin, M.Si., 
                      seorang akademisi dan praktisi keamanan terkemuka di Indonesia.
                    </p>
                    <p>
                      Awal mula terbentuknya Satpam dilatarbelakangi oleh kebutuhan akan tenaga keamanan yang profesional 
                      dan terstandarisasi di lingkungan perumahan, perkantoran, dan industri di Indonesia.
                    </p>
                    <p>
                      Pada tahun 1981, didirikanlah Lembaga Pendidikan dan Pelatihan (Lemdiklat) Satpam untuk mencetak 
                      anggota Satpam yang berkualitas dan memiliki kompetensi standar nasional.
                    </p>
                    <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
                      <p className="font-medium text-gold">
                        Poin Penting:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Tahun Berdiri: 1980</li>
                        <li>Pendiri: Prof. Dr. H. Awaloedin Djamin</li>
                        <li>Lembaga: Lemdiklat Satpam (1981)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gold" />
                    Diskusi Materi
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-gold/50"
                  rows={3}
                  placeholder="Tulis pertanyaan atau diskusi tentang materi ini..."
                />
                <div className="flex justify-end mt-3">
                  <Button variant="gold" size="sm">Kirim</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
                  <div className="w-0 h-full rounded-full bg-gradient-to-r from-gold to-gold-dark" />
                </div>
                <p className="text-sm text-white/40">0% selesai</p>
                <Button
                  fullWidth
                  variant={isCompleted ? 'secondary' : 'gold'}
                  className="mt-4"
                  onClick={() => setIsCompleted(!isCompleted)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isCompleted ? 'Selesai' : 'Tandai Selesai'}
                </Button>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Materi Terkait</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {relatedMateri.map((m) => (
                    <button
                      key={m.judul}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <BookOpen className="w-4 h-4 text-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{m.judul}</p>
                        <p className="text-xs text-white/30">{m.durasi}</p>
                      </div>
                      {m.isCompleted && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const relatedMateri = [
  { judul: 'Tupoksi Satpam', durasi: '20 menit', isCompleted: false },
  { judul: 'Turjawali', durasi: '25 menit', isCompleted: false },
  { judul: 'Bela Diri Dasar', durasi: '30 menit', isCompleted: false },
];
