'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  MessageCircle,
  Heart,
  Eye,
  Pin,
  Plus,
  MessageSquare,
  TrendingUp,
  Flame,
  ThumbsUp,
} from 'lucide-react';
import { getTimeAgo } from '@/lib/utils';

const categories = [
  'Semua', 'Tanya Jawab', 'Berbagi Pengalaman', 'Informasi Training',
  'Informasi Loker', 'Keamanan Nasional', 'Bela Diri', 'Peralatan Security',
];

export default function ForumPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Forum Komunitas</h1>
            <p className="text-white/40 mt-1">Diskusi dan berbagi dengan sesama Satpam Indonesia</p>
          </div>
          <Button variant="gold" leftIcon={<Plus className="w-4 h-4" />}>
            Buat Post
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'bg-navy-800 text-white/50 border border-white/5 hover:bg-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {forumPosts.map((post, i) => (
              <Card key={i} variant="glass" hover>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-black">{post.author[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{post.author}</span>
                      <Badge variant={post.authorBadge === 'Verified Satpam' ? 'gold' : 'default'} size="sm">
                        {post.authorBadge}
                      </Badge>
                      <span className="text-xs text-white/30">{getTimeAgo(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="info" size="sm">{post.category}</Badge>
                      {post.isPinned && (
                        <Badge variant="warning" size="sm" dot>
                          <Pin className="w-3 h-3 mr-1" /> Disematkan
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1">{post.title}</h3>
                    <p className="text-sm text-white/50 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-gold" />
                    Trending
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                      <span className="text-xs font-bold text-gold w-5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{topic.title}</p>
                        <p className="text-xs text-white/30">{topic.replies} balasan</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gold" />
                    Statistik Forum
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {forumStats.map((stat) => (
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
      </div>
    </DashboardLayout>
  );
}

const forumPosts = [
  {
    author: 'Budi Santoso',
    authorBadge: 'Verified Satpam',
    category: 'Berbagi Pengalaman',
    title: 'Pengalaman Saya Lulus Ujian Gada Madya',
    content: 'Setelah 3 tahun jadi Satpam, akhirnya saya berhasil lulus ujian Gada Madya. Ingin berbagi tips dan pengalaman buat yang mau mengambil ujian...',
    likes: 45,
    comments: 12,
    views: 230,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
  },
  {
    author: 'Ahmad Rizki',
    authorBadge: 'Verified Danru',
    category: 'Tanya Jawab',
    title: 'Cara Menangani Tamu Agresif di Area Resepsionis',
    content: 'Ada rekan yang punya pengalaman menangani tamu agresif? Saya butuh masukan untuk SOP yang tepat...',
    likes: 23,
    comments: 8,
    views: 156,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
  },
  {
    author: 'Dedi Kurniawan',
    authorBadge: 'Verified Instructor',
    category: 'Informasi Training',
    title: 'Jadwal Pelatihan Gada Pratama Batch Juni 2026',
    content: 'Informasi terbaru jadwal pelatihan Gada Pratama untuk bulan Juni 2026 di wilayah Jakarta dan sekitarnya...',
    likes: 67,
    comments: 23,
    views: 412,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
  },
  {
    author: 'Rudi Hermawan',
    authorBadge: 'Verified Satpam',
    category: 'Peralatan Security',
    title: 'Rekomendasi Bodycam untuk Security',
    content: 'Ada yang punya rekomendasi bodycam yang bagus untuk security? Budget sekitar 500rb - 1jt...',
    likes: 34,
    comments: 15,
    views: 289,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
  },
];

const trendingTopics = [
  { title: 'Pengalaman Lulus Gada Madya', replies: 23 },
  { title: 'Tips Passing PPS', replies: 18 },
  { title: 'Gaji Security 2026', replies: 45 },
  { title: 'Lowongan Security Terbaru', replies: 67 },
  { title: 'Review Pelatihan Gada Utama', replies: 12 },
];

const forumStats = [
  { value: '2.5K', label: 'Total Post' },
  { value: '15K', label: 'Member' },
  { value: '8.2K', label: 'Komentar' },
  { value: '1.2K', label: 'Online' },
];
