'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { CheckCircle, Clock, AlertCircle, ArrowLeft, Copy, ExternalLink, Wallet, Banknote } from 'lucide-react';

export default function PaymentConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  async function fetchPayment() {
    try {
      const res = await fetch('/api/payments');
      const json = await res.json();
      const found = (json.data || []).find((p: any) => p.id === params.id);
      setPayment(found || null);
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPayment(); }, [params.id]);

  async function handleCekStatus() {
    setChecking(true);
    await fetchPayment();
    setChecking(false);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
      </DashboardLayout>
    );
  }

  if (!payment) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-white/30">Pembayaran tidak ditemukan</div>
      </DashboardLayout>
    );
  }

  const isPending = payment.status === 'pending';
  const isSuccess = payment.status === 'success';
  const isFailed = payment.status === 'failed' || payment.status === 'expired';

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/payments')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Konfirmasi Pembayaran</h1>
          </div>
        </div>

        <Card variant="glass" className="text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${isPending ? 'bg-orange-500/20' : isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isPending ? <Clock className="w-10 h-10 text-orange-400" /> : isSuccess ? <CheckCircle className="w-10 h-10 text-green-400" /> : <AlertCircle className="w-10 h-10 text-red-400" />}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {isPending ? 'Menunggu Pembayaran' : isSuccess ? 'Pembayaran Berhasil' : 'Pembayaran Gagal'}
          </h2>
          <p className="text-sm text-white/40">
            {isPending ? 'Silakan lakukan pembayaran untuk mengaktifkan layanan' : isSuccess ? 'Layanan Anda telah aktif' : 'Silakan coba lagi atau hubungi kami'}
          </p>
        </Card>

        <Card variant="glass">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-white/40">Paket</span>
              <span className="text-sm text-white font-medium">{payment.plan_nama || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/40">Total</span>
              <span className="text-lg font-bold text-gold">Rp {parseInt(payment.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/40">Status</span>
              <Badge variant={isSuccess ? 'success' : isPending ? 'warning' : 'danger'} size="sm" dot>
                {isPending ? 'Pending' : isSuccess ? 'Sukses' : 'Gagal'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/40">Tanggal</span>
              <span className="text-sm text-white/60">{new Date(payment.created_at).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </Card>

        {isPending && (
          <Card variant="gold">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Banknote className="w-4 h-4 text-gold" /> Petunjuk Pembayaran</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-white/60">Bank BCA</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">1234567890</span>
                    <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><Copy className="w-3.5 h-3.5 text-gold" /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-white/60">Bank Mandiri</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">9876543210</span>
                    <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><Copy className="w-3.5 h-3.5 text-gold" /></button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/40">Transfer ke rekening di atas, lalu konfirmasi pembayaran</p>
              <Button variant="gold" fullWidth leftIcon={<CheckCircle className="w-4 h-4" />}>Konfirmasi Pembayaran</Button>
            </div>
          </Card>
        )}

        <div className="flex gap-3">
          {isPending && (
            <Button variant="outline" fullWidth isLoading={checking} onClick={handleCekStatus}>
              Cek Status Pembayaran
            </Button>
          )}
          {isSuccess && (
            <Button variant="gold" fullWidth onClick={() => router.push('/payments')}>
              Lihat Riwayat Pembayaran
            </Button>
          )}
          {isFailed && (
            <Button variant="gold" fullWidth onClick={() => router.back()}>
              Coba Lagi
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
