'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { BookOpen, Briefcase, MessageCircle, Award, TrendingUp, Shield, ChevronRight, GraduationCap, Star } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentMateri, setRecentMateri] = useState<any[]>([]);
  const [recentLoker, setRecentLoker] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [meRes, materiRes, lokerRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/materi'),
          fetch('/api/loker'),
        ]);
        const me = await meRes.json();
        const materi = await materiRes.json();
        const loker = await lokerRes.json();
        setStats(me.user);
        setRecentMateri((materi.data || []).slice(0, 4));
        setRecentLoker((loker.data || []).slice(0, 2));
      } catch {}
    }
    load();
  }, []);

  const statCards = [
    { label: 'Materi Dipelajari', value: recentMateri.length.toString(), icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Progress Belajar', value: 'Aktif', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Lowongan Tersedia', value: recentLoker.length.toString(), icon: Briefcase, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Tingkatan', value: stats?.tingkatan_nama || 'Satpam', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 mt-1">Selamat datang kembali, {session?.user?.name || 'Satpam Indonesia'}!</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} variant="glass">
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/40">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card variant="gradient" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-gold" /> Materi Tersedia</div>
              </CardTitle>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={() => router.push('/materi')}>Semua</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMateri.map((item: any) => (
                  <div key={item.id} onClick={() => router.push(`/materi/${item.slug}`)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.judul}</p>
                      <p className="text-xs text-white/40">{item.durasi_menit} menit</p>
                    </div>
                    <Button variant="ghost" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                ))}
                {recentMateri.length === 0 && <p className="text-sm text-white/30">Belum ada materi</p>}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-gold" /> Loker Terbaru</div>
                </CardTitle>
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={() => router.push('/loker')}>Lihat</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLoker.map((item: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-gold/20 transition-all">
                      <p className="text-sm font-medium text-white">{item.posisi}</p>
                      <p className="text-xs text-white/40">{item.perusahaan_nama}</p>
                      <p className="text-xs text-gold font-medium mt-1">{item.gaji_min && `Rp ${item.gaji_min} - ${item.gaji_max}`}</p>
                    </div>
                  ))}
                  {recentLoker.length === 0 && <p className="text-sm text-white/30">Belum ada lowongan</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-gold" /> Aksi Cepat</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: 'Belajar Materi', icon: BookOpen, path: '/materi' },
                { label: 'Cari Loker', icon: Briefcase, path: '/loker' },
                { label: 'Forum Diskusi', icon: MessageCircle, path: '/forum' },
                { label: 'AI Assistant', icon: Shield, path: '/ai-assistant' },
                { label: 'Profile', icon: Award, path: '/profile' },
              ].map((action) => (
                <button key={action.label} onClick={() => router.push(action.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <action.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
