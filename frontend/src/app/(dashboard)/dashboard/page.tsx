'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  BookOpen,
  Briefcase,
  MessageCircle,
  Award,
  TrendingUp,
  Clock,
  Shield,
  ChevronRight,
  GraduationCap,
  Users,
  Star,
} from 'lucide-react';

const stats = [
  { label: 'Materi Dipelajari', value: '12', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Progress Belajar', value: '45%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Lamaran Aktif', value: '3', icon: Briefcase, color: 'text-gold', bg: 'bg-gold/10' },
  { label: 'Sertifikat', value: '5', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const recentMateri = [
  { judul: 'Sejarah Satpam Indonesia', durasi: '15 menit', progress: 100 },
  { judul: 'Tupoksi Satpam', durasi: '20 menit', progress: 100 },
  { judul: 'Turjawali', durasi: '25 menit', progress: 60 },
  { judul: 'Bela Diri Dasar', durasi: '30 menit', progress: 30 },
];

const recentLoker = [
  { posisi: 'Security Officer', perusahaan: 'PT Secure Properti', lokasi: 'Jakarta Pusat', gaji: 'Rp 4.5 - 5.5 JT' },
  { posisi: 'Danru', perusahaan: 'PT Garda Utama', lokasi: 'Bandung', gaji: 'Rp 5 - 6.5 JT' },
];

const forumActivity = [
  { user: 'Budi Santoso', action: 'membuat post baru', judul: 'Tips passing PPS', waktu: '2 jam' },
  { user: 'Ahmad Rizki', action: 'berkomentar di', judul: 'Pengalaman Danru', waktu: '4 jam' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 mt-1">Selamat datang kembali, Satpam Indonesia!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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
          {/* Recent Materi */}
          <Card variant="gradient" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gold" />
                  Lanjutkan Belajar
                </div>
              </CardTitle>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Semua
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMateri.map((item) => (
                  <div
                    key={item.judul}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.judul}</p>
                      <p className="text-xs text-white/40">{item.durasi}</p>
                    </div>
                    <div className="w-24">
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/40 mt-0.5 text-right">{item.progress}%</p>
                    </div>
                    {item.progress === 100 && (
                      <Badge variant="success" size="sm">Selesai</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Loker */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gold" />
                    Loker Terbaru
                  </div>
                </CardTitle>
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Lihat
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLoker.map((item) => (
                    <div
                      key={item.posisi}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-gold/20 transition-all"
                    >
                      <p className="text-sm font-medium text-white">{item.posisi}</p>
                      <p className="text-xs text-white/40">{item.perusahaan}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-white/30">{item.lokasi}</p>
                        <p className="text-xs text-gold font-medium">{item.gaji}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forum Activity */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gold" />
                    Aktivitas Forum
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forumActivity.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-black">{item.user[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/70">
                          <span className="font-medium text-white">{item.user}</span>{' '}
                          {item.action}{' '}
                          <span className="text-gold">{item.judul}</span>
                        </p>
                        <p className="text-xs text-white/30">{item.waktu} lalu</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold" />
                Aksi Cepat
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/5 transition-all group"
                >
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

const quickActions = [
  { label: 'Belajar Materi', icon: BookOpen },
  { label: 'Cari Loker', icon: Briefcase },
  { label: 'Forum Diskusi', icon: MessageCircle },
  { label: 'AI Assistant', icon: Shield },
  { label: 'Upload Sertifikat', icon: Award },
];
