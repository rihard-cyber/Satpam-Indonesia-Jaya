'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Bell, Menu, Search, Shield } from 'lucide-react';
import { Avatar } from '@/components/ui';

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'User';

  return (
    <header className="sticky top-0 z-30 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-white/50"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <Search className="w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Cari materi, loker, forum..."
              className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/notifications">
            <button className="relative p-2 rounded-xl hover:bg-white/5 text-white/50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </Link>

          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-white/40">Anggota</p>
            </div>
            <Avatar name={userName} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
