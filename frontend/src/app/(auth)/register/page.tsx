'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff, MessageCircle, User, Shield, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const tingkatanOptions = [
  { value: 'gada_pratama', label: 'Gada Pratama' },
  { value: 'gada_madya', label: 'Danru / Gada Madya' },
  { value: 'gada_utama', label: 'Gada Utama' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement register
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <AuthLayout title="Daftar Akun" subtitle="Bergabung dengan komunitas Satpam Indonesia JAYA">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap"
            placeholder="Nama lengkap"
            leftIcon={<User className="w-4 h-4" />}
          />
          <Input
            label="Nama Panggilan"
            placeholder="Nama panggilan"
          />
        </div>

        <div className="relative">
          <select
            className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white/70 appearance-none focus:outline-none focus:ring-2 focus:ring-gold/50"
            defaultValue=""
          >
            <option value="" disabled>Pilih tingkatan</option>
            {tingkatanOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-navy-800">
                {opt.label}
              </option>
            ))}
          </select>
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>

        <Input
          label="Email Aktif"
          type="email"
          placeholder="contoh@email.com"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Nomor WhatsApp Aktif"
          type="tel"
          placeholder="08xxxxxxxxxx"
          leftIcon={<MessageCircle className="w-4 h-4" />}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 8 karakter"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="relative">
          <Input
            label="Konfirmasi Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Ulangi password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-navy-800 text-gold focus:ring-gold/50"
          />
          <span className="text-sm text-white/50">
            Saya menyetujui{' '}
            <button type="button" className="text-gold hover:text-gold-light">syarat & ketentuan</button>
            {' '}yang berlaku
          </span>
        </label>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Daftar Sekarang
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-navy-900 text-white/40">Atau daftar dengan</span>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/70 hover:bg-white/5 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-white/40 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-gold hover:text-gold-light font-medium">
            Masuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
