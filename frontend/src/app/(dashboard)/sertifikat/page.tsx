'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { Award, Download, Plus, Upload } from 'lucide-react';

export default function SertifikatPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/certificates')
      .then(r => r.json())
      .then(j => setCertificates(j.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Sertifikat Saya</h1>
          <p className="text-white/40 mt-1">Kumpulan sertifikat dan penghargaan</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
        ) : certificates.length === 0 ? (
          <Card variant="glass">
            <CardContent>
              <div className="flex flex-col items-center py-12">
                <Award className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/40">Belum ada sertifikat</p>
                <p className="text-xs text-white/20 mt-1">Sertifikat akan muncul setelah diverifikasi</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {certificates.map((c: any) => (
              <Card key={c.id} variant="glass" hover>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center">
                    <Award className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{c.nama_sertifikat}</p>
                    <p className="text-xs text-white/40">{c.penerbit || '-'}</p>
                  </div>
                  <Badge variant={c.is_verified ? 'success' : 'warning'} size="sm" dot>
                    {c.is_verified ? 'Terverifikasi' : 'Pending'}
                  </Badge>
                  {c.file_url && <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button variant="outline" fullWidth leftIcon={<Plus className="w-4 h-4" />}>
          Upload Sertifikat Baru
        </Button>
      </div>
    </DashboardLayout>
  );
}
