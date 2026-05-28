'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  AlertTriangle, Plus, Search, Filter, ChevronDown,
  FileText, MapPin, User, Clock, ArrowRight
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface IncidentReport {
  id: string;
  nomor_laporan?: string;
  judul: string;
  jenis_kejadian: string;
  tingkat_darurat: string;
  status: string;
  lokasi?: string;
  user_nama: string;
  user_foto?: string;
  handler_nama?: string;
  created_at: string;
}

interface StatusCounts {
  dilaporkan: number;
  diverifikasi: number;
  ditangani: number;
  selesai: number;
  ditutup: number;
}

const jenisLabels: Record<string, string> = {
  pencurian: 'Pencurian', kebakaran: 'Kebakaran', kecelakaan: 'Kecelakaan',
  perkelahian: 'Perkelahian', pengancaman: 'Pengancaman', penyusupan: 'Penyusupan',
  kerusakan_aset: 'Kerusakan Aset', kehilangan_barang: 'Kehilangan Barang',
  pelanggaran_sop: 'Pelanggaran SOP', kecurigaan: 'Kecurigaan',
  darurat_medis: 'Darurat Medis', bencana_alam: 'Bencana Alam',
  pelanggaran_lalu_lintas: 'Pelanggaran Lalu Lintas', lainnya: 'Lainnya',
};

const statusLabels: Record<string, string> = {
  dilaporkan: 'Dilaporkan', diverifikasi: 'Diverifikasi',
  ditangani: 'Ditangani', selesai: 'Selesai', ditutup: 'Ditutup',
};

const statusVariants: Record<string, 'warning' | 'info' | 'danger' | 'success' | 'default'> = {
  dilaporkan: 'warning', diverifikasi: 'info',
  ditangani: 'danger', selesai: 'success', ditutup: 'default',
};

const tingkatColors: Record<string, string> = {
  rendah: 'text-green-400 bg-green-500/10',
  sedang: 'text-yellow-400 bg-yellow-500/10',
  tinggi: 'text-orange-400 bg-orange-500/10',
  kritis: 'text-red-400 bg-red-500/10',
};

export default function LaporanPage() {
  const router = useRouter();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jenisFilter, setJenisFilter] = useState('');

  const loadReports = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      if (jenisFilter) params.set('jenis_kejadian', jenisFilter);

      const res = await fetch(`/api/laporan?${params.toString()}`);
      const json = await res.json();
      setReports(json.data || []);
      setStatusCounts(json.statusCounts);
    } catch {}
    setLoading(false);
  }, [filter, jenisFilter]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const filters = [
    { key: '', label: 'Semua' },
    { key: 'dilaporkan', label: 'Dilaporkan' },
    { key: 'diverifikasi', label: 'Diverifikasi' },
    { key: 'ditangani', label: 'Ditangani' },
    { key: 'selesai', label: 'Selesai' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Laporan Kejadian</h1>
            <p className="text-white/40 mt-1">Monitoring dan manajemen laporan insiden keamanan</p>
          </div>
          <Button variant="gold" leftIcon={<Plus className="w-4 h-4" />} onClick={() => router.push('/laporan/buat')}>
            Buat Laporan
          </Button>
        </div>

        {statusCounts && (
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(statusCounts).map(([key, count]) => (
              <Card key={key} variant={filter === key ? 'gold' : 'glass'} hover onClick={() => setFilter(filter === key ? '' : key)}>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-white">{count as number}</p>
                  <p className="text-xs text-white/40 capitalize">{statusLabels[key as keyof typeof statusLabels] || key}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-transparent flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filter <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <Card variant="glass">
            <CardContent className="flex flex-wrap gap-3">
              <select
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="">Semua Jenis</option>
                {Object.entries(jenisLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : reports.length === 0 ? (
          <Card variant="glass">
            <CardContent>
              <div className="flex flex-col items-center py-12">
                <FileText className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/40">Belum ada laporan kejadian</p>
                <Button variant="gold" className="mt-4" leftIcon={<Plus className="w-4 h-4" />} onClick={() => router.push('/laporan/buat')}>
                  Buat Laporan Pertama
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id} variant="glass" hover onClick={() => router.push(`/laporan/${report.id}`)}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.tingkat_darurat === 'kritis' ? 'bg-red-500/20' : 'bg-navy-700'}`}>
                    <AlertTriangle className={`w-5 h-5 ${report.tingkat_darurat === 'kritis' ? 'text-red-400' : 'text-gold'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white truncate">{report.judul}</span>
                      <Badge variant={statusVariants[report.status]} size="sm">{statusLabels[report.status]}</Badge>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tingkatColors[report.tingkat_darurat]}`}>
                        {report.tingkat_darurat}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40 flex-wrap">
                      {report.nomor_laporan && <span>{report.nomor_laporan}</span>}
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {report.user_nama}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDateTime(report.created_at)}</span>
                      {report.lokasi && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.lokasi}</span>}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/20" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
