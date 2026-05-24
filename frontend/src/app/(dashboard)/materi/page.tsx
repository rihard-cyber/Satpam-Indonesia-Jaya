'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import {
  BookOpen, Lock, CheckCircle, ChevronRight, Clock, GraduationCap, Shield, Search, Award
} from 'lucide-react';

const tingkatanList = [
  { kode: 'gada_pratama', nama: 'Gada Pratama', icon: Shield, color: 'from-blue-500 to-blue-700' },
  { kode: 'gada_madya', nama: 'Gada Madya', icon: GraduationCap, color: 'from-gold to-gold-dark' },
  { kode: 'gada_utama', nama: 'Gada Utama', icon: Award, color: 'from-red-500 to-red-700' },
];

export default function MateriPage() {
  const router = useRouter();
  const [selectedTingkatan, setSelectedTingkatan] = useState('gada_pratama');
  const [searchQuery, setSearchQuery] = useState('');
  const [materiList, setMateriList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMateri() {
      setLoading(true);
      try {
        const url = selectedTingkatan ? `/api/materi?tingkatan=${selectedTingkatan}` : '/api/materi';
        const res = await fetch(url);
        const json = await res.json();
        setMateriList(json.data || []);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchMateri();
  }, [selectedTingkatan]);

  const filtered = searchQuery
    ? materiList.filter((m: any) => m.judul.toLowerCase().includes(searchQuery.toLowerCase()))
    : materiList;

  const selected = tingkatanList.find(t => t.kode === selectedTingkatan);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Materi Satpam</h1>
          <p className="text-white/40 mt-1">LMS Gada Pratama, Madya & Utama</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {tingkatanList.map((t) => (
            <button key={t.kode} onClick={() => setSelectedTingkatan(t.kode)}
              className={`relative p-4 rounded-2xl border text-left transition-all ${selectedTingkatan === t.kode ? 'border-gold/30 bg-gradient-to-br from-navy-700 to-navy-800' : 'border-white/5 bg-navy-800/50 hover:bg-navy-700/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                  <t.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{t.nama}</p>
                  <p className="text-xs text-white/40">{materiList.length} Materi</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
          <Search className="w-4 h-4 text-white/30" />
          <input type="text" placeholder={`Cari materi ${selected?.nama || '...'}`}
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-white/30 py-12">Belum ada materi untuk tingkatan ini</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((materi: any) => (
              <Card key={materi.id} variant="glass" hover className="group cursor-pointer"
                onClick={() => router.push(`/materi/${materi.slug}`)}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-colors">
                    <BookOpen className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-gold transition-colors">{materi.judul}</h3>
                    </div>
                    {materi.ringkasan && <p className="text-xs text-white/40 mt-1 line-clamp-2">{materi.ringkasan}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-white/30">
                        <Clock className="w-3 h-3" /> {materi.durasi_menit} menit
                      </div>
                      <Badge variant="info" size="sm">{materi.kategori_nama}</Badge>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Mulai</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
