'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { Bot, Send, Sparkles, MessageSquare, Trash2, Plus, Shield, BookOpen, AlertTriangle, HelpCircle } from 'lucide-react';

const suggestions = [
  { icon: HelpCircle, text: 'Apa tugas Danru?', color: 'text-blue-400' },
  { icon: BookOpen, text: 'Cara membuat incident report?', color: 'text-green-400' },
  { icon: Shield, text: 'Apa itu Turjawali?', color: 'text-gold' },
  { icon: AlertTriangle, text: 'SOP kehilangan barang?', color: 'text-red-400' },
];

type ChatMessage = { role: 'assistant' | 'user'; message: string };

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', message: 'Halo! Saya AI Assistant Satpam Indonesia JAYA. Saya siap membantu menjawab pertanyaan seputar keamanan, prosedur satpam, dan tugas-tugas security. Ada yang bisa saya bantu?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const json = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', message: json.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', message: 'Maaf, terjadi gangguan. Silakan coba lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Assistant Security</h1>
          <p className="text-white/40 mt-1">Tanya apapun tentang keamanan dan profesi Satpam</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <Card variant="gradient">
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-white">Saran Pertanyaan</span>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button key={s.text} onClick={() => setInput(s.text)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                      <span className="text-xs text-white/60 truncate">{s.text}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card variant="gradient" className="h-[calc(100vh-280px)] flex flex-col">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-gold" />
                    AI Assistant
                    <Badge variant="gold" size="sm">Satpam AI</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-gold to-gold-dark' : 'bg-navy-600'}`}>
                        {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-black" /> : <span className="text-xs font-bold text-white">U</span>}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'assistant' ? 'bg-navy-700/50 border border-white/5' : 'bg-gold/10 border border-gold/20'}`}>
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
                  <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Tanya apapun tentang keamanan..."
                    className="flex-1 bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/50 transition-colors" />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="lg" className="!px-4">
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
