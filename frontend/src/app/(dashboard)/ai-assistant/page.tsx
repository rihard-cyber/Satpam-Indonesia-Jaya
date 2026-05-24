'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  Bot,
  Send,
  Sparkles,
  MessageSquare,
  Trash2,
  Plus,
  Shield,
  BookOpen,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

const suggestions = [
  { icon: HelpCircle, text: 'Apa tugas Danru?', color: 'text-blue-400' },
  { icon: BookOpen, text: 'Cara membuat incident report?', color: 'text-green-400' },
  { icon: Shield, text: 'Apa itu Turjawali?', color: 'text-gold' },
  { icon: AlertTriangle, text: 'SOP kehilangan barang?', color: 'text-red-400' },
];

type ChatMessage = { role: 'assistant' | 'user'; message: string };

const initialMessages: ChatMessage[] = [
  { role: 'assistant', message: 'Halo! Saya AI Assistant Satpam Indonesia JAYA. Saya siap membantu menjawab pertanyaan seputar keamanan, prosedur satpam, dan tugas-tugas security. Ada yang bisa saya bantu?' },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', message: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sessions = [
    { id: 'default', title: 'Chat Security', model: 'Gemini', date: 'Hari ini' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Assistant Security</h1>
          <p className="text-white/40 mt-1">Tanya apapun tentang keamanan dan profesi Satpam</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Button variant="gold" fullWidth leftIcon={<Plus className="w-4 h-4" />}>
              Chat Baru
            </Button>

            <Card variant="gradient">
              <CardContent>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setActiveSession(session.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        activeSession === session.id
                          ? 'bg-gold/10 border border-gold/20'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{session.title}</p>
                        <p className="text-xs text-white/30">{session.date}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-white">Saran Pertanyaan</span>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.text}
                      onClick={() => setInput(s.text)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                      <span className="text-xs text-white/60 truncate">{s.text}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card variant="gradient" className="h-[calc(100vh-280px)] flex flex-col">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-gold" />
                    AI Assistant
                    <Badge variant="gold" size="sm">Gemini Pro</Badge>
                  </div>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === 'assistant'
                            ? 'bg-gradient-to-br from-gold to-gold-dark'
                            : 'bg-navy-600'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <Bot className="w-4 h-4 text-black" />
                        ) : (
                          <span className="text-xs font-bold text-white">U</span>
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'assistant'
                            ? 'bg-navy-700/50 border border-white/5'
                            : 'bg-gold/10 border border-gold/20'
                        }`}
                      >
                        <p className="text-sm text-white/80 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                      <div className="bg-navy-700/50 border border-white/5 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya apapun tentang keamanan..."
                    className="flex-1 bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/50 transition-colors"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="lg"
                    className="!px-4"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-white/20 mt-2 text-center">
                  AI Assistant dapat membuat kesalahan. Verifikasi informasi penting dengan sumber resmi.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('danru')) {
    return 'Danru (Komandan Regu) adalah pemimpin regu satpam yang bertanggung jawab atas:\n\n1. Mengkoordinasikan anggota regu saat bertugas\n2. Memastikan pelaksanaan SOP\n3. Melakukan briefing sebelum shift\n4. Mengawasi pos-pos penjagaan\n5. Melaporkan situasi ke atasan\n\nDanru biasanya memegang tingkatan Gada Madya.';
  }
  if (q.includes('incident report') || q.includes('laporan')) {
    return 'Cara membuat Incident Report yang baik:\n\n1. **Identifikasi**: Catat waktu, lokasi, dan pihak terlibat\n2. **Kronologi**: Deskripsikan kejadian secara detail dan berurutan\n3. **Tindakan**: Apa yang sudah dilakukan saat kejadian\n4. **Dampak**: Kerugian/korban yang ditimbulkan\n5. **Rekomendasi**: Saran pencegahan ke depannya\n\nGunakan format 5W+1H (What, Who, When, Where, Why, How).';
  }
  if (q.includes('turjawali')) {
    return '**Turjawali** adalah singkatan dari:\n\n- **TUR** : Pengaturan\n- **JA** : Penjagaan\n- **WA** : Pengawalan\n- **LI** : Patroli\n\nMerupakan tugas pokok Satpam dalam melaksanakan pengamanan di lingkungan kerjanya.';
  }
  if (q.includes('sop') && (q.includes('kehilangan') || q.includes('barang'))) {
    return 'SOP Kehilangan Barang:\n\n1. **Amankan TKP** - Jangan biarkan siapapun menyentuh barang\n2. **Laporkan** - Segera laporkan ke atasan/Danru\n3. **Dokumentasi** - Foto lokasi dan kondisi sekitar\n4. **Kumpulkan Info** - CCTV, saksi, dan data terkait\n5. **Buat Laporan** - Incident Report lengkap\n6. **Tindak Lanjut** - Koordinasi dengan pihak berwajib jika perlu';
  }
  if (q.includes('gada madya') && q.includes('gada utama')) {
    return '**Perbedaan Gada Madya dan Gada Utama:**\n\n**Gada Madya:**\n- Setara Danru / Supervisor\n- Fokus pada taktis & operasional\n- Manajemen tim kecil\n\n**Gada Utama:**\n- Setara Manajer Keamanan\n- Fokus pada strategis\n- Manajemen risiko korporat\n- Pengambilan keputusan tingkat atas\n\nGada Utama adalah level tertinggi dalam sertifikasi Satpam.';
  }
  return 'Terima kasih atas pertanyaannya. Dalam konteks keamanan dan profesi Satpam, hal ini perlu ditinjau dari SOP yang berlaku dan peraturan perusahaan. Saya sarankan untuk:\n\n1. Mengecek modul materi yang relevan di halaman Materi Satpam\n2. Berdiskusi dengan rekan di Forum Komunitas\n3. Jika terkait prosedur darurat, segera konsultasi dengan atasan/Danru\n\nAda hal lain yang bisa saya bantu?';
}
