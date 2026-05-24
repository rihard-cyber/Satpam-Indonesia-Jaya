'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Bell, CheckCheck, Briefcase, MessageCircle, Award, Shield, BookOpen } from 'lucide-react';
import { getTimeAgo } from '@/lib/utils';

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifikasi</h1>
            <p className="text-white/40 mt-1">Aktivitas dan pemberitahuan terbaru</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors">
            <CheckCheck className="w-4 h-4" />
            Tandai semua dibaca
          </button>
        </div>

        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <Card
              key={i}
              variant={notif.is_read ? 'glass' : 'gradient'}
              hover
              className={!notif.is_read ? 'border-gold/20' : ''}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${getIconBg(notif.type)} flex items-center justify-center flex-shrink-0`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{notif.title}</p>
                      <p className="text-sm text-white/50 mt-0.5">{notif.body}</p>
                    </div>
                    {!notif.is_read && <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-2" />}
                  </div>
                  <p className="text-xs text-white/30 mt-2">{getTimeAgo(notif.created_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function getIcon(type: string) {
  const icons = {
    loker: <Briefcase className="w-5 h-5 text-gold" />,
    forum: <MessageCircle className="w-5 h-5 text-blue-400" />,
    sertifikat: <Award className="w-5 h-5 text-green-400" />,
    verifikasi: <Shield className="w-5 h-5 text-gold" />,
    materi: <BookOpen className="w-5 h-5 text-purple-400" />,
  };
  return icons[type as keyof typeof icons] || <Bell className="w-5 h-5 text-white/50" />;
}

function getIconBg(type: string) {
  const bg = {
    loker: 'bg-gold/10',
    forum: 'bg-blue-500/10',
    sertifikat: 'bg-green-500/10',
    verifikasi: 'bg-gold/10',
    materi: 'bg-purple-500/10',
  };
  return bg[type as keyof typeof bg] || 'bg-white/5';
}

const notifications = [
  {
    type: 'loker',
    title: 'Lowongan Baru: Security Officer',
    body: 'PT Secure Properti membuka lowongan untuk posisi Security Officer di Jakarta Pusat.',
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    type: 'forum',
    title: 'Komentar Baru di Post Anda',
    body: 'Ahmad Rizki mengomentari post "Tips Lulus Gada Madya"',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    type: 'sertifikat',
    title: 'Sertifikat Terverifikasi',
    body: 'Sertifikat Gada Pratama Anda telah terverifikasi.',
    is_read: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    type: 'verifikasi',
    title: 'KTA Digital Terverifikasi',
    body: 'KTA Digital Anda telah diverifikasi oleh admin. Badge Verified Satpam aktif.',
    is_read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    type: 'materi',
    title: 'Materi Baru: Turjawali',
    body: 'Modul Turjawali telah tersedia di materi Gada Pratama.',
    is_read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
