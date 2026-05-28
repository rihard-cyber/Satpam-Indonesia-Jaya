'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  MessageCircle,
  Bot,
  Award,
  User,
  Bell,
  LogOut,
  Shield,
  ChevronLeft,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/materi', label: 'Materi Satpam', icon: BookOpen },
  { href: '/loker', label: 'Loker', icon: Briefcase },
  { href: '/forum', label: 'Forum', icon: MessageCircle },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/sertifikat', label: 'Sertifikat', icon: Award },
  { href: '/patroli', label: 'Patroli Digital', icon: Shield },
  { href: '/absensi', label: 'Absensi', icon: User },
  { href: '/laporan', label: 'Laporan Kejadian', icon: Bell },
  { href: '/panic', label: 'Panic Button', icon: Shield },
  { href: '/komandan', label: 'Dashboard Komandan', icon: Award },
  { href: '/chat', label: 'Chat Tim', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/notifications', label: 'Notifikasi', icon: Bell },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-navy-900 border-r border-white/5',
          'transition-all duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'w-64' : 'w-0 lg:w-64'
        )}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white truncate">Satpam Indonesia</h2>
            <p className="text-xs text-white/40">JAYA</p>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-white/5 text-white/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.label === 'Notifikasi' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-accent-red" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
