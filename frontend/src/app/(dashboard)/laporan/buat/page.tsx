'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { AlertTriangle, Send, ArrowLeft } from 'lucide-react';

const jenisKejadian = [
  { value: 'pencurian', label: 'Pencurian' },
  { value: 'kebakaran', label: 'Kebakaran' },
  { value: 'kecelakaan', label: 'Kecelakaan' },
  { value: 'perkelahian', label: 'Perkelahian' },
  { value: 'pengancaman', label: 'Pengancaman' },
  { value: 'penyusupan', label: 'Penyusupan' },
  { value: 'kerusakan_aset', label: 'Kerusakan Aset' },
  { value: 'kehilangan_barang', label: 'Kehilangan Barang' },
  { value: 'pelanggaran_sop', label: 'Pelanggaran SOP' },
  { value: 'kecurigaan', label: 'Kecurigaan' },
  { value: 'darurat_medis', label: 'Darurat Medis' },
  { value: 'bencana_alam', label: 'Bencana Alam' },
  { value: 'pelanggaran_lalu_lintas', label: 'Pelanggaran Lalu Lintas' },
  { value: 'lainnya', label: 'Lainnya' },
];

const tingkatDarurat = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
  { value: 'kritis', label: 'Kritis' },
];

export default function BuatLaporanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    judul: '',
    jenis_kejadian: '',
    tingkat_darurat: 'rendah',
    deskripsi: '',
    lokasi: '',
    foto_url: '',
    tindakan_awal: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.judul.trim() || !formData.jenis_kejadian || !formData.deskripsi.trim()) {
      setError('Judul, jenis kejadian, dan deskripsi wajib diisi');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          foto_url: formData.foto_url ? [formData.foto_url] : [],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        router.push(`/laporan/${json.data.id}`);
      } else {
        const err = await res.json();
        setError(err.message || 'Gagal membuat laporan');
      }
    } catch {
      setError('Terjadi kesalahan saat mengirim laporan');
    }
    setSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => router.push('/laporan')} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">Buat Laporan Kejadian</h1>
          <p className="text-white/40 mt-1">Laporkan insiden keamanan yang terjadi</p>
        </div>

        <Card variant="gold">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Form Laporan</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Judul Laporan"
                placeholder="Contoh: Pencurian di area gudang"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Jenis Kejadian</label>
                  <select
                    value={formData.jenis_kejadian}
                    onChange={(e) => setFormData({ ...formData, jenis_kejadian: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                    required
                  >
                    <option value="">Pilih jenis</option>
                    {jenisKejadian.map((j) => (
                      <option key={j.value} value={j.value}>{j.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Tingkat Darurat</label>
                  <select
                    value={formData.tingkat_darurat}
                    onChange={(e) => setFormData({ ...formData, tingkat_darurat: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    {tingkatDarurat.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Deskripsi Kejadian</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Jelaskan kronologi kejadian secara detail..."
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                  required
                />
              </div>

              <Input
                label="Lokasi Kejadian"
                placeholder="Contoh: Gudang B, Lt. 2"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              />

              <Input
                label="Foto (URL)"
                placeholder="https://... (opsional)"
                value={formData.foto_url}
                onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Tindakan Awal (opsional)</label>
                <textarea
                  value={formData.tindakan_awal}
                  onChange={(e) => setFormData({ ...formData, tindakan_awal: e.target.value })}
                  placeholder="Tindakan yang sudah dilakukan..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button variant="gold" type="submit" fullWidth isLoading={submitting} leftIcon={<Send className="w-4 h-4" />}>
                Kirim Laporan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
