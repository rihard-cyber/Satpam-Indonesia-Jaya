'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Camera,
  Sun,
  Moon,
  Sunrise,
} from 'lucide-react';
import ScanModal from '../ScanModal';

interface ShiftDetail {
  id: string;
  shift_date: string;
  shift_type: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  total_checkpoints: number;
  completed_checkpoints: number;
  patrol_route: string | null;
  notes: string | null;
  user_nama: string;
  user_foto: string | null;
}

interface PatrolLog {
  id: string;
  checkpoint_id: string | null;
  checkpoint_nama: string | null;
  scan_method: string;
  status: string;
  timestamp: string;
  foto_url: string | null;
  catatan: string | null;
  lokasi_lat: number | null;
  lokasi_lng: number | null;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'gold' | 'success' | 'warning' | 'danger' | 'info' }> = {
  scheduled: { label: 'Terjadwal', variant: 'info' },
  in_progress: { label: 'Sedang Berjalan', variant: 'gold' },
  completed: { label: 'Selesai', variant: 'success' },
  missed: { label: 'Terlewat', variant: 'danger' },
};

const scanMethodIcon: Record<string, React.ReactNode> = {
  gps: <MapPin className="w-3.5 h-3.5" />,
  qr: <Camera className="w-3.5 h-3.5" />,
  manual: <Clock className="w-3.5 h-3.5" />,
};

const logStatusIcon: Record<string, React.ReactNode> = {
  ok: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  skip: <AlertCircle className="w-4 h-4 text-orange-400" />,
  missed: <XCircle className="w-4 h-4 text-red-400" />,
  issue: <AlertCircle className="w-4 h-4 text-red-400" />,
};

export default function PatroliDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [shift, setShift] = useState<ShiftDetail | null>(null);
  const [logs, setLogs] = useState<PatrolLog[]>([]);
  const [totalCheckpointsAll, setTotalCheckpointsAll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showScan, setShowScan] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/patroli/shifts/${params.id}`);
        const json = await res.json();
        setShift(json.data);
        setLogs(json.logs || []);
        setTotalCheckpointsAll(json.total_checkpoints_all || 0);
      } catch {}
      setLoading(false);
    }
    load();
  }, [params.id]);

  const progress = shift && shift.total_checkpoints > 0
    ? Math.round((shift.completed_checkpoints / shift.total_checkpoints) * 100)
    : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!shift) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-white/50">Shift tidak ditemukan</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.back()}>Kembali</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Kembali</span>
        </button>

        <Card variant="gradient">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                Detail Shift Patroli
              </div>
            </CardTitle>
            <Badge variant={statusConfig[shift.status]?.variant || 'default'} size="md">
              {statusConfig[shift.status]?.label || shift.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/40">Tanggal</p>
                <p className="text-sm font-medium text-white mt-1">
                  {new Date(shift.shift_date).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/40">Shift</p>
                <p className="text-sm font-medium text-white capitalize mt-1 flex items-center gap-1.5">
                  {shift.shift_type === 'pagi' && <Sunrise className="w-4 h-4 text-orange-400" />}
                  {shift.shift_type === 'siang' && <Sun className="w-4 h-4 text-gold" />}
                  {shift.shift_type === 'malam' && <Moon className="w-4 h-4 text-blue-400" />}
                  {shift.shift_type}
                </p>
              </div>
              {shift.start_time && (
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Mulai</p>
                  <p className="text-sm font-medium text-white mt-1">
                    {new Date(shift.start_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              {shift.end_time && (
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Selesai</p>
                  <p className="text-sm font-medium text-white mt-1">
                    {new Date(shift.end_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>

            {shift.patrol_route && (
              <div className="mt-4 p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/40">Rute Patroli</p>
                <p className="text-sm text-white mt-1">{shift.patrol_route}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                Progress Patroli
              </div>
            </CardTitle>
            <span className="text-sm text-gold font-medium">{progress}%</span>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                <span className="text-gold font-medium">{shift.completed_checkpoints}</span>/{shift.total_checkpoints} checkpoint
              </span>
              <span className="text-white/40">{shift.total_checkpoints - shift.completed_checkpoints} tersisa</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-gold" />
                Log Patroli
              </div>
            </CardTitle>
            {shift.status === 'in_progress' && (
              <Button variant="gold" size="sm" onClick={() => setShowScan(true)}>
                <MapPin className="w-4 h-4" />
                Scan Checkpoint
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">Belum ada log patroli</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                      {logStatusIcon[log.status] || <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {log.checkpoint_nama || 'Unknown Checkpoint'}
                        </p>
                        <Badge variant="default" size="sm" className="capitalize">
                          {scanMethodIcon[log.scan_method]}
                          <span className="ml-1">{log.scan_method}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                        {' | '}
                        {new Date(log.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                      {log.catatan && (
                        <p className="text-xs text-white/60 mt-1 italic">{log.catatan}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showScan && (
          <ScanModal
            isOpen={showScan}
            onClose={() => setShowScan(false)}
            shiftId={shift.id}
            onSuccess={() => {
              fetch(`/api/patroli/shifts/${params.id}`).then(r => r.json()).then(json => {
                setShift(json.data);
                setLogs(json.logs || []);
              });
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
