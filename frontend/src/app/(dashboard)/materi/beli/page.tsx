'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { GraduationCap, Check, BookOpen, Award, ArrowLeft, Shield, Crown, Star } from 'lucide-react';

const courseConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  course_pratama: { icon: Shield, color: 'from-blue-500 to-blue-700', label: 'Dasar' },
  course_madya: { icon: Crown, color: 'from-gold to-gold-dark', label: 'Lanjutan' },
  course_utama: { icon: Star, color: 'from-red-500 to-red-700', label: 'Ahli' },
};

export default function BeliMateriPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/payments/plans?type=course')
      .then(r => r.json())
      .then(j => { setPlans(j.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleBeli(planCode: string) {
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
          <button onClick={() => router.push('/materi')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Beli Paket Kursus</h1>
            <p className="text-white/40 mt-1">Akses penuh materi pembelajaran Satpam</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan: any) => {
              const cfg = courseConfig[plan.code] || { icon: BookOpen, color: 'from-navy-600 to-navy-700', label: '' };
              const Icon = cfg.icon;
              const isPopular = plan.code === 'course_madya';
              return (
                <Card key={plan.id} variant="glass" className={`relative flex flex-col ${isPopular ? 'border-gold/40' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="gold" size="sm">Terpopuler</Badge>
                    </div>
                  )}
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{plan.nama}</h3>
                    <p className="text-xs text-white/40 mt-1">{plan.deskripsi}</p>
                    <div className="my-4">
                      <span className="text-3xl font-bold text-gold">Rp {parseInt(plan.harga).toLocaleString()}</span>
                      <span className="text-xs text-white/30 ml-1">/tahun</span>
                    </div>
                    <div className="flex-1 space-y-2 mb-6">
                      {(plan.fitur || []).map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                          <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" /> {f}
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" /> Akses {plan.durasi_hari} hari
                      </div>
                    </div>
                    <Button
                      variant={isPopular ? 'gold' : 'outline'}
                      fullWidth
                      isLoading={paying === plan.code}
                      onClick={() => handleBeli(plan.code)}
                    >
                      Beli Sekarang
                    </Button>
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
