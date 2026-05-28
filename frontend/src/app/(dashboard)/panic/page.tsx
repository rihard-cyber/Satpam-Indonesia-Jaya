'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  AlertTriangle, Shield, Heart, Users, Clock, MapPin,
  CheckCircle, X, ArrowLeft, Bell
} from 'lucide-react';
import { formatDateTime, getTimeAgo } from '@/lib/utils';

interface PanicHistory {
  id: string;
  type: string;
  status: string;
  lokasi_nama?: string;
  message?: string;
  created_at: string;
}

export default function PanicButtonPage() {
  const router = useRouter();
  const [history, setHistory] = useState<PanicHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [alertResult, setAlertResult] = useState<{ id: string; type: string } | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {}
      );
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/panic');
      const json = await res.json();
      setHistory(json.data || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePanic = async (type: string) => {
    setActivating(true);
    setCountdown(5);

    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/panic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            lokasi_lat: location?.lat,
            lokasi_lng: location?.lng,
            lokasi_nama: locationName || undefined,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          setAlertResult({ id: json.data.id, type: json.data.type });
          loadHistory();
        }
      } catch {}
      setActivating(false);
    }, 5000);
  };

  const typeConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
    panic: { icon: AlertTriangle, label: 'Minta Bantuan', color: 'text-red-400', bg: 'bg-red-500/20' },
    emergency: { icon: Heart, label: 'Darurat Medis', color: 'text-orange-400', bg: 'bg-orange-500/20' },
    backup: { icon: Users, label: 'Backup', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  };

  const statusBadge: Record<string, { variant: 'danger' | 'success' | 'warning' | 'default'; label: string }> = {
    active: { variant: 'danger', label: 'Aktif' },
    acknowledged: { variant: 'warning', label: 'Diakui' },
    resolved: { variant: 'success', label: 'Selesai' },
    false_alarm: { variant: 'default', label: 'False Alarm' },
  };

  if (alertResult) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card variant="gold" className="max-w-md w-full text-center">
            <CardContent className="py-12">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Alert Terkirim!</h2>
              <p className="text-white/50 mb-2">Alert {typeConfig[alertResult.type]?.label || alertResult.type} telah dikirim ke komandan tim.</p>
              <p className="text-xs text-white/30 mb-6">ID Alert: {alertResult.id}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => { setAlertResult(null); }}>
                  Tutup
                </Button>
                <Button variant="gold" onClick={() => router.push('/komandan')}>
                  Dashboard Komandan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Panic Button</h1>
            <p className="text-white/40 mt-1">Kirim sinyal darurat ke komandan tim</p>
          </div>
        </div>

        <Card variant="glass" className="text-center py-8">
          <CardContent>
            <div className="max-w-md mx-auto">
              {countdown > 0 ? (
                <div className="text-center">
                  <div className="w-40 h-40 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="text-5xl font-bold text-red-400">{countdown}</span>
                  </div>
                  <p className="text-lg text-red-400 font-semibold">Mengirim alert...</p>
                  <p className="text-sm text-white/40 mt-2">Mohon tunggu, alert akan dikirim dalam hitungan detik</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handlePanic('panic')}
                    disabled={activating}
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 shadow-2xl shadow-red-600/40 flex items-center justify-center mx-auto mb-8 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-white mx-auto mb-2 group-hover:animate-pulse" />
                      <span className="text-lg font-bold text-white">PANIC</span>
                    </div>
                  </button>

                  <p className="text-sm text-white/40 mb-6">Tekan tombol panic untuk mengirim sinyal darurat</p>

                  <div className="flex flex-wrap gap-4 justify-center">
                    {Object.entries(typeConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => handlePanic(key)}
                        disabled={activating}
                        className={`flex flex-col items-center gap-2 p-6 rounded-2xl ${config.bg} border border-white/10 hover:scale-105 transition-all disabled:opacity-50 min-w-[120px]`}
                      >
                        <config.icon className={`w-8 h-8 ${config.color}`} />
                        <span className="text-sm font-medium text-white">{config.label}</span>
                      </button>
                    ))}
                  </div>

                  {location && (
                    <p className="text-xs text-white/30 mt-4 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" /> Lokasi terdeteksi: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-gold" /> Riwayat Alert</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-gold border-t-transparent rounded-full" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-8">Belum ada riwayat alert</p>
            ) : (
              <div className="space-y-3">
                {history.map((alert) => {
                  const config = typeConfig[alert.type] || typeConfig.panic;
                  const sb = statusBadge[alert.status] || statusBadge.active;
                  return (
                    <div key={alert.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                        <config.icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{config.label}</span>
                          <Badge variant={sb.variant} size="sm">{sb.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {alert.lokasi_nama && (
                            <span className="text-xs text-white/40 flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.lokasi_nama}</span>
                          )}
                          <span className="text-xs text-white/30 flex items-center gap-1"><Clock className="w-3 h-3" /> {getTimeAgo(alert.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
