'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'email' | 'whatsapp'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || (method === 'email' ? !email : !phone)) {
      setError('Harap isi semua field');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const identifier = method === 'email' ? email : phone;
      const result = await signIn('credentials', {
        email: identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email/WhatsApp atau password salah');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Masuk ke akun Satpam Indonesia JAYA">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Method Toggle */}
        <div className="flex bg-navy-800 rounded-xl p-1 border border-white/5">
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              method === 'email'
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setMethod('whatsapp')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              method === 'whatsapp'
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-white/40 hover:text-white'
            }`}
          >
            WhatsApp
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {method === 'email' ? (
          <Input
            label="Email"
            type="email"
            placeholder="Masukkan email"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <Input
            label="Nomor WhatsApp"
            type="tel"
            placeholder="08xxxxxxxxxx"
            leftIcon={<MessageCircle className="w-4 h-4" />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        )}

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan password"
            leftIcon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <div className="text-right mt-1">
            <Link
              href="/forgot-password"
              className="text-xs text-gold hover:text-gold-light transition-colors"
            >
              Lupa password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Masuk
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-navy-900 text-white/40">Atau masuk dengan</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/70 hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => setMethod('whatsapp')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/70 hover:bg-white/5 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-green-400" />
            WhatsApp
          </button>
        </div>

        <p className="text-center text-sm text-white/40">
          Belum punya akun?{' '}
          <Link href="/register" className="text-gold hover:text-gold-light font-medium">
            Daftar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
