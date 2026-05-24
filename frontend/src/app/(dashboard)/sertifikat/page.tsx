'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  Award,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Shield,
  GraduationCap,
  Plus,
  Download,
} from 'lucide-react';

const sertifikatKategori = [
  { nama: 'KTA Digital', icon: Shield, color: 'from-blue-500 to-blue-700', count: 1 },
  { nama: 'Ijazah Satpam', icon: Award, color: 'from-gold to-gold-dark', count: 2 },
  { nama: 'Sertifikat Pelatihan', icon: GraduationCap, color: 'from-green-500 to-green-700', count: 3 },
  { nama: 'Bela Diri & Damkar', icon: FileText, color: 'from-red-500 to-red-700', count: 1 },
];

export default function SertifikatPage() {
  const [activeTab, setActiveTab] = useState('sertifikat');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Sertifikat & Dokumen</h1>
            <p className="text-white/40 mt-1">KTA Digital, Sertifikat, dan Dokumen Penting</p>
          </div>
          <Button variant="gold" leftIcon={<Plus className="w-4 h-4" />}>
            Upload Baru
          </Button>
        </div>

        {/* Kategori Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {sertifikatKategori.map((kat) => (
            <div
              key={kat.nama}
              className="p-4 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 border border-white/5 hover:border-gold/20 transition-all cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kat.color} flex items-center justify-center mb-3`}>
                <kat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white">{kat.nama}</p>
              <p className="text-xs text-white/40">{kat.count} dokumen</p>
            </div>
          ))}
        </div>

        {/* KTA Digital Section */}
        <Card variant="gradient" className="border-gold/20">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                KTA Digital
              </div>
            </CardTitle>
            <Badge variant="gold" size="md">
              <CheckCircle className="w-4 h-4 mr-1" /> Terverifikasi
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nomor KTA', value: 'KTA-2026-001234' },
                    { label: 'ID KTA', value: 'ID-SP-2026-5678' },
                    { label: 'Tingkatan', value: 'Gada Pratama' },
                    { label: 'Masa Berlaku', value: '31 Des 2028' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-white/5">
                      <p className="text-xs text-white/40">{item.label}</p>
                      <p className="text-sm font-medium text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                  Download KTA
                </Button>
              </div>
              <div className="relative aspect-[16/10] rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 border border-gold/20 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-gold/30 mx-auto mb-2" />
                  <p className="text-xs text-white/40">Preview KTA Digital</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sertifikat List */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                Sertifikat Saya
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {certificateList.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center">
                    <Award className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{cert.nama}</p>
                    <p className="text-xs text-white/40">{cert.penerbit} • {cert.tanggal}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          cert.status === 'verified' ? 'success' :
                          cert.status === 'pending' ? 'warning' : 'danger'
                        }
                        size="sm"
                        dot
                      >
                        {cert.status === 'verified' ? 'Terverifikasi' :
                         cert.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

const certificateList = [
  { nama: 'Ijazah Satpam', penerbit: 'Lemdiklat Satpam', tanggal: '15 Jan 2026', status: 'verified' },
  { nama: 'Sertifikat Gada Pratama', penerbit: 'Kemenkumham RI', tanggal: '20 Feb 2026', status: 'verified' },
  { nama: 'Sertifikat First Aid', penerbit: 'PMI', tanggal: '10 Mar 2026', status: 'verified' },
  { nama: 'Sertifikat Bela Diri', penerbit: 'KPSI', tanggal: '5 Apr 2026', status: 'pending' },
  { nama: 'Sertifikat Damkar', penerbit: 'Damkar DKI', tanggal: '1 Mei 2026', status: 'pending' },
];
