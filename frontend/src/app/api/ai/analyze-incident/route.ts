import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10;
const genAI = hasGemini ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY!) : null;

const analysisPrompt = `Analisis laporan kejadian keamanan ini dan berikan:
1) Analisis penyebab
2) Rekomendasi tindakan
3) Pola kejadian serupa
4) Langkah preventif

Format dalam Bahasa Indonesia.`;

const fallbackAnalyses: Record<string, string> = {
  pencurian: '**Analisis Kejadian: Pencurian**\n\n1. *Penyebab:* Kurangnya pengawasan area, CCTV tidak覆盖, akses tidak terkontrol.\n2. *Rekomendasi:* Perketat akses keluar-masuk, tambah pencahayaan, evaluasi rekaman CCTV.\n3. *Pola:* Biasanya terjadi pada shift malam atau jam sepi.\n4. *Langkah Preventif:* Patroli lebih intensif, pasang sensor pintu, briefing security tentang kewaspadaan.',
  kebakaran: '**Analisis Kejadian: Kebakaran**\n\n1. *Penyebab:* Korsleting listrik, kelalaian manusia, gas bocor.\n2. *Rekomendasi:* Evakuasi total, hubungi pemadam, amankan dokumen penting.\n3. *Pola:* Sering terjadi akibat beban listrik berlebih.\n4. *Langkah Preventif:* Cek instalasi listrik rutin, sediakan APAR, latihan evakuasi berkala.',
  kecelakaan: '**Analisis Kejadian: Kecelakaan**\n\n1. *Penyebab:* Kurangnya rambu, lantai licin, kelalaian personel.\n2. *Rekomendasi:* Berikan P3K, amankan TKP, laporkan ke atasan.\n3. *Pola:* Area parkir dan gudang rawan kecelakaan.\n4. *Langkah Preventif:* Pasang rambu K3, sosialisasi SOP keselamatan, sediakan P3K.',
  perkelahian: '**Analisis Kejadian: Perkelahian**\n\n1. *Penyebab:* Konflik personal, pengaruh alkohol, provokasi.\n2. *Rekomendasi:* Pisahkan pihak bertikai, amankan situasi, panggil aparat jika perlu.\n3. *Pola:* Sering terjadi saat jam istirahat atau setelah jam kerja.\n4. *Langkah Preventif:* Tingkatkan patroli area rawan, buat prosedur mediasi konflik.',
  penyusupan: '**Analisis Kejadian: Penyusupan**\n\n1. *Penyebab:* Celah keamanan perimeter, akses tidak terkontrol.\n2. *Rekomendasi:* Periksa seluruh area, patroli perimeter, kunci titik akses.\n3. *Pola:* Masuk melalui area blind spot atau pagar belakang.\n4. *Langkah Preventif:* Pasang sensor perimeter, tambah CCTV blind spot, perketat akses.',
  darurat_medis: '**Analisis Kejadian: Darurat Medis**\n\n1. *Penyebab:* Kondisi kesehatan bawaan, kelelahan, kecelakaan kerja.\n2. *Rekomendasi:* Berikan P3K, hubungi ambulans, jaga jalur evakuasi.\n3. *Pola:* Heat stroke saat cuaca panas, pingsan karena kelelahan.\n4. *Langkah Preventif:* Sediakan P3K lengkap, pelatihan first aid, jadwal istirahat cukup.',
};

