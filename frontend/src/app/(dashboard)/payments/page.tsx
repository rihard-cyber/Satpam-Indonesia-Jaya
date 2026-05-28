'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { Wallet, CheckCircle, Clock, AlertCircle, ArrowRight, CreditCard } from 'lucide-react';

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  pending: { variant: 'warning', label: 'Pending' },
  success: { variant: 'success', label: 'Sukses' },
  failed: { variant: 'danger', label: 'Gagal' },
  expired: { variant: 'danger', label: 'Kadaluarsa' },
};

const statusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5 text-orange-400" />,
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  failed: <AlertCircle className="w-5 h-5 text-red-400" />,
  expired: <AlertCircle className="w-5 h-5 text-red-400" />,
};

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then(r => r.json())
      .then(j => { setPayments(j.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Riwayat Pembayaran</h1>
          <p className="text-white/40 mt-1">Daftar semua transaksi Anda</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
        ) : payments.length === 0 ? (
          <Card variant="glass">
            <div className="flex flex-col items-center py-12">
              <Wallet className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-white/40">Belum ada transaksi</p>
              <p className="text-xs text-white/20 mt-1">Pembayaran akan muncul setelah Anda melakukan pembelian</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {payments.map((p: any) => {
              const badge = statusBadge[p.status] || statusBadge.pending;
              return (
                <Card key={p.id} variant="glass" hover className="cursor-pointer" onClick={() => router.push(`/payments/confirm/${p.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0">
                      {statusIcon[p.status] || <CreditCard className="w-5 h-5 text-white/30" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{p.plan_nama || 'Pembayaran'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/40">{new Date(p.created_at).toLocaleDateString('id-ID')}</span>
                        {p.plan_type && <Badge variant="info" size="sm">{p.plan_type}</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gold">Rp {parseInt(p.amount).toLocaleString()}</p>
                      <Badge variant={badge.variant} size="sm" dot className="mt-1">{badge.label}</Badge>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
