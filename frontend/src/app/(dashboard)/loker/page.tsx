'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { Briefcase, MapPin, DollarSign, Clock, Building2, Users, Calendar, Crown, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function LokerPage() {
  const router = useRouter();
  const { data: session } = useSession();
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Portal Loker</h1>
            <p className="text-white/40 mt-1">Temukan lowongan Security terbaru</p>
          </div>
          <Button variant="gold" leftIcon={<Sparkles className="w-4 h-4" />} onClick={() => router.push('/loker/premium')}>
            Pasang Lowongan Premium
          </Button>
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
            {lokerList.map((job: any, i: number) => {
              const isPremium = job.is_premium && (!job.premium_expires_at || new Date(job.premium_expires_at) > new Date());
              return (
                <Card key={job.id || i} variant={isPremium ? 'gold' : 'glass'} hover>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isPremium ? 'bg-gold/20' : 'bg-navy-700'}`}>
                      {isPremium ? <Crown className="w-7 h-7 text-gold" /> : <Building2 className="w-7 h-7 text-gold" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-white">{job.posisi}</h3>
                          {isPremium && <Badge variant="gold" size="sm" dot>Premium</Badge>}
                        </div>
                        <Badge variant={job.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                          {job.status === 'active' ? 'Aktif' : 'Ditutup'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gold">{job.perusahaan_nama}</p>
                        {isPremium && <span className="text-[10px] text-gold/50">★ Premium Listing</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {job.penempatan && <div className="flex items-center gap-1 text-xs text-white/50"><MapPin className="w-3 h-3" />{job.penempatan}</div>}
                        {job.gaji_min && <div className="flex items-center gap-1 text-xs text-white/50"><DollarSign className="w-3 h-3" />Rp {parseInt(job.gaji_min).toLocaleString()} - {parseInt(job.gaji_max).toLocaleString()}</div>}
                        <div className="flex items-center gap-1 text-xs text-white/50"><Users className="w-3 h-3" />{job.jumlah_kebutuhan} orang</div>
                        {job.deadline && <div className="flex items-center gap-1 text-xs text-white/50"><Calendar className="w-3 h-3" />Deadline: {job.deadline}</div>}
                      </div>
                    </div>
                    <Button variant={isPremium ? 'gold' : 'primary'} size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>Apply</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
