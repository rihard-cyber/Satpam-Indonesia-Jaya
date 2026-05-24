'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Avatar } from '@/components/ui';
import { User, MapPin, Mail, Shield, Award, Edit3, Camera, CheckCircle, Star, Settings, Phone, BookOpen, Globe, Car, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [kta, setKta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('data-diri');

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/profile');
        const json = await res.json();
        if (json.data) setProfile(json.data);
        if (json.badges) setBadges(json.badges);
        if (json.kta) setKta(json.kta);
        setForm({
          nama_lengkap: json.data?.nama_lengkap || '',
          nama_panggilan: json.data?.nama_panggilan || '',
          tempat_lahir: json.data?.tempat_lahir || '',
          tanggal_lahir: json.data?.tanggal_lahir || '',
          tinggi_cm: json.data?.tinggi_cm || '',
          berat_kg: json.data?.berat_kg || '',
          domisili: json.data?.domisili || '',
          provinsi: json.data?.provinsi || '',
          pengalaman_kerja: json.data?.pengalaman_kerja || '',
          keahlian: json.data?.keahlian || [],
          bahasa: json.data?.bahasa || [],
          nomor_sim: json.data?.nomor_sim || '',
          tentang_saya: json.data?.tentang_saya || '',
        });
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setProfile((prev: any) => ({ ...prev, ...form }));
        setIsEditing(false);
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'data-diri', label: 'Data Diri', icon: User },
    { id: 'kta', label: 'KTA Digital', icon: Shield },
    { id: 'sertifikat', label: 'Sertifikat', icon: Award },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const badgeList = [
    ...badges.map((b: any) => ({ nama: b.nama, icon: CheckCircle, color: 'text-green-400' })),
    { nama: 'Anggota Aktif', icon: Star, color: 'text-gold' },
  ];

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent" />
          <CardContent className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="relative group">
                <Avatar name={profile?.nama_lengkap || session?.user?.name || 'User'} size="xl" className="ring-4 ring-gold/20" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">{profile?.nama_lengkap || session?.user?.name || 'User'}</h1>
                  {profile?.tingkatan_nama && <Badge variant="gold" size="sm" dot>{profile.tingkatan_nama}</Badge>}
                </div>
                <p className="text-white/50 text-sm mt-1">{session?.user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {badgeList.map((b: any) => (
                    <Badge key={b.nama} variant="default" size="sm">
                      <b.icon className={`w-3 h-3 mr-1 ${b.color}`} /> {b.nama}
                    </Badge>
                  ))}
                  {profile?.domisili && <Badge variant="info" size="sm"><MapPin className="w-3 h-3 mr-1" />{profile.domisili}</Badge>}
                </div>
              </div>
              <Button variant="gold" leftIcon={<Edit3 className="w-4 h-4" />} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Batal' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              ><s.icon className="w-4 h-4" />{s.label}</button>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'data-diri' && (
              <div className="space-y-6">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle><div className="flex items-center gap-2"><User className="w-5 h-5 text-gold" /> Informasi Pribadi</div></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Nama Lengkap', key: 'nama_lengkap' },
                        { label: 'Nama Panggilan', key: 'nama_panggilan' },
                        { label: 'Email', key: 'email', value: session?.user?.email },
                        { label: 'WhatsApp', key: 'phone', value: profile?.phone },
                        { label: 'Tempat Lahir', key: 'tempat_lahir' },
                        { label: 'Tgl Lahir', key: 'tanggal_lahir' },
                        { label: 'Tinggi (cm)', key: 'tinggi_cm' },
                        { label: 'Berat (kg)', key: 'berat_kg' },
                        { label: 'Domisili', key: 'domisili' },
                        { label: 'Provinsi', key: 'provinsi' },
                      ].map((item) => (
                        <div key={item.key}>
                          {isEditing && item.key !== 'email' ? (
                            <Input label={item.label} value={form[item.key] || ''} onChange={e => setForm({ ...form, [item.key]: e.target.value })} />
                          ) : (
                            <div className="p-3 rounded-xl bg-white/5">
                              <p className="text-xs text-white/40">{item.label}</p>
                              <p className="text-sm font-medium text-white mt-0.5">{item.value || form[item.key] || '-'}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle><div className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-gold" /> Pengalaman & Keahlian</div></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-white/40 mb-2">Pengalaman Kerja</p>
                        {isEditing ? (
                          <textarea className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-gold/50" rows={3}
                            value={form.pengalaman_kerja || ''} onChange={e => setForm({ ...form, pengalaman_kerja: e.target.value })} />
                        ) : (
                          <div className="p-3 rounded-xl bg-white/5"><p className="text-sm text-white">{form.pengalaman_kerja || '-'}</p></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white/40 mb-2">Tentang Saya</p>
                        {isEditing ? (
                          <textarea className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-gold/50" rows={3}
                            value={form.tentang_saya || ''} onChange={e => setForm({ ...form, tentang_saya: e.target.value })} />
                        ) : (
                          <div className="p-3 rounded-xl bg-white/5"><p className="text-sm text-white">{form.tentang_saya || '-'}</p></div>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsEditing(false)}>Batal</Button>
                        <Button variant="gold" onClick={handleSave} isLoading={saving}>Simpan</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'kta' && kta && (
              <Card variant="gradient" className="border-gold/20">
                <CardHeader>
                  <CardTitle><div className="flex items-center gap-2"><Shield className="w-5 h-5 text-gold" /> KTA Digital</div></CardTitle>
                  <Badge variant="gold" size="md">{kta.status === 'verified' ? 'Terverifikasi' : 'Pending'}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Nomor KTA', value: kta.nomor_kta },
                      { label: 'ID KTA', value: kta.id_kta },
                      { label: 'Tingkatan', value: profile?.tingkatan_nama },
                      { label: 'Dikeluarkan', value: kta.tanggal_dikeluarkan },
                      { label: 'Masa Berlaku', value: kta.tanggal_expired },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-sm text-white/40">{item.label}</span>
                        <span className="text-sm font-medium text-white">{item.value || '-'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'kta' && !kta && (
              <Card variant="glass"><CardContent><p className="text-center text-white/40 py-8">Belum ada KTA Digital</p></CardContent></Card>
            )}

            {activeSection === 'sertifikat' && <SertifikatSection />}
            {activeSection === 'pengaturan' && <PengaturanSection />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SertifikatSection() {
  const [certs, setCerts] = useState<any[]>([]);
  useEffect(() => { fetch('/api/certificates').then(r => r.json()).then(j => setCerts(j.data || [])).catch(() => {}); }, []);
  return (
    <div className="space-y-4">
      {certs.length === 0 && <Card variant="glass"><CardContent><p className="text-center text-white/40 py-8">Belum ada sertifikat</p></CardContent></Card>}
      {certs.map((c: any) => (
        <Card key={c.id} variant="glass" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center"><Award className="w-6 h-6 text-gold" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{c.nama_sertifikat}</p>
              <p className="text-xs text-white/40">{c.penerbit || '-'}</p>
            </div>
            <Badge variant={c.is_verified ? 'success' : 'warning'} size="sm" dot>{c.is_verified ? 'Terverifikasi' : 'Pending'}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PengaturanSection() {
  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader><CardTitle>Pengaturan Akun</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {['Notifikasi Push', 'Email Notifikasi', 'Profile Publik'].map((label) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/40">Aktifkan/nonaktifkan</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 rounded-full bg-navy-600 peer-checked:bg-gold after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
