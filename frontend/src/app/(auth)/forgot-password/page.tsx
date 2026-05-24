'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, Input } from '@/components/ui';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <AuthLayout title="Lupa Password" subtitle="Masukkan email untuk reset password">
      {isSent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Cek Email Anda</h3>
          <p className="text-sm text-white/50">
            Kami telah mengirim link reset password ke <strong className="text-gold">{email}</strong>
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Aktif"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            Kirim Reset Link
          </Button>
          <p className="text-center text-sm text-white/40">
            <Link href="/login" className="text-gold hover:text-gold-light font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
