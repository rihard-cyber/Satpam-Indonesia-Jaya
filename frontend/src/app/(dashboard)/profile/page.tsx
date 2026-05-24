'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Avatar } from '@/components/ui';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Shield,
  Briefcase,
  Award,
  Star,
  Edit3,
  Camera,
  CheckCircle,
  Settings,
  BookOpen,
  Globe,
  Car,
  FileText,
  Upload,
  Download,
  Lock,
  Plus,
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('data-diri');

  const sections = [
    { id: 'data-diri', label: 'Data Diri', icon: User },
    { id: 'kta', label: 'KTA Digital', icon: Shield },
    { id: 'sertifikat', label: 'Sertifikat', icon: Award },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const badges = [
    { nama: 'Verified Satpam', icon: CheckCircle, color: 'text-green-400' },
    { nama: 'Anggota Aktif', icon: Star, color: 'text-gold' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent" />
          <CardContent className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="relative group">
                <Avatar name="Budi Santoso" size="xl" className="ring-4 ring-gold/20" />
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">Budi Santoso</h1>
                  <Badge variant="gold" size="sm" dot>Gada Pratama</Badge>
                </div>
                <p className="text-white/50 text-sm mt-1">@budi.santoso</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {badges.map((b) => (
                    <Badge key={b.nama} variant="default" size="sm">
                      <b.icon className={`w-3 h-3 mr-1 ${b.color}`} />
                      {b.nama}
                    </Badge>
                  ))}
                  <Badge variant="info" size="sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    Jakarta Timur
                  </Badge>
                </div>
              </div>
              <Button
                variant="gold"
                leftIcon={<Edit3 className="w-4 h-4" />}
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === s.id
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'data-diri' && <DataDiriSection isEditing={isEditing} />}
            {activeSection === 'kta' && <KTASection />}
            {activeSection === 'sertifikat' && <SertifikatSection />}
            {activeSection === 'pengaturan' && <PengaturanSection />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DataDiriSection({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              Informasi Pribadi
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {personalInfo.map((item) => (
              <div key={item.label}>
                {isEditing ? (
                  <Input label={item.label} defaultValue={item.value} />
                ) : (
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40">{item.label}</p>
                    <p className="text-sm font-medium text-white mt-0.5">{item.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gold" />
              Pengalaman & Keahlian
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/40 mb-2">Pengalaman Kerja</p>
              {isEditing ? (
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-gold/50"
                  rows={3}
                  defaultValue="Security Officer di PT Secure Properti (2022-2026)"
                />
              ) : (
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-sm text-white">Security Officer di PT Secure Properti (2022-2026)</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/40 mb-2">Keahlian</p>
                <div className="flex flex-wrap gap-2">
                  {['Turjawali', 'Bela Diri', 'First Aid', 'Crowd Control'].map((skill) => (
                    <Badge key={skill} variant="default" size="sm">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-white/40 mb-2">Bahasa</p>
                <div className="flex flex-wrap gap-2">
                  {['Indonesia', 'Inggris (Dasar)'].map((lang) => (
                    <Badge key={lang} variant="default" size="sm">{lang}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/40 mb-2">SIM</p>
                <Badge variant="info" size="sm">
                  <Car className="w-3 h-3 mr-1" />
                  SIM A & C
                </Badge>
              </div>
              <div>
                <p className="text-sm text-white/40 mb-2">Ketersediaan</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" size="sm" dot>Bersedia Shift</Badge>
                  <Badge variant="default" size="sm" dot>Penempatan Luar Kota</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KTASection() {
  return (
    <Card variant="gradient" className="border-gold/20">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            KTA Digital
          </div>
        </CardTitle>
        <Badge variant="gold" size="md">Terverifikasi</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { label: 'Nomor KTA', value: 'KTA-2026-001234' },
              { label: 'ID KTA', value: 'ID-SP-2026-5678' },
              { label: 'Tingkatan', value: 'Gada Pratama' },
              { label: 'Dikeluarkan', value: '1 Jan 2026' },
              { label: 'Masa Berlaku', value: '31 Des 2028' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm text-white/40">{item.label}</span>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            ))}
            <Button variant="gold" fullWidth leftIcon={<Upload className="w-4 h-4" />}>
              Perbarui KTA
            </Button>
          </div>
          <div className="space-y-4">
            <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 border border-gold/20 flex items-center justify-center">
              <Shield className="w-16 h-16 text-gold/20" />
            </div>
            <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 border border-white/10 flex items-center justify-center">
              <Shield className="w-16 h-16 text-white/10" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SertifikatSection() {
  return (
    <div className="space-y-4">
      {['Ijazah Satpam', 'Sertifikat Gada Pratama', 'Sertifikat First Aid', 'Sertifikat Bela Diri'].map((name) => (
        <Card key={name} variant="glass" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center">
              <Award className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-white/40">PDF • 2.4 MB</p>
            </div>
            <Badge variant="success" size="sm" dot>Terverifikasi</Badge>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
      <Button variant="outline" fullWidth leftIcon={<Plus className="w-4 h-4" />}>
        Upload Sertifikat Baru
      </Button>
    </div>
  );
}

function PengaturanSection() {
  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium text-white">Notifikasi Push</p>
              <p className="text-xs text-white/40">Terima notifikasi realtime</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 rounded-full bg-navy-600 peer-checked:bg-gold after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium text-white">Email Notifikasi</p>
              <p className="text-xs text-white/40">Info lowongan & aktivitas forum</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 rounded-full bg-navy-600 peer-checked:bg-gold after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium text-white">Profile Publik</p>
              <p className="text-xs text-white/40">Lihat oleh sesama anggota</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 rounded-full bg-navy-600 peer-checked:bg-gold after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="secondary" fullWidth leftIcon={<Lock className="w-4 h-4" />}>
            Ubah Password
          </Button>
          <Button variant="secondary" fullWidth leftIcon={<Shield className="w-4 h-4" />}>
            Verifikasi Dua Langkah
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const personalInfo = [
  { label: 'Nama Lengkap', value: 'Budi Santoso' },
  { label: 'Nama Panggilan', value: 'Budi' },
  { label: 'Tempat Lahir', value: 'Jakarta' },
  { label: 'Tanggal Lahir', value: '15 Agustus 1995' },
  { label: 'Tinggi / Berat', value: '170 cm / 65 kg' },
  { label: 'Domisili', value: 'Jakarta Timur' },
  { label: 'Email', value: 'budi@email.com' },
  { label: 'WhatsApp', value: '08123456789' },
];