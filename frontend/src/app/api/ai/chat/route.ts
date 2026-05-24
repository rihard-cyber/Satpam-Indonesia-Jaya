import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const systemPrompt = `Kamu adalah AI Assistant resmi Satpam Indonesia JAYA, platform digital untuk satpam Indonesia.

TUGAS:
- Jawab pertanyaan tentang profesi Satpam, keamanan, Turjawali, SOP, sertifikasi, dan tugas security
- Gunakan bahasa Indonesia yang jelas dan profesional
- Berikan jawaban yang akurat berdasarkan regulasi yang berlaku (Perkap No. 24/2007, UU No. 2/2002, dll)
- Jika ditanya tentang materi, jelaskan dengan detail dan terstruktur
- Jika tidak tahu, akui dan jangan mengarang

PENTING:
- Satpam jenjang: Gada Pratama (dasar), Gada Madya (Danru), Gada Utama (manajer)
- Turjawali = Pengaturan, Penjagaan, Pengawalan, Patroli
- Tupoksi = Tugas Pokok dan Fungsi
- KTA = Kartu Tanda Anggota
- PPS = Pendidikan Profesi Satpam

BALASLAH DENGAN SINGKAT, PADAT, DAN INFORMATIF. Maksimal 3 paragraf.`;

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

    if (genAI.apiKey && genAI.apiKey !== '') {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const context = contextTitle ? `Konteks: user sedang membaca materi "${contextTitle}". Jawab relevan dengan materi tersebut.\n\n` : '';
        const result = await model.generateContent(systemPrompt + '\n\n' + context + 'Pertanyaan: ' + message);
        reply = result.response.text();
      } catch {
        reply = getFallbackResponse(message, contextTitle);
      }
    } else {
      reply = getFallbackResponse(message, contextTitle);
    }

    await sql`
      INSERT INTO ai_chat_messages (user_id, role, message)
      VALUES (${session.user.id}, 'user', ${message})
    `;
    await sql`
      INSERT INTO ai_chat_messages (user_id, role, message)
      VALUES (${session.user.id}, 'assistant', ${reply})
    `;

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Maaf, terjadi gangguan. Silakan coba lagi.' });
  }
}

function getFallbackResponse(question: string, contextTitle?: string): string {
  const q = question.toLowerCase().trim();

  const fallback: Record<string, string> = {
    turjawali: 'Turjawali adalah singkatan dari Tugas Pokok Satpam: Pengaturan (mengatur lalu lintas/tamu), Penjagaan (menjaga pos), Pengawalan (mengawal barang/orang), Patroli (patroli rutin). Ini adalah tugas inti setiap Satpam.',
    danru: 'Danru (Komandan Regu) adalah pemimpin regu Satpam minimal Gada Madya. Tugas: koordinasi anggota, briefing shift, pengawasan pos, laporan ke atasan, penanganan situasi darurat.',
    'gada pratama': 'Gada Pratama adalah jenjang dasar sertifikasi Satpam. Materi: dasar Turjawali, bela diri, etika profesi, penanganan tamu, pengamanan gedung. Masa berlaku 3 tahun.',
    'gada madya': 'Gada Madya setara Danru. Materi: leadership, manajemen risiko, investigasi, crowd control, emergency response, intelijen dasar. Syarat: minimal 2 tahun sebagai Gada Pratama.',
    'gada utama': 'Gada Utama adalah jenjang tertinggi. Fokus strategis: security management, crisis management, corporate security, executive protection, cyber security. Syarat: minimal 3 tahun sebagai Gada Madya.',
  };

  for (const [key, val] of Object.entries(fallback)) {
    if (q.includes(key)) return val;
  }

  if (contextTitle) {
    const ct = contextTitle.toLowerCase();
    for (const [key, val] of Object.entries(fallback)) {
      if (ct.includes(key)) return val + '\n\nAda pertanyaan lain tentang materi ini?';
    }
  }

  return `Terima kasih atas pertanyaan Anda. Saya sarankan:\n\n1. 📖 Cek materi terkait di halaman Materi Satpam\n2. 💬 Diskusikan di Forum Komunitas\n3. 📞 Hubungi atasan/Danru jika darurat\n\nAda topik lain yang ingin ditanyakan?`;
}
