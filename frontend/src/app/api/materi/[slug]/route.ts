import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const [materi] = await sql`
      SELECT m.*, mk.nama as kategori_nama, mk.slug as kategori_slug, t.nama as tingkatan_nama, t.kode as tingkatan_kode
      FROM materi m
      JOIN materi_kategori mk ON mk.id = m.kategori_id
      JOIN tingkatan t ON t.id = mk.tingkatan_id
      WHERE m.slug = ${slug}
      LIMIT 1
    `;
    if (!materi) {
      return NextResponse.json({ message: 'Materi tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: materi });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat materi' }, { status: 500 });
  }
}
