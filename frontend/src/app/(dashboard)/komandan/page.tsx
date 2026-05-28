'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '@/components/ui';
import {
  Users, Shield, MapPin, AlertTriangle, Activity, UserPlus,
  Clock, ArrowRight, Plus, Bell, LogOut, CheckCircle, X
} from 'lucide-react';
import { formatDateTime, getTimeAgo } from '@/lib/utils';

interface Team {
  id: string;
  nama_team: string;
  perusahaan?: string;
  lokasi?: string;
  member_count: number;
  online_count: number;
}

interface Activity {
  id: string;
  waktu: string;
  jenis: string;
  user_nama: string;
  foto_profil_url?: string;
  status?: string;
  judul?: string;
  shift_type?: string;
  method?: string;
  type?: string;
  tingkat_darurat?: string;
}

interface PanicAlert {
  id: string;
  user_id: string;
  user_nama: string;
  user_foto?: string;
  type: string;
  lokasi_nama?: string;
  message?: string;
  status: string;
  created_at: string;
}

interface Stats {
  total_anggota: number;
  aktif_bertugas: number;
  checkpoint_hari_ini: number;
  kejadian_aktif: number;
  kehadiran_hari_ini: number;
}

export default function KomandanDashboardPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [panicAlerts, setPanicAlerts] = useState<PanicAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ nama_team: '', perusahaan: '', lokasi: '' });
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [teamsRes, statsRes, activitiesRes, panicRes] = await Promise.all([
        fetch('/api/komandan/teams'),
        fetch('/api/komandan/rekap'),
        fetch('/api/komandan/activities'),
        fetch('/api/panic'),
      ]);
      const teamsJson = await teamsRes.json();
      const statsJson = await statsRes.json();
      const activitiesJson = await activitiesRes.json();
      const panicJson = await panicRes.json();

      setTeams(teamsJson.data || []);
      setStats(statsJson);
      setActivities(activitiesJson.data || []);
      setPanicAlerts(panicJson.data?.filter((a: PanicAlert) => a.status === 'active') || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/komandan/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowCreateForm(false);
        setFormData({ nama_team: '', perusahaan: '', lokasi: '' });
        loadData();
      }
    } catch {}
    setCreating(false);
  };

  const handleAcknowledgePanic = async (id: string) => {
    try {
      await fetch(`/api/panic/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'acknowledged' }),
      });
      loadData();
    } catch {}
  };

  const handleResolvePanic = async (id: string) => {
    try {
      await fetch(`/api/panic/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });
      loadData();
    } catch {}
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  const hasTeam = teams.length > 0;
  const team = teams[0];

  const statCards = [
    { label: 'Total Anggota', value: stats?.total_anggota || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Sedang Bertugas', value: stats?.aktif_bertugas || 0, icon: Shield, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Checkpoint Hari Ini', value: stats?.checkpoint_hari_ini || 0, icon: MapPin, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Kejadian Aktif', value: stats?.kejadian_aktif || 0, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  const activityIcon = (jenis: string) => {
    switch (jenis) {
      case 'patroli': return <MapPin className="w-4 h-4 text-green-400" />;
      case 'absensi': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'laporan': return <AlertTriangle className="w-4 h-4 text-gold" />;
      default: return <Activity className="w-4 h-4 text-white/40" />;
    }
  };

  const panicColors: Record<string, string> = {
    panic: 'bg-red-500/20 border-red-500/30 text-red-400',
    emergency: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
    backup: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Komandan</h1>
          <p className="text-white/40 mt-1">Panel kontrol dan monitoring tim keamanan</p>
        </div>

        {!hasTeam ? (
          <Card variant="gold">
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gold/40 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Belum Memiliki Tim</h2>
                <p className="text-white/50 mb-6 max-w-md mx-auto">
                  Buat tim keamanan Anda untuk mulai memantau anggota, jadwal patroli, dan laporan kejadian.
                </p>
                {!showCreateForm ? (
                  <Button variant="gold" onClick={() => setShowCreateForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
                    Buat Tim
                  </Button>
                ) : (
                  <form onSubmit={handleCreateTeam} className="max-w-md mx-auto space-y-4">
                    <Input
                      label="Nama Tim"
                      placeholder="cth: Tim Alpha"
                      value={formData.nama_team}
                      onChange={(e) => setFormData({ ...formData, nama_team: e.target.value })}
                      required
                    />
                    <Input
                      label="Perusahaan (opsional)"
                      placeholder="Nama perusahaan"
                      value={formData.perusahaan}
                      onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                    />
                    <Input
                      label="Lokasi (opsional)"
                      placeholder="Lokasi penempatan"
                      value={formData.lokasi}
                      onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    />
                    <div className="flex gap-3">
                      <Button variant="ghost" type="button" onClick={() => setShowCreateForm(false)} fullWidth>
                        Batal
                      </Button>
                      <Button variant="gold" type="submit" isLoading={creating} fullWidth>
                        Simpan
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card variant="gradient">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <CardTitle>{team.nama_team}</CardTitle>
                    <p className="text-sm text-white/50">{team.perusahaan || team.lokasi || 'Tim Keamanan'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/komandan/tim/${team.id}`)}>
                  Kelola Tim
                </Button>
              </CardHeader>
            </Card>

            {panicAlerts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-400 animate-pulse" />
                  <h2 className="text-lg font-semibold text-red-400">Panic Alert! ({panicAlerts.length})</h2>
                </div>
                {panicAlerts.map((alert) => (
                  <Card key={alert.id} variant="glass" className="border-red-500/30 bg-red-500/5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{alert.user_nama}</span>
                          <Badge variant="danger" size="sm">{alert.type}</Badge>
                          <span className="text-xs text-white/30">{getTimeAgo(alert.created_at)}</span>
                        </div>
                        {alert.message && <p className="text-sm text-white/60 mt-1">{alert.message}</p>}
                        {alert.lokasi_nama && <p className="text-xs text-white/40 mt-1">Lokasi: {alert.lokasi_nama}</p>}
                        <div className="flex gap-2 mt-3">
                          <Button variant="secondary" size="sm" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={() => handleAcknowledgePanic(alert.id)}>
            Akui
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<X className="w-4 h-4" />} onClick={() => handleResolvePanic(alert.id)}>
            Selesaikan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

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

            <div className="grid lg:grid-cols-2 gap-6">
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-gold" /> Aktivitas Terbaru</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-none">
                    {activities.length === 0 ? (
                      <p className="text-sm text-white/30 text-center py-8">Belum ada aktivitas dalam 24 jam terakhir</p>
                    ) : (
                      activities.slice(0, 15).map((act, i) => (
                        <div key={`${act.id}-${i}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                            {activityIcon(act.jenis)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/80 truncate">
                              <span className="font-medium">{act.user_nama}</span>
                              {act.jenis === 'patroli' && ` ${act.status === 'ok' ? 'memeriksa' : 'melewatkan'} checkpoint`}
                              {act.jenis === 'absensi' && ` ${act.type === 'checkin' ? 'check in' : 'check out'}`}
                              {act.jenis === 'laporan' && ` melaporkan: ${act.judul}`}
                            </p>
                            <p className="text-xs text-white/30">{getTimeAgo(act.waktu)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gold" /> Anggota Online</div>
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/komandan/tim/${team.id}`)}>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {teams.length > 0 ? (
                        <p className="text-sm text-green-400">
                          <span className="w-2 h-2 inline-block rounded-full bg-green-400 mr-2" />
                          {team.online_count} dari {team.member_count} anggota online
                        </p>
                      ) : (
                        <p className="text-sm text-white/30">Tidak ada data</p>
                      )}
                      <Button variant="gold" size="sm" fullWidth leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => router.push(`/komandan/tim/${team.id}`)}>
                        Tambah Anggota
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-gold" /> Aksi Cepat</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => router.push(`/komandan/tim/${team.id}`)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/5 transition-all group">
                        <UserPlus className="w-5 h-5 text-gold" />
                        <span className="text-xs text-white/70">Tambah Anggota</span>
                      </button>
                      <button onClick={() => router.push('/laporan/buat')}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/5 transition-all group">
                        <AlertTriangle className="w-5 h-5 text-gold" />
                        <span className="text-xs text-white/70">Buat Shift</span>
                      </button>
                      <button onClick={() => router.push('/laporan')}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/5 transition-all group">
                        <Bell className="w-5 h-5 text-gold" />
                        <span className="text-xs text-white/70">Lihat Laporan</span>
                      </button>
                      <button onClick={() => router.push('/panic')}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group">
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span className="text-xs text-red-400">Panic Button</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
