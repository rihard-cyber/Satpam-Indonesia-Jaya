'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar, Input } from '@/components/ui';
import { MessageSquare, Plus, Search, Users, ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import { formatDate, getTimeAgo } from '@/lib/utils';

interface ChatRoom {
  id: string;
  nama: string | null;
  type: 'direct' | 'group' | 'team';
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

interface User {
  id: string;
  nama_lengkap: string;
  email: string;
  foto_profil_url: string | null;
}

export default function ChatListPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/rooms');
      const json = await res.json();
      setRooms(json.data || []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        setSearchResults((json.data || []).filter((u: User) => !selectedUsers.find(su => su.id === u.id)));
      } catch { setSearchResults([]); }
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedUsers]);

  const addUser = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const createChat = async () => {
    if (selectedUsers.length === 0) return;
    setCreating(true);
    try {
      const type = selectedUsers.length === 1 ? 'direct' : 'group';
      const res = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          nama: type === 'group' ? groupName || undefined : undefined,
          member_ids: selectedUsers.map(u => u.id),
        }),
      });
      const json = await res.json();
      if (json.data) {
        setShowNewChat(false);
        setSelectedUsers([]);
        setGroupName('');
        router.push(`/chat/${json.data.id}`);
      }
    } catch {}
    setCreating(false);
  };

  const getRoomName = (room: ChatRoom) => {
    if (room.nama) return room.nama;
    if (room.type === 'direct') return 'Percakapan';
    if (room.type === 'group') return 'Grup';
    return 'Tim';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Chat</h1>
            <p className="text-white/40 mt-1">Komunikasi tim keamanan</p>
          </div>
          <Button variant="gold" onClick={() => setShowNewChat(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Chat Baru
          </Button>
        </div>

        <Card variant="glass">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-gold" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MessageSquare className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/40">Belum ada percakapan</p>
                <p className="text-white/20 text-sm mt-1">Mulai chat dengan anggota tim</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowNewChat(true)}>
                  Mulai Chat
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {rooms.map((room) => (
                  <div key={room.id} onClick={() => router.push(`/chat/${room.id}`)}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center">
                        {room.type === 'direct' ? (
                          <Users className="w-5 h-5 text-gold/60" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-gold/60" />
                        )}
                      </div>
                      {room.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                          <span className="text-xs font-bold text-black">{room.unread_count > 9 ? '9+' : room.unread_count}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white truncate">{getRoomName(room)}</h3>
                        {room.last_message_at && (
                          <span className="text-xs text-white/30 flex-shrink-0 ml-2">{getTimeAgo(room.last_message_at)}</span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 truncate mt-1">
                        {room.last_message || 'Belum ada pesan'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card variant="gradient" className="w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-gold" />
                  Chat Baru
                </div>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowNewChat(false); setSelectedUsers([]); setGroupName(''); }}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedUsers.length > 1 && (
                <Input label="Nama Grup" value={groupName} onChange={e => setGroupName(e.target.value)}
                  placeholder="Nama grup chat..." />
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Cari Anggota</label>
                <div className="relative">
                  <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau email..." leftIcon={<Search className="w-4 h-4" />} />
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <Badge key={user.id} variant="gold">
                      {user.nama_lengkap}
                      <button onClick={() => removeUser(user.id)} className="ml-1.5 text-gold/60 hover:text-gold">&times;</button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="max-h-48 overflow-y-auto space-y-1">
                {searching && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gold" />
                  </div>
                )}
                {!searching && searchResults.map(user => (
                  <button key={user.id} onClick={() => addUser(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                    <Avatar name={user.nama_lengkap} src={user.foto_profil_url} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.nama_lengkap}</p>
                      <p className="text-xs text-white/40 truncate">{user.email}</p>
                    </div>
                    <Plus className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  </button>
                ))}
                {!searching && searchQuery && searchResults.length === 0 && (
                  <p className="text-sm text-white/30 text-center py-4">Tidak ditemukan</p>
                )}
              </div>

              <Button variant="gold" fullWidth onClick={createChat} disabled={selectedUsers.length === 0 || creating} isLoading={creating}>
                {selectedUsers.length <= 1 ? 'Mulai Chat' : 'Buat Grup'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
