import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10;
const genAI = hasGemini ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY!) : null;

const systemPrompt = `Kamu adalah AI Assistant "Satpam Indonesia JAYA". Jawab pertanyaan tentang profesi Satpam di Indonesia.

Gunakan bahasa Indonesia yang jelas dan profesional. Jelaskan dengan detail. Jika tidak tahu, akui saja.

Istilah penting:
- Turjawali = Pengaturan + Penjagaan + Pengawalan + Patroli (tugas pokok Satpam)
- Tupoksi = Tugas Pokok dan Fungsi
- KTA = Kartu Tanda Anggota
- PPS = Pendidikan Profesi Satpam
- Gada Pratama = jenjang dasar
- Gada Madya = jenjang menengah (Danru)
- Gada Utama = jenjang tertinggi (manajer)

Jawab maksimal 3 paragraf.`;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, contextTitle } = await request.json();
    if (!message) {
      return NextResponse.json({ message: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    let reply = '';

    if (hasGemini && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const context = contextTitle
          ? `Konteks: user sedang membaca materi "${contextTitle}". Jawab relevan dengan materi tersebut.\n\n`
          : '';
        const result = await Promise.race([
          model.generateContent(systemPrompt + '\n\n' + context + 'Pertanyaan: ' + message),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
        ]);
        reply = result.response.text();
      } catch {
        reply = await getFallbackResponse(message, contextTitle);
      }
    } else {
      reply = await getFallbackResponse(message, contextTitle);
    }

    await sql`
      INSERT INTO ai_chat_messages (user_id, role, message)
      VALUES (${session.user.id}, 'assistant', ${'User: ' + message + '\n\nAI: ' + reply})
    `;

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Maaf, terjadi gangguan. Silakan coba lagi.' });
  }
}

async function getFallbackResponse(question: string, contextTitle?: string): Promise<string> {
  const q = question.toLowerCase().trim();

  // If viewing a specific materi, return its content from DB
  if (contextTitle) {
    try {
      const rows = await sql`
        SELECT judul, ringkasan, konten FROM materi
        WHERE LOWER(judul) LIKE ${'%' + contextTitle.toLowerCase() + '%'}
           OR LOWER(ringkasan) LIKE ${'%' + contextTitle.toLowerCase() + '%'}
        LIMIT 1
      `;
      if (rows.length > 0) {
        const m = rows[0] as { judul: string; ringkasan: string | null; konten: string | null };
        let ans = `**${m.judul}**\n\n`;
        if (m.ringkasan) ans += `*${m.ringkasan}*\n\n`;
        const clean = (m.konten || '')
          .replace(/<[^>]+>/g, '')
          .split('\n')
          .filter(Boolean)
          .slice(0, 6)
          .join('\n');
        if (clean) ans += clean;
        return ans;
      }
    } catch {
      // fall through to keyword lookup
    }
  }

  // Keyword-based fallback
  const fb: Record<string, string> = {
    turjawali: 'Turjawali: Pengaturan, Penjagaan, Pengawalan, Patroli — 4 tugas pokok Satpam.',
    danru: 'Danru (Komandan Regu) pemimpin regu Satpam, minimal Gada Madya. Tugas: koordinasi, briefing, pengawasan, laporan.',
    'gada pratama': 'Jenjang dasar Satpam. Materi: Turjawali, bela diri, etika, penanganan tamu. Masa berlaku 3 tahun.',
    'gada madya': 'Jenjang menengah (Danru). Materi: leadership, manajemen risiko, investigasi, crowd control. Syarat: 2 tahun Gada Pratama.',
    'gada utama': 'Jenjang tertinggi. Materi: security management, crisis management, cyber security. Syarat: 3 tahun Gada Madya.',
    'executive protection': 'Executive Protection — perlindungan VVIP dan eksekutif perusahaan. Prinsip: preventive, low profile, flexible, professional. Advance: site survey, route planning. Formasi: diamond, V, box. Perimeter: inner (langsung VVIP), middle (venue), outer (area luar). Vehicle: pemeriksaan kendaraan, convoy, anti-ambush. Komunikasi: kode rahasia, check-in periodik.',
    perlindungan: 'Perlindungan VVIP/eksekutif menggunakan prinsip preventive dan low profile. Advance meliputi site survey, route planning, threat assessment. Formasi pengamanan: diamond, V, box. Perimeter berlapis: inner, middle, outer. Tim: advance team, close protection, driver, backup.',
    vvip: 'Perlindungan VVIP adalah prioritas utama Satpam Gada Utama. Prinsip: cegah sebelum terjadi, low profile agar tidak menarik perhatian. Perimeter pengamanan berlapis dengan formasi diamond atau V. Selalu ada rute alternatif dan kendaraan cadangan.',
    eksekutif: 'Perlindungan eksekutif membutuhkan advance planning, threat assessment, dan koordinasi tim. Tim: Team Leader, Close Protection Officer (CPO), Driver, Advance Team. Komunikasi via HT dengan kode khusus.',
    sejarah: 'Prof. Dr. Awaloedin Djamin, MBA mendirikan Satpam pada 14 September 1980 lewat SK Kapolri No. Pol. Skep/126/IX/1980. Beliau adalah Kepala Polri ke-12. 14 September = Hari Satpam Nasional.',
    pendiri: 'Pendiri Satpam Indonesia: Prof. Dr. Awaloedin Djamin, MBA. Kapolri ke-12 (1978-1982). Wafat 3 Maret 2021 di Jakarta.',
  };
  for (const [k, v] of Object.entries(fb)) { if (q.includes(k)) return v; }

  return 'Saya siap membantu pertanyaan seputar profesi Satpam, Turjawali, SOP keamanan, sertifikasi, dan tugas security. Silakan tanya!';
}
