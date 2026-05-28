'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '@/components/ui';
import {
  AlertTriangle, ArrowLeft, MapPin, User, Clock, FileText,
  CheckCircle, XCircle, Target, Activity, Image
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface IncidentDetail {
  id: string;
  nomor_laporan?: string;
  judul: string;
  deskripsi: string;
  jenis_kejadian: string;
  tingkat_darurat: string;
  status: string;
  lokasi?: string;
  lokasi_lat?: number;
  lokasi_lng?: number;
  foto_url: string[];
  video_url: string[];
  korban_jiwa: number;
  korban_luka: number;
  kerugian_perkiraan?: number;
  tindakan_awal?: string;
  resolved_notes?: string;
  user_id: string;
  user_nama: string;
  user_foto?: string;
  user_email?: string;
  user_phone?: string;
  handler_nama?: string;
  handled_at?: string;
  resolved_at?: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  dilaporkan: 'Dilaporkan', diverifikasi: 'Diverifikasi',
  ditangani: 'Ditangani', selesai: 'Selesai', ditutup: 'Ditutup',
};

const statusVariants: Record<string, 'warning' | 'info' | 'danger' | 'success' | 'default'> = {
  dilaporkan: 'warning', diverifikasi: 'info',
  ditangani: 'danger', selesai: 'success', ditutup: 'default',
};

const jenisLabels: Record<string, string> = {
  pencurian: 'Pencurian', kebakaran: 'Kebakaran', kecelakaan: 'Kecelakaan',
  perkelahian: 'Perkelahian', pengancaman: 'Pengancaman', penyusupan: 'Penyusupan',
  kerusakan_aset: 'Kerusakan Aset', kehilangan_barang: 'Kehilangan Barang',
  pelanggaran_sop: 'Pelanggaran SOP', kecurigaan: 'Kecurigaan',
  darurat_medis: 'Darurat Medis', bencana_alam: 'Bencana Alam',
  pelanggaran_lalu_lintas: 'Pelanggaran Lalu Lintas', lainnya: 'Lainnya',
};

export default function LaporanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resolvedNotes, setResolvedNotes] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/laporan/${params.id}`);
        const json = await res.json();
        setReport(json.data);
      } catch {}
      setLoading(false);
    }
    load();
  }, [params.id]);

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/laporan/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolved_notes: status === 'selesai' ? resolvedNotes : undefined }),
      });
      if (res.ok) {
        const json = await res.json();
        setReport(json.data);
        setResolvedNotes('');
      }
    } catch {}
    setUpdating(false);
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

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-white/40">Laporan tidak ditemukan</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.push('/laporan')}>Kembali</Button>
        </div>
      </DashboardLayout>
    );
  }

  const nextActions: Record<string, { label: string; status: string; variant?: 'primary' | 'secondary' | 'gold' | 'danger' }> = {
    dilaporkan: { label: 'Verifikasi Laporan', status: 'diverifikasi', variant: 'secondary' },
    diverifikasi: { label: 'Tangani Laporan', status: 'ditangani', variant: 'danger' },
    ditangani: { label: 'Selesaikan Laporan', status: 'selesai', variant: 'gold' },
  };

  const timeline = [
    { status: 'dilaporkan', waktu: report.created_at },
    ...(report.handled_at ? [{ status: report.status === 'selesai' || report.status === 'ditutup' ? 'ditangani' : report.status, waktu: report.handled_at }] : []),
    ...(report.resolved_at ? [{ status: 'selesai', waktu: report.resolved_at }] : []),
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button onClick={() => router.push('/laporan')} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Card variant="gradient">
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${report.tingkat_darurat === 'kritis' ? 'bg-red-500/20' : 'bg-navy-700'}`}>
                    <AlertTriangle className={`w-7 h-7 ${report.tingkat_darurat === 'kritis' ? 'text-red-400' : 'text-gold'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-bold text-white">{report.judul}</h1>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-white/40 flex-wrap">
                      {report.nomor_laporan && <span><FileText className="w-3.5 h-3.5 inline mr-1" />{report.nomor_laporan}</span>}
                      <Badge variant={statusVariants[report.status]} size="sm">{statusLabels[report.status]}</Badge>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.tingkat_darurat === 'rendah' ? 'text-green-400 bg-green-500/10' :
                        report.tingkat_darurat === 'sedang' ? 'text-yellow-400 bg-yellow-500/10' :
                        report.tingkat_darurat === 'tinggi' ? 'text-orange-400 bg-orange-500/10' :
                        'text-red-400 bg-red-500/10'
                      }`}>{report.tingkat_darurat}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Detail Kejadian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-white/40">Jenis Kejadian</p>
                    <p className="text-sm text-white font-medium">{jenisLabels[report.jenis_kejadian] || report.jenis_kejadian}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Tingkat Darurat</p>
                    <p className="text-sm text-white font-medium capitalize">{report.tingkat_darurat}</p>
                  </div>
                  {report.lokasi && (
                    <div>
                      <p className="text-xs text-white/40">Lokasi</p>
                      <p className="text-sm text-white font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gold" />{report.lokasi}</p>
                    </div>
                  )}
                  {(report.korban_jiwa > 0 || report.korban_luka > 0) && (
                    <div>
                      <p className="text-xs text-white/40">Korban</p>
                      <p className="text-sm text-white font-medium">
                        {report.korban_jiwa > 0 && `${report.korban_jiwa} jiwa `}
                        {report.korban_luka > 0 && `${report.korban_luka} luka`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-xs text-white/40 mb-2">Deskripsi</p>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{report.deskripsi}</p>
                </div>

                {report.tindakan_awal && (
                  <div className="mb-6">
                    <p className="text-xs text-white/40 mb-2">Tindakan Awal</p>
                    <p className="text-sm text-white/80">{report.tindakan_awal}</p>
                  </div>
                )}

                {report.foto_url?.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 mb-2 flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Foto Dokumentasi</p>
                    <div className="flex flex-wrap gap-2">
                      {report.foto_url.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="w-20 h-20 rounded-xl bg-navy-700 flex items-center justify-center text-xs text-white/40 hover:text-gold border border-white/5 hover:border-gold/30 transition-all">
                          <Image className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {report.resolved_notes && (
              <Card variant="gold">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Catatan Penyelesaian</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/80">{report.resolved_notes}</p>
                  {report.handler_nama && (
                    <p className="text-xs text-white/40 mt-2">Ditangani oleh: {report.handler_nama}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {report.status !== 'selesai' && report.status !== 'ditutup' && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-gold" /> Tindakan</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.status !== 'ditutup' && (
                      <div className="flex gap-2 flex-wrap">
                        {nextActions[report.status] && (
                          <Button
                            variant={nextActions[report.status].variant || 'primary'}
                            onClick={() => handleUpdateStatus(nextActions[report.status].status)}
                            isLoading={updating}
                          >
                            {nextActions[report.status].label}
                          </Button>
                        )}
                        {report.status === 'dilaporkan' && (
                          <Button variant="danger" onClick={() => handleUpdateStatus('ditutup')} isLoading={updating}>
                            Tutup Laporan
                          </Button>
                        )}
                      </div>
                    )}
                    {report.status === 'ditangani' && (
                      <div className="space-y-3">
                        <Input
                          label="Catatan Penyelesaian"
                          placeholder="Jelaskan tindakan yang telah dilakukan..."
                          value={resolvedNotes}
                          onChange={(e) => setResolvedNotes(e.target.value)}
                        />
                        <Button variant="gold" onClick={() => handleUpdateStatus('selesai')} isLoading={updating} disabled={!resolvedNotes.trim()}>
                          Selesaikan Laporan
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:w-80 space-y-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2"><User className="w-5 h-5 text-gold" /> Pelapor</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-sm font-medium text-white/70">
                    {report.user_nama?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{report.user_nama}</p>
                    {report.user_email && <p className="text-xs text-white/40">{report.user_email}</p>}
                  </div>
                </div>
                <p className="text-xs text-white/30 mt-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDateTime(report.created_at)}</p>
              </CardContent>
            </Card>

            {report.handler_nama && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2"><Target className="w-5 h-5 text-gold" /> Penangan</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-white">{report.handler_nama}</p>
                  {report.handled_at && <p className="text-xs text-white/30 mt-1">{formatDateTime(report.handled_at)}</p>}
                </CardContent>
              </Card>
            )}

            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-gold" /> Timeline</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          t.status === 'selesai' ? 'bg-green-400' :
                          t.status === 'ditangani' ? 'bg-red-400' :
                          t.status === 'diverifikasi' ? 'bg-blue-400' : 'bg-gold'
                        }`} />
                        {i < timeline.length - 1 && <div className="w-0.5 h-full bg-white/10 mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-xs font-medium text-white">{statusLabels[t.status] || t.status}</p>
                        <p className="text-xs text-white/30">{formatDateTime(t.waktu)}</p>
                      </div>
                    </div>
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
