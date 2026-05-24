'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { MessageCircle, Heart, Eye, Pin, Plus, MessageSquare, TrendingUp, Flame, ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ForumPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('');

  async function loadForum(cat: string) {
    setLoading(true);
    try {
      const url = cat !== 'Semua' ? `/api/forum?category=${encodeURIComponent(cat)}` : '/api/forum';
      const res = await fetch(url);
      const json = await res.json();
      setPosts(json.data || []);
      setCategories(json.categories || []);
      setStats(json.stats || {});
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadForum(activeCategory); }, [activeCategory]);

  const handleCreate = async () => {
    if (!newTitle || !newContent || !newCategory) return;
    try {
      await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: newCategory, judul: newTitle, konten: newContent }),
      });
      setShowCreate(false);
      setNewTitle(''); setNewContent(''); setNewCategory('');
      loadForum(activeCategory);
    } catch {}
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Forum Komunitas</h1>
            <p className="text-white/40 mt-1">Diskusi dan berbagi dengan sesama Satpam Indonesia</p>
          </div>
          <Button variant="gold" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
            Buat Post
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button key="all" onClick={() => setActiveCategory('Semua')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === 'Semua' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-navy-800 text-white/50 border border-white/5 hover:bg-navy-700'}`}>Semua</button>
          {categories.map((cat: any) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.nama)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.nama ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-navy-800 text-white/50 border border-white/5 hover:bg-navy-700'}`}>{cat.nama}</button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
            ) : posts.length === 0 ? (
              <Card variant="glass"><div className="p-12 text-center text-white/30">Belum ada diskusi</div></Card>
            ) : posts.map((post: any) => (
              <Card key={post.id} variant="glass" hover>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-black">{(post.author_name || 'U')[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{post.author_name}</span>
                      <span className="text-xs text-white/30">{new Date(post.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="info" size="sm">{post.category_name}</Badge>
                      {post.is_pinned && <Badge variant="warning" size="sm" dot><Pin className="w-3 h-3 mr-1" /> Disematkan</Badge>}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">{post.judul}</h3>
                    <p className="text-sm text-white/50 line-clamp-2">{post.konten}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
                      <div className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{post.likes_count}</div>
                      <div className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{post.comment_count}</div>
                      <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views_count}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle><div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gold" /> Statistik Forum</div></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Post', value: stats.total_posts || 0 },
                    { label: 'Member', value: stats.total_members || 0 },
                    { label: 'Komentar', value: stats.total_comments || 0 },
                    { label: 'Online', value: '12' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl bg-white/5">
                      <p className="text-lg font-bold text-gold">{stat.value}</p>
                      <p className="text-xs text-white/40">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showCreate && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
            <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-white mb-4">Buat Post Baru</h2>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-2.5 text-sm text-white outline-none mb-3">
                <option value="">Pilih kategori</option>
                {categories.map((c: any) => <option key={c.id} value={c.id} className="bg-navy-800">{c.nama}</option>)}
              </select>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-2.5 text-sm text-white outline-none mb-3" placeholder="Judul post..." />
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows={5}
                className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-2.5 text-sm text-white outline-none mb-4" placeholder="Isi post..." />
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={() => setShowCreate(false)}>Batal</Button>
                <Button variant="gold" onClick={handleCreate} disabled={!newTitle || !newContent || !newCategory}>Posting</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
