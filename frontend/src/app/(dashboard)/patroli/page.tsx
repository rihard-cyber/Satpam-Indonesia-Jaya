'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  Shield,
  MapPin,
  Clock,
  Play,
  Square,
  ChevronRight,
  Loader2,
  Calendar,
  Sun,
  Moon,
  Sunrise,
} from 'lucide-react';
import ScanModal from './ScanModal';

interface Shift {
  id: string;
  shift_date: string;
  shift_type: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  total_checkpoints: number;
  completed_checkpoints: number;
  patrol_route: string | null;
  user_nama: string;
}

interface Checkpoint {
  id: string;
  nama: string;
  lokasi_lat: number | null;
  lokasi_lng: number | null;
  radius_meters: number;
  qr_code: string | null;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'gold' | 'success' | 'warning' | 'danger' | 'info' }> = {
  scheduled: { label: 'Terjadwal', variant: 'info' },
  in_progress: { label: 'Sedang Berjalan', variant: 'gold' },
  completed: { label: 'Selesai', variant: 'success' },
  missed: { label: 'Terlewat', variant: 'danger' },
};

const shiftTypeIcon: Record<string, React.ReactNode> = {
  pagi: <Sunrise className="w-4 h-4 text-orange-400" />,
  siang: <Sun className="w-4 h-4 text-gold" />,
  malam: <Moon className="w-4 h-4 text-blue-400" />,
};

export default function PatroliPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'shifts' | 'checkpoints'>('shifts');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [scanShiftId, setScanShiftId] = useState<string | null>(null);

  async function loadShifts() {
    try {
      const res = await fetch('/api/patroli/shifts');
      const json = await res.json();
      setShifts(json.data || []);
    } catch {}
  }

  async function loadCheckpoints() {
    try {
      const res = await fetch('/api/patroli/checkpoints');
      const json = await res.json();
      setCheckpoints(json.data || []);
    } catch {}
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([loadShifts(), loadCheckpoints()]).finally(() => setLoading(false));
  }, []);

  async function handleAction(shiftId: string, action: 'start' | 'end') {
    setActionLoading(shiftId);
    try {
      await fetch(`/api/patroli/shifts/${shiftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      await loadShifts();
    } catch {}
    setActionLoading(null);
  }

  const activeShift = shifts.find((s) => s.status === 'in_progress');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Patroli Digital</h1>
            <p className="text-white/40 mt-1">Kelola shift patroli dan checkpoint</p>
          </div>
        </div>

        {activeShift && (
          <Card variant="gold">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gold" />
                  Shift Sedang Berjalan
                </div>
              </CardTitle>
              <Badge variant="gold" dot>LIVE</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40">Progress Patroli</p>
                    <p className="text-lg font-bold text-white mt-1">
                      {activeShift.completed_checkpoints}/{activeShift.total_checkpoints}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40">Checkpoint</p>
                    <p className="text-lg font-bold text-white mt-1">
                      {activeShift.total_checkpoints - activeShift.completed_checkpoints} Sisa
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                    style={{
                      width: activeShift.total_checkpoints > 0
                        ? `${(activeShift.completed_checkpoints / activeShift.total_checkpoints) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    onClick={() => setScanShiftId(activeShift.id)}
                  >
                    Scan Checkpoint
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Square className="w-4 h-4" />}
                    isLoading={actionLoading === activeShift.id}
                    onClick={() => handleAction(activeShift.id, 'end')}
                  >
                    Akhiri Shift
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-1 bg-navy-800 rounded-xl p-1 w-fit">
          {(['shifts', 'checkpoints'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-gold text-black shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'shifts' ? 'Shift Saya' : 'Checkpoints'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : tab === 'shifts' ? (
          <div className="space-y-3">
            {shifts.length === 0 ? (
              <Card variant="glass">
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50">Belum ada shift patroli</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              shifts.map((shift) => (
                <Card
                  key={shift.id}
                  variant="glass"
                  hover
                  onClick={() => router.push(`/patroli/${shift.id}`)}
                >
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center">
                          {shiftTypeIcon[shift.shift_type] || <Clock className="w-5 h-5 text-white/40" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white capitalize">{shift.shift_type}</p>
                            <Badge variant={statusConfig[shift.status]?.variant || 'default'} size="sm">
                              {statusConfig[shift.status]?.label || shift.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-white/40 mt-0.5">
                            {new Date(shift.shift_date).toLocaleDateString('id-ID', {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </p>
                          {(shift.completed_checkpoints > 0 || shift.total_checkpoints > 0) && (
                            <p className="text-xs text-gold/70 mt-0.5">
                              {shift.completed_checkpoints}/{shift.total_checkpoints} checkpoint
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {shift.status === 'scheduled' && (
                          <Button
                            variant="gold"
                            size="sm"
                            leftIcon={<Play className="w-4 h-4" />}
                            isLoading={actionLoading === shift.id}
                            onClick={(e) => { e.stopPropagation(); handleAction(shift.id, 'start'); }}
                          >
                            Mulai Shift
                          </Button>
                        )}
                        {shift.status === 'in_progress' && (
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Square className="w-4 h-4" />}
                            isLoading={actionLoading === shift.id}
                            onClick={(e) => { e.stopPropagation(); handleAction(shift.id, 'end'); }}
                          >
                            Akhiri
                          </Button>
                        )}
                        <ChevronRight className="w-5 h-5 text-white/20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkpoints.length === 0 ? (
              <Card variant="glass" className="sm:col-span-2 lg:col-span-3">
                <CardContent>
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50">Belum ada checkpoint</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              checkpoints.map((cp) => (
                <Card key={cp.id} variant="glass">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-gold" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{cp.nama}</p>
                        {cp.lokasi_lat && cp.lokasi_lng && (
                          <p className="text-xs text-white/40 mt-1 font-mono">
                            {Number(cp.lokasi_lat).toFixed(6)}, {Number(cp.lokasi_lng).toFixed(6)}
                          </p>
                        )}
                        <p className="text-xs text-white/40 mt-0.5">Radius: {cp.radius_meters}m</p>
                        {cp.qr_code && (
                          <Badge variant="gold" size="sm" className="mt-2">QR Ready</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {scanShiftId && (
        <ScanModal
          isOpen={!!scanShiftId}
          onClose={() => setScanShiftId(null)}
          shiftId={scanShiftId}
          onSuccess={loadShifts}
        />
      )}
    </DashboardLayout>
  );
}
