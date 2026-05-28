'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { X, MapPin, Camera, FileText } from 'lucide-react';

interface Checkpoint {
  id: string;
  nama: string;
  lokasi_lat: number | null;
  lokasi_lng: number | null;
}

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftId: string;
  onSuccess: () => void;
}

export default function ScanModal({ isOpen, onClose, shiftId, onSuccess }: ScanModalProps) {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [checkpointId, setCheckpointId] = useState('');
  const [scanMethod, setScanMethod] = useState<'gps' | 'manual'>('gps');
  const [catatan, setCatatan] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCp, setLoadingCp] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      setLoadingCp(true);
      try {
        const res = await fetch('/api/patroli/checkpoints');
        const json = await res.json();
        setCheckpoints(json.data || []);
      } catch {}
      setLoadingCp(false);
    }
    load();
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkpointId) return;

    setLoading(true);
    try {
      let lat = null;
      let lng = null;
      if (scanMethod === 'gps') {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // GPS failed, proceed without coordinates
        }
      }

      const res = await fetch('/api/patroli/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shift_id: shiftId,
          checkpoint_id: checkpointId,
          scan_method: scanMethod,
          catatan: catatan || undefined,
          foto_url: fotoUrl || undefined,
          lokasi_lat: lat,
          lokasi_lng: lng,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setCheckpointId('');
        setCatatan('');
        setFotoUrl('');
      }
    } catch {}
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Scan Checkpoint</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Pilih Checkpoint</label>
            {loadingCp ? (
              <div className="h-10 rounded-xl bg-navy-900/50 animate-pulse" />
            ) : (
              <select
                value={checkpointId}
                onChange={(e) => setCheckpointId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 appearance-none"
                required
              >
                <option value="">-- Pilih Checkpoint --</option>
                {checkpoints.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.nama}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Metode Scan</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScanMethod('gps')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  scanMethod === 'gps'
                    ? 'bg-gold/20 border-gold/50 text-gold'
                    : 'bg-navy-900/50 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <MapPin className="w-4 h-4" /> GPS
              </button>
              <button
                type="button"
                onClick={() => setScanMethod('manual')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  scanMethod === 'manual'
                    ? 'bg-gold/20 border-gold/50 text-gold'
                    : 'bg-navy-900/50 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <FileText className="w-4 h-4" /> Manual
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Catatan (opsional)</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
              placeholder="Temuan atau catatan di checkpoint..."
            />
          </div>

          <div>
            <Input
              label="URL Foto (opsional)"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              placeholder="https://..."
              leftIcon={<Camera className="w-4 h-4" />}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="gold" fullWidth isLoading={loading}>
              Simpan Scan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
