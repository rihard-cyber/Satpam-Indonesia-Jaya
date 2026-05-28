import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = sql`
      SELECT
        ps.*,
        u.nama_lengkap as user_nama,
        u.foto_profil_url as user_foto
      FROM patrol_shifts ps
      JOIN users u ON u.id = ps.user_id
      WHERE ps.user_id = ${session.user.id}
    `;

    if (status) {
      query = sql`${query} AND ps.status = ${status}`;
    }

    query = sql`${query} ORDER BY ps.shift_date DESC, ps.created_at DESC`;

    const shifts = await query;
    return NextResponse.json({ data: shifts });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat shift' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { shift_date, shift_type, patrol_route } = body;

    if (!shift_date || !shift_type) {
      return NextResponse.json({ message: 'shift_date dan shift_type wajib diisi' }, { status: 400 });
    }

    const validTypes = ['pagi', 'siang', 'malam'];
    if (!validTypes.includes(shift_type)) {
      return NextResponse.json({ message: 'shift_type harus pagi, siang, atau malam' }, { status: 400 });
    }

    const [shift] = await sql`
      INSERT INTO patrol_shifts (user_id, shift_date, shift_type, patrol_route, status)
      VALUES (${session.user.id}, ${shift_date}, ${shift_type}, ${patrol_route || null}, 'scheduled')
      RETURNING *
    `;

    return NextResponse.json({ data: shift }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal membuat shift' }, { status: 500 });
  }
}
