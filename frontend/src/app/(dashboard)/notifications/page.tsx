'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { Bell, CheckCheck, Info, AlertTriangle, Award, Briefcase, MessageCircle, Shield } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(j => { setNotifications(j.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'all', is_read: true }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const icons: Record<string, any> = { info: Info, alert: AlertTriangle, award: Award, briefcase: Briefcase, message: MessageCircle, shield: Shield };
  const colors: Record<string, string> = { info: 'text-blue-400', alert: 'text-red-400', award: 'text-gold', briefcase: 'text-green-400', message: 'text-purple-400', shield: 'text-gold' };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifikasi</h1>
            <p className="text-white/40 mt-1">Pemberitahuan dan aktivitas terbaru</p>
          </div>
          {notifications.some(n => !n.is_read) && (
            <Button variant="ghost" size="sm" leftIcon={<CheckCheck className="w-4 h-4" />} onClick={markAllRead}>
              Semua Dibaca
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
        ) : notifications.length === 0 ? (
          <Card variant="glass">
            <CardContent>
              <div className="flex flex-col items-center py-12">
                <Bell className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/40">Belum ada notifikasi</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((n: any) => {
              const Icon = icons[n.type] || Info;
              const color = colors[n.type] || 'text-white';
              return (
                <Card key={n.id} variant={n.is_read ? 'glass' : 'gradient'} hover>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center ${!n.is_read ? 'ring-2 ring-gold/30' : ''}`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{n.title}</p>
                        {!n.is_read && <Badge variant="gold" size="sm">Baru</Badge>}
                      </div>
                      {n.body && <p className="text-xs text-white/50 mt-1">{n.body}</p>}
                      <p className="text-xs text-white/20 mt-1">{new Date(n.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
