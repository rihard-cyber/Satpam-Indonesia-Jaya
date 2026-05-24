import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tingkatan = searchParams.get('tingkatan');

    let data;
    if (tingkatan) {
      data = await sql`
        SELECT m.*, mk.nama as kategori_nama, mk.slug as kategori_slug
        FROM materi m
        JOIN materi_kategori mk ON mk.id = m.kategori_id
        WHERE m.is_published = true
          AND mk.tingkatan_id = (SELECT id FROM tingkatan WHERE kode = ${tingkatan})
        ORDER BY m.urutan
      `;
    } else {
      data = await sql`
        SELECT m.*, mk.nama as kategori_nama, mk.slug as kategori_slug
        FROM materi m
        JOIN materi_kategori mk ON mk.id = m.kategori_id
        WHERE m.is_published = true
        ORDER BY m.urutan
      `;
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal memuat materi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await sql`
      INSERT INTO materi_progress (user_id, materi_id, is_completed)
      VALUES (${session.user.id}, ${body.materi_id}, ${body.is_completed || false})
      ON CONFLICT (user_id, materi_id)
      DO UPDATE SET is_completed = EXCLUDED.is_completed
    `;
    return NextResponse.json({ message: 'Progress tersimpan' });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal menyimpan progress' }, { status: 500 });
  }
}
