'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  QrCode,
  MapPin,
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  Loader2,
  Smartphone,
  Camera,
} from 'lucide-react';

interface AttendanceLog {
  id: string;
  type: 'checkin' | 'checkout';
  method: string;
  timestamp: string;
  foto_url: string | null;
  lokasi_lat: number | null;
  lokasi_lng: number | null;
  lokasi_nama: string | null;
  device_info: string | null;
}

export default function AbsensiPage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    loadData();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [logsRes, qrRes] = await Promise.all([
        fetch(`/api/absensi?date=${today}`),
        fetch('/api/absensi/qr-code'),
      ]);
      const logsJson = await logsRes.json();
      const qrJson = await qrRes.json();
      setLogs(logsJson.data || []);
      setQrData(qrJson.token || null);
    } catch {}
    setLoading(false);
    setQrLoading(false);
  }

  async function handleAbsensi(type: 'checkin' | 'checkout') {
    setSubmitting(true);
    try {
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          method: 'gps',
          lokasi_lat: location?.lat || null,
          lokasi_lng: location?.lng || null,
          lokasi_nama: locationName || null,
          device_info: navigator.userAgent,
        }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch {}
    setSubmitting(false);
  }

  const sudahCheckin = logs.some((l) => l.type === 'checkin');
  const sudahCheckout = logs.some((l) => l.type === 'checkout');

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white">Absensi</h1>
          <p className="text-white/40 mt-1">Check-in / Check-out harian</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card variant="gold">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-gold" />
                  QR Code Absensi
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {qrLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                </div>
              ) : qrData ? (
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-white rounded-xl p-3 mb-4 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 bg-white relative overflow-hidden">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect x="5" y="5" width="30" height="30" fill="#000" rx="2" />
                            <rect x="10" y="10" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="22" y="10" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="10" y="22" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="65" y="5" width="30" height="30" fill="#000" rx="2" />
                            <rect x="70" y="10" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="82" y="10" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="70" y="22" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="5" y="65" width="30" height="30" fill="#000" rx="2" />
                            <rect x="10" y="70" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="22" y="70" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="10" y="82" width="8" height="8" fill="#fff" rx="1" />
                            <rect x="45" y="45" width="10" height="10" fill="#000" rx="1" />
                            <rect x="40" y="40" width="20" height="4" fill="#000" rx="1" />
                            <rect x="40" y="56" width="20" height="4" fill="#000" rx="1" />
                            <rect x="40" y="40" width="4" height="20" fill="#000" rx="1" />
                            <rect x="56" y="40" width="4" height="20" fill="#000" rx="1" />
                            <rect x="50" y="68" width="15" height="6" fill="#000" rx="1" />
                            <rect x="55" y="76" width="6" height="10" fill="#000" rx="1" />
                            <rect x="30" y="55" width="6" height="6" fill="#000" rx="1" />
                            <rect x="68" y="55" width="10" height="6" fill="#000" rx="1" />
                            <rect x="68" y="65" width="6" height="12" fill="#000" rx="1" />
                            <rect x="78" y="76" width="6" height="6" fill="#000" rx="1" />
                            <rect x="40" y="80" width="6" height="10" fill="#000" rx="1" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 text-center break-all max-w-full">
                    {qrData.substring(0, 50)}...
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">Gagal generate QR</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card variant="glass">
              <CardContent>
                <div className="text-center py-4 space-y-4">
                  {!sudahCheckin ? (
                    <Button
                      variant="gold"
                      size="lg"
                      fullWidth
                      leftIcon={<LogIn className="w-5 h-5" />}
                      isLoading={submitting}
                      onClick={() => handleAbsensi('checkin')}
                    >
                      Check In
                    </Button>
                  ) : !sudahCheckout ? (
                    <Button
                      variant="danger"
                      size="lg"
                      fullWidth
                      leftIcon={<LogOut className="w-5 h-5" />}
                      isLoading={submitting}
                      onClick={() => handleAbsensi('checkout')}
                    >
                      Check Out
                    </Button>
                  ) : (
                    <div className="py-3">
                      <Badge variant="success" size="lg" className="mx-auto">
                        <CheckCircle2 className="w-4 h-4" />
                        Sudah Check Out
                      </Badge>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                      <MapPin className="w-3.5 h-3.5" />
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold" />
                    Lokasi GPS
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {location ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="text-xs text-white/40">Latitude</p>
                      <p className="text-sm font-mono text-white">{location.lat.toFixed(6)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="text-xs text-white/40">Longitude</p>
                      <p className="text-sm font-mono text-white">{location.lng.toFixed(6)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MapPin className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="text-xs text-white/40">Mendapatkan lokasi...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                Riwayat Absensi Hari Ini
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-gold animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8">
                <Smartphone className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">Belum ada absensi hari ini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      log.type === 'checkin' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {log.type === 'checkin'
                        ? <LogIn className="w-5 h-5 text-green-400" />
                        : <LogOut className="w-5 h-5 text-red-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={log.type === 'checkin' ? 'success' : 'danger'} size="sm">
                          {log.type === 'checkin' ? 'Check In' : 'Check Out'}
                        </Badge>
                        <Badge variant="default" size="sm">{log.method}</Badge>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      {log.lokasi_nama && (
                        <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {log.lokasi_nama}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
