'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '@/components/ui';
import {
  Users, Shield, Mail, Phone, Clock, UserPlus,
  Trash2, ArrowLeft, Search, MapPin, Building, Crown, Star, User
} from 'lucide-react';
import { getTimeAgo } from '@/lib/utils';

interface TeamDetail {
  id: string;
  nama_team: string;
  perusahaan?: string;
  lokasi?: string;
  is_active: boolean;
  members: Member[];
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  nama_lengkap: string;
  nama_panggilan?: string;
  foto_profil_url?: string;
  email: string;
  phone?: string;
  last_login_at?: string;
  is_active: boolean;
  user_role: string;
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('anggota');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const loadTeam = useCallback(async () => {
    try {
      const res = await fetch(`/api/komandan/teams/${params.id}`);
      const json = await res.json();
      if (json.data) setTeam(json.data);
    } catch {}
    setLoading(false);
  }, [params.id]);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError('');

    try {
      const res = await fetch(`/api/komandan/teams/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: searchEmail, role: selectedRole }),
      });

      if (res.ok) {
        setSearchEmail('');
        loadTeam();
      } else {
        const err = await res.json();
        setError(err.message || 'Gagal menambahkan anggota');
      }
    } catch {
      setError('Terjadi kesalahan');
    }
    setAdding(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Yakin ingin menghapus anggota ini?')) return;
    try {
      await fetch(`/api/komandan/teams/${params.id}?member_id=${memberId}`, { method: 'DELETE' });
      loadTeam();
    } catch {}
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!team) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-white/40">Tim tidak ditemukan</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.push('/komandan')}>
            Kembali
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const roleIcon = (role: string) => {
    switch (role) {
      case 'komandan': return <Crown className="w-4 h-4 text-gold" />;
      case 'danru': return <Star className="w-4 h-4 text-blue-400" />;
      default: return <User className="w-4 h-4 text-white/40" />;
    }
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case 'komandan': return <Badge variant="gold" size="sm">Komandan</Badge>;
      case 'danru': return <Badge variant="info" size="sm">Danru</Badge>;
      default: return <Badge variant="default" size="sm">Anggota</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button onClick={() => router.push('/komandan')} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <Card variant="gradient">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{team.nama_team}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                  {team.perusahaan && <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {team.perusahaan}</span>}
                  {team.lokasi && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {team.lokasi}</span>}
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {team.members.length} anggota</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="gold">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Tambah Anggota</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Cari email anggota..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  required
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="anggota">Anggota</option>
                <option value="danru">Danru</option>
              </select>
              <Button variant="gold" type="submit" isLoading={adding} leftIcon={<UserPlus className="w-4 h-4" />}>
                Tambah
              </Button>
            </form>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gold" /> Daftar Anggota</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/5">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-sm font-medium text-white/70">
                    {member.nama_lengkap?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{member.nama_lengkap}</span>
                      {roleBadge(member.role)}
                      {!member.is_active && <Badge variant="danger" size="sm">Nonaktif</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {member.email}</span>
                      {member.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {member.phone}</span>}
                      {member.last_login_at && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getTimeAgo(member.last_login_at)}</span>
                      )}
                    </div>
                  </div>
                  {member.role !== 'komandan' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {team.members.length === 0 && (
                <p className="text-sm text-white/30 text-center py-8">Belum ada anggota</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
