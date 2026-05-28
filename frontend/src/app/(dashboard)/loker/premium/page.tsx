'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { Crown, Check, Clock, ArrowLeft, Sparkles } from 'lucide-react';

const planIcons: Record<string, string> = {
  'loker_premium_30': 'bg-gradient-to-br from-blue-500 to-blue-700',
  'loker_premium_60': 'bg-gradient-to-br from-gold to-gold-dark',
  'loker_premium_90': 'bg-gradient-to-br from-purple-500 to-purple-700',
};

export default function LokerPremiumPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/payments/plans?type=loker')
      .then(r => r.json())
      .then(j => { setPlans(j.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handlePilih(planCode: string) {
    setPaying(planCode);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_code: planCode }),
      });
      const json = await res.json();
      if (json.redirect_url) {
        router.push(json.redirect_url);
      }
    } catch {} finally {
      setPaying(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Pasang Lowongan Premium</h1>
            <p className="text-white/40 mt-1">Tampilkan lowongan Anda lebih menonjol</p>
          </div>
        </div>

        <Card variant="gold">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Keuntungan Premium</p>
              <ul className="mt-2 space-y-1">
                <li className="text-xs text-white/50 flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Tampil di urutan paling atas</li>
                <li className="text-xs text-white/50 flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Badge Premium eksklusif</li>
                <li className="text-xs text-white/50 flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Prioritas verifikasi lowongan</li>
                <li className="text-xs text-white/50 flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Highlight warna emas</li>
              </ul>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan: any) => (
              <Card key={plan.id} variant="glass" className={`relative flex flex-col ${plan.code === 'loker_premium_60' ? 'border-gold/40' : ''}`}>
                {plan.code === 'loker_premium_60' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold" size="sm">Populer</Badge>
                  </div>
                )}
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl ${planIcons[plan.code] || 'bg-navy-700'} flex items-center justify-center mb-4`}>
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{plan.nama}</h3>
                  <p className="text-xs text-white/40 mt-1">{plan.deskripsi}</p>
                  <div className="my-4">
                    <span className="text-3xl font-bold text-gold">Rp {parseInt(plan.harga).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white/50 mb-4">
                    <Clock className="w-4 h-4" /> {plan.durasi_hari} hari
                  </div>
                  <div className="flex-1 space-y-2 mb-6">
                    {(plan.fitur || []).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                        <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant={plan.code === 'loker_premium_60' ? 'gold' : 'outline'}
                    fullWidth
                    isLoading={paying === plan.code}
                    onClick={() => handlePilih(plan.code)}
                  >
                    Pilih & Bayar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
