'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Filter,
  BookmarkPlus,
  Users,
} from 'lucide-react';

export default function LokerPage() {
  const [view, setView] = useState<'daftar' | 'lamaran'>('daftar');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Portal Loker</h1>
            <p className="text-white/40 mt-1">Temukan lowongan Security terbaru</p>
          </div>
          <Button variant="gold" leftIcon={<Briefcase className="w-4 h-4" />}>
            Pasang Loker
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex bg-navy-800 rounded-xl p-1 border border-white/5 w-fit">
          <button
            onClick={() => setView('daftar')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'daftar' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/40'
            }`}
          >
            Daftar Lowongan
          </button>
          <button
            onClick={() => setView('lamaran')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'lamaran' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/40'
            }`}
          >
            Lamaran Saya
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <Filter className="w-4 h-4 text-white/30" />
            <select className="bg-transparent text-sm text-white/70 outline-none">
              <option>Semua Penempatan</option>
              <option>Jakarta</option>
              <option>Bandung</option>
              <option>Surabaya</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <DollarSign className="w-4 h-4 text-white/30" />
            <select className="bg-transparent text-sm text-white/70 outline-none">
              <option>Semua Gaji</option>
              <option>Rp 3 - 5 JT</option>
              <option>Rp 5 - 7 JT</option>
              <option>Rp 7+ JT</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <Clock className="w-4 h-4 text-white/30" />
            <select className="bg-transparent text-sm text-white/70 outline-none">
              <option>Semua Shift</option>
              <option>Pagi</option>
              <option>Siang</option>
              <option>Malam</option>
              <option>Shift</option>
            </select>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {jobListings.map((job, i) => (
            <Card key={i} variant="glass" hover>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">{job.posisi}</h3>
                      <p className="text-sm text-gold">{job.perusahaan}</p>
                    </div>
                    <Badge variant={job.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                      {job.status === 'active' ? 'Aktif' : 'Segera Ditutup'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <MapPin className="w-3 h-3" />
                      {job.penempatan}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <DollarSign className="w-3 h-3" />
                      {job.gaji}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      {job.shift}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Users className="w-3 h-3" />
                      {job.kebutuhan} orang
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Calendar className="w-3 h-3" />
                      Deadline: {job.deadline}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" size="sm">{job.pendidikan}</Badge>
                    {job.sertifikat && <Badge variant="gold" size="sm">Wajib Sertifikat</Badge>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="gold" size="sm">Apply</Button>
                  <Button variant="ghost" size="sm" leftIcon={<BookmarkPlus className="w-4 h-4" />}>
                    Simpan
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

const jobListings = [
  {
    posisi: 'Security Officer',
    perusahaan: 'PT Secure Properti Indonesia',
    penempatan: 'Jakarta Pusat',
    gaji: 'Rp 4.5 - 5.5 JT',
    shift: 'Shift 8 Jam',
    kebutuhan: 5,
    deadline: '15 Juni 2026',
    pendidikan: 'Min. SMA/SMK',
    sertifikat: true,
    status: 'active',
  },
  {
    posisi: 'Danru Security',
    perusahaan: 'PT Garda Utama Sentosa',
    penempatan: 'Bandung',
    gaji: 'Rp 5 - 6.5 JT',
    shift: 'Shift 12 Jam',
    kebutuhan: 3,
    deadline: '20 Juni 2026',
    pendidikan: 'Min. D3',
    sertifikat: true,
    status: 'active',
  },
  {
    posisi: 'Security - Mall',
    perusahaan: 'PT Trisula Security',
    penempatan: 'Surabaya',
    gaji: 'Rp 4 - 5 JT',
    shift: 'Shift 8 Jam',
    kebutuhan: 10,
    deadline: '10 Juni 2026',
    pendidikan: 'Min. SMA/SMK',
    sertifikat: false,
    status: 'active',
  },
  {
    posisi: 'Gada Utama - Corporate',
    perusahaan: 'PT Wahana Security Services',
    penempatan: 'Jakarta Selatan',
    gaji: 'Rp 7 - 9 JT',
    shift: 'Office Hour',
    kebutuhan: 2,
    deadline: '25 Juni 2026',
    pendidikan: 'Min. S1',
    sertifikat: true,
    status: 'active',
  },
  {
    posisi: 'Bodyguard / PAM',
    perusahaan: 'PT Elang Perkasa Security',
    penempatan: 'Jakarta',
    gaji: 'Rp 6 - 8 JT',
    shift: '12 Jam',
    kebutuhan: 2,
    deadline: '18 Juni 2026',
    pendidikan: 'Min. SMA/SMK',
    sertifikat: true,
    status: 'active',
  },
];