const specificAnalyses: Record<string, string> = {
  'kerusakan_aset': '**Analisis Kejadian: Kerusakan Aset**\n\n1. *Penyebab:* Vandalisme, kelalaian, bencana.\n2. *Rekomendasi:* Dokumentasi kerusakan, lapor atasan, perbaiki segera.\n3. *Pola:* Area publik dan gudang rawan vandalisme.\n4. *Langkah Preventif:* CCTV area rawan, patroli rutin, perkuat pengamanan perimeter.',
  'kehilangan_barang': '**Analisis Kejadian: Kehilangan Barang**\n\n1. *Penyebab:* Akses tidak terkontrol, pencurian internal/eksternal.\n2. *Rekomendasi:* Investigasi internal, cek CCTV, inventarisasi barang.\n3. *Pola:* Sering terjadi saat jam sepi atau pergantian shift.\n4. *Langkah Preventif:* Sistem tanda tangan barang, cek keluar-masuk barang, inventarisasi rutin.',
  'pelanggaran_sop': '**Analisis Kejadian: Pelanggaran SOP**\n\n1. *Penyebab:* Kurang pengawasan, tidak paham SOP, kelalaian.\n2. *Rekomendasi:* Beri teguran, briefing ulang, catat di buku pelanggaran.\n3. *Pola:* Karyawan baru sering tidak paham SOP.\n4. *Langkah Preventif:* Pelatihan SOP berkala, pengawasan melekat, sanksi jelas.',
  'kecurigaan': '**Analisis Kejadian: Kecurigaan**\n\n1. *Penyebab:* Aktivitas mencurigakan, orang asing, barang tak dikenal.\n2. *Rekomendasi:* Observasi, dokumentasi, laporkan ke atasan.\n3. *Pola:* Biasanya terjadi sebelum kejadian sebenarnya.\n4. *Langkah Preventif:* Tingkatkan kewaspadaan, patroli acak, briefing intelijen.',
  'bencana_alam': '**Analisis Kejadian: Bencana Alam**\n\n1. *Penyebab:* Faktor alam (gempa, banjir, angin).\n2. *Rekomendasi:* Evakuasi, amankan dokumen, hubungi BPBD.\n3. *Pola:* Musiman tergantung wilayah.\n4. *Langkah Preventif:* Siapkan jalur evakuasi, early warning system, stock logistik.',
  'pelanggaran_lalu_lintas': '**Analisis Kejadian: Pelanggaran Lalu Lintas**\n\n1. *Penyebab:* Tidak rambu, parkir liar, ngebut.\n2. *Rekomendasi:* Tegur pengemudi, catat kendaraan, laporkan.\n3. *Pola:* Jam masuk/pulang kerja rawan.\n4. *Langkah Preventif:* Pengaturan lalu lintas, rambu jelas, patroli area parkir.',
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { incident_id } = await request.json();
    if (!incident_id) {
      return NextResponse.json({ message: 'ID insiden diperlukan' }, { status: 400 });
    }

    const [incident] = await sql`
      SELECT ir.*, u.nama_lengkap as pelapor_nama
      FROM incident_reports ir
      JOIN users u ON u.id = ir.user_id
      WHERE ir.id = ${incident_id}
      LIMIT 1
    `;

    if (!incident) {
      return NextResponse.json({ message: 'Insiden tidak ditemukan' }, { status: 404 });
    }

    let analysis = '';

    if (hasGemini && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const incidentData = `
Judul: ${incident.judul}
Jenis: ${incident.jenis_kejadian}
Tingkat Darurat: ${incident.tingkat_darurat}
Deskripsi: ${incident.deskripsi}
Lokasi: ${incident.lokasi || 'Tidak disebutkan'}
Korban Jiwa: ${incident.korban_jiwa}
Korban Luka: ${incident.korban_luka}
Tindakan Awal: ${incident.tindakan_awal || 'Tidak ada'}
Status: ${incident.status}
        `;

        const result = await Promise.race([
          model.generateContent(analysisPrompt + '\n\nLaporan Kejadian:\n' + incidentData),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000)),
        ]);
        analysis = result.response.text();
      } catch {
        analysis = getFallbackAnalysis(incident.jenis_kejadian);
      }
    } else {
      analysis = getFallbackAnalysis(incident.jenis_kejadian);
    }

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ message: 'Gagal menganalisis insiden' }, { status: 500 });
  }
}

function getFallbackAnalysis(jenis: string): string {
  return specificAnalyses[jenis] || fallbackAnalyses[jenis] || fallbackAnalyses['pencurian'];
}
