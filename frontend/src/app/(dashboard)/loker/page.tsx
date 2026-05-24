'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { Briefcase, MapPin, DollarSign, Clock, Building2, Users, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function LokerPage() {
  const [lokerList, setLokerList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'daftar' | 'lamaran'>('daftar');

  useEffect(() => {
    fetch('/api/loker').then(r => r.json()).then(j => {
      setLokerList(j.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portal Loker</h1>
          <p className="text-white/40 mt-1">Temukan lowongan Security terbaru</p>
        </div>

        <div className="flex bg-navy-800 rounded-xl p-1 border border-white/5 w-fit">
          <button onClick={() => setView('daftar')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${view === 'daftar' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/40'}`}>Daftar Lowongan</button>
          <button onClick={() => setView('lamaran')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${view === 'lamaran' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/40'}`}>Lamaran Saya</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
        ) : lokerList.length === 0 ? (
          <Card variant="glass"><div className="p-12 text-center text-white/30">Belum ada lowongan tersedia</div></Card>
        ) : (
          <div className="space-y-4">
            {lokerList.map((job: any, i: number) => (
              <Card key={job.id || i} variant="glass" hover>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-white">{job.posisi}</h3>
                        <p className="text-sm text-gold">{job.perusahaan_nama}</p>
                      </div>
                      <Badge variant={job.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                        {job.status === 'active' ? 'Aktif' : 'Ditutup'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {job.penempatan && <div className="flex items-center gap-1 text-xs text-white/50"><MapPin className="w-3 h-3" />{job.penempatan}</div>}
                      {job.gaji_min && <div className="flex items-center gap-1 text-xs text-white/50"><DollarSign className="w-3 h-3" />Rp {parseInt(job.gaji_min).toLocaleString()} - {parseInt(job.gaji_max).toLocaleString()}</div>}
                      <div className="flex items-center gap-1 text-xs text-white/50"><Users className="w-3 h-3" />{job.jumlah_kebutuhan} orang</div>
                      {job.deadline && <div className="flex items-center gap-1 text-xs text-white/50"><Calendar className="w-3 h-3" />Deadline: {job.deadline}</div>}
                    </div>
                  </div>
                  <Button variant="gold" size="sm">Apply</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
