'use client';

import { Shield } from 'lucide-react';
import Link from 'next/link';

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-800 via-navy-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
              <Shield className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Satpam Indonesia</h1>
              <p className="text-gold font-medium">JAYA</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Platform Digital<br />
            <span className="text-gold">Satpam Indonesia</span>
          </h2>
          <p className="text-white/50 text-lg max-w-md">
            Komunitas, Edukasi, Karier & Sertifikasi Satpam Nasional dalam satu platform.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {statItems.map((item) => (
              <div key={item.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <p className="text-2xl font-bold text-gold">{item.value}</p>
                <p className="text-sm text-white/50">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Satpam Indonesia</h1>
              <p className="text-gold text-sm font-medium">JAYA</p>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-white/50 mt-1">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

const statItems = [
  { value: '500K+', label: 'Satpam Aktif' },
  { value: '1000+', label: 'Materi & Modul' },
  { value: '50K+', label: 'Lowongan Kerja' },
  { value: '200+', label: 'Perusahaan' },
];
