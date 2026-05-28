'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, Button, Avatar, Badge } from '@/components/ui';
import { ArrowLeft, Send, Users, Loader2, MessageSquare } from 'lucide-react';
import { getTimeAgo, formatDate } from '@/lib/utils';

interface UserInfo {
  id: string;
  nama_lengkap: string;
  email: string;
  foto_profil_url: string | null;
}

interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  type: string;
  attachment_url: string | null;
  created_at: string;
  nama_lengkap: string;
  foto_profil_url: string | null;
}

interface RoomDetail {
  id: string;
  nama: string | null;
  type: string;
}

interface RoomMember {
  id: string;
  user_id: string;
  nama_lengkap: string;
  foto_profil_url: string | null;
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserIdRef = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/rooms/${roomId}`);
      const json = await res.json();
      if (json.data) {
        setRoom(json.data);
        setMembers(json.members || []);
      }
    } catch {}
  }, [roomId]);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/rooms/${roomId}/messages?limit=50`);
      const json = await res.json();
      setMessages(json.data || []);
    } catch {}
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const init = async () => {
      setLoading(true);
      await Promise.all([loadRoom(), loadMessages()]);
      setLoading(false);
      scrollToBottom();
      fetch('/api/chat/rooms/' + roomId + '/read', { method: 'POST' }).catch(() => {});
    };
    init();

    const interval = setInterval(() => {
      loadMessages();
      fetch('/api/chat/rooms/' + roomId + '/read', { method: 'POST' }).catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId, loadRoom, loadMessages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim(), type: 'text' }),
      });
      const json = await res.json();
      if (json.data) {
        setInput('');
        await loadMessages();
        scrollToBottom();
      }
    } catch {}
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRoomName = () => {
    if (room?.nama) return room.nama;
    if (room?.type === 'direct' && members.length > 0) {
      const other = members.find(m => m.user_id !== currentUserIdRef.current);
      return other?.nama_lengkap || 'Percakapan';
    }
    if (room?.type === 'group') return 'Grup';
    return 'Chat';
  };

  const groupMessagesByDate = (msgs: ChatMessage[]) => {
    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = '';
    for (const msg of msgs) {
      const date = new Date(msg.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <Card variant="gradient" className="flex flex-col flex-1 overflow-hidden p-0">
          <div className="flex items-center gap-3 p-4 border-b border-white/5">
            <Button variant="ghost" size="sm" onClick={() => router.push('/chat')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-gold/60" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">{loading ? 'Memuat...' : getRoomName()}</h2>
              {!loading && (
                <p className="text-xs text-white/40 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {members.length} anggota
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gold" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/40">Belum ada pesan</p>
                <p className="text-white/20 text-sm mt-1">Kirim pesan pertama</p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedMessages.map((group) => (
                  <div key={group.date}>
                    <div className="flex justify-center mb-4">
                      <Badge variant="default" size="sm">{group.date}</Badge>
                    </div>
                    <div className="space-y-3">
                      {group.messages.map((msg) => {
                        const isOwn = msg.user_id === currentUserIdRef.current;
                        const isSystem = msg.type === 'system';
                        return isSystem ? (
                          <div key={msg.id} className="flex justify-center">
                            <Badge variant="info" size="sm">{msg.message}</Badge>
                          </div>
                        ) : (
                          <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                            <Avatar name={msg.nama_lengkap} src={msg.foto_profil_url} size="sm" />
                            <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                              {!isOwn && (
                                <span className="text-xs text-white/40 mb-1 ml-1">{msg.nama_lengkap}</span>
                              )}
                              <div className={`rounded-2xl px-4 py-2.5 ${isOwn ? 'bg-gold/10 border border-gold/20' : 'bg-navy-700/50 border border-white/5'}`}>
                                <p className="text-sm text-white/90 whitespace-pre-wrap break-words">{msg.message}</p>
                              </div>
                              <span className="text-[10px] text-white/20 mt-1">{getTimeAgo(msg.created_at)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..." disabled={loading}
                className="flex-1 bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/50 transition-colors disabled:opacity-50" />
              <Button onClick={handleSend} disabled={!input.trim() || sending || loading} isLoading={sending} size="lg" className="!px-4">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
