'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { BookOpen, Clock, ChevronLeft, Bot, Send, Sparkles } from 'lucide-react';

export default function MateriDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [materi, setMateri] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: string; message: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/materi/${params.slug}`);
        const json = await res.json();
        if (json.data) setMateri(json.data);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, [params.slug]);

  const handleAIAsk = async () => {
    if (!aiInput.trim()) return;
    const q = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', message: q }]);
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, contextTitle: materi?.judul }),
      });
      const json = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant', message: json.reply }]);
    } catch {} finally {
      setAiLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div></DashboardLayout>;

  if (!materi) return <DashboardLayout><div className="text-center py-20"><p className="text-white/40">Materi tidak ditemukan</p><Button onClick={() => router.push('/materi')} className="mt-4">Kembali</Button></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => router.push('/materi')} className="flex items-center gap-2 text-sm text-white/40 hover:text-gold transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Materi
        </button>

        <Card variant="gradient">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="info" size="sm">{materi.kategori_nama}</Badge>
              <Badge variant="gold" size="sm">{materi.tingkatan_nama}</Badge>
              <div className="flex items-center gap-1 text-xs text-white/40 ml-auto">
                <Clock className="w-3 h-3" /> {materi.durasi_menit} menit
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">{materi.judul}</h1>
            {materi.ringkasan && (
              <p className="text-sm text-white/50 mb-6 italic">{materi.ringkasan}</p>
            )}
            <div className="prose prose-invert max-w-none text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {materi.konten || 'Konten materi sedang dalam pengembangan.'}
            </div>
          </CardContent>
        </Card>

        {materi.video_url && (
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Video Pembelajaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-xl bg-navy-800 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gold/30" />
              </div>
            </CardContent>
          </Card>
        )}

        <button
          onClick={() => setShowAI(!showAI)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gold text-black flex items-center justify-center shadow-lg shadow-gold/30 hover:bg-gold-light transition-all z-50"
        >
          <Bot className="w-6 h-6" />
        </button>

        {showAI && (
          <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] z-50">
            <Card variant="gradient" className="border-gold/20">
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-white">Tanya AI tentang {materi.judul}</span>
                </div>
                <div className="h-64 overflow-y-auto space-y-2 mb-3 text-sm">
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`p-2 rounded-lg ${m.role === 'user' ? 'bg-gold/10 text-right' : 'bg-navy-700/50'}`}>
                      <p className="text-white/80 text-xs whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                  {aiLoading && <p className="text-xs text-white/30 animate-pulse">Mengetik...</p>}
                </div>
                <div className="flex gap-2">
                  <input
                    value={aiInput} onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAIAsk()}
                    placeholder="Tanya tentang materi ini..."
                    className="flex-1 bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-gold/50"
                  />
                  <Button size="sm" onClick={handleAIAsk} disabled={!aiInput.trim() || aiLoading}>
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
