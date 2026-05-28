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
    const shift_id = searchParams.get('shift_id');

    if (!shift_id) {
      return NextResponse.json({ message: 'shift_id wajib diisi' }, { status: 400 });
    }

    const logs = await sql`
      SELECT
        pl.*,
        pc.nama as checkpoint_nama,
        pc.lokasi_lat as checkpoint_lat,
        pc.lokasi_lng as checkpoint_lng
      FROM patrol_logs pl
      LEFT JOIN patrol_checkpoints pc ON pc.id = pl.checkpoint_id
      WHERE pl.shift_id = ${shift_id}
      ORDER BY pl.timestamp ASC
    `;

    return NextResponse.json({ data: logs });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat log patroli' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { shift_id, checkpoint_id, scan_method, foto_url, catatan, lokasi_lat, lokasi_lng } = body;

    if (!shift_id || !checkpoint_id || !scan_method) {
      return NextResponse.json({ message: 'shift_id, checkpoint_id, dan scan_method wajib diisi' }, { status: 400 });
    }

    const validMethods = ['gps', 'qr', 'manual'];
    if (!validMethods.includes(scan_method)) {
      return NextResponse.json({ message: 'scan_method harus gps, qr, atau manual' }, { status: 400 });
    }

    const [log] = await sql`
      INSERT INTO patrol_logs (shift_id, checkpoint_id, user_id, scan_method, foto_url, catatan, lokasi_lat, lokasi_lng, status)
      VALUES (${shift_id}, ${checkpoint_id}, ${session.user.id}, ${scan_method}, ${foto_url || null}, ${catatan || null}, ${lokasi_lat || null}, ${lokasi_lng || null}, 'ok')
      RETURNING *
    `;

    await sql`
      UPDATE patrol_shifts
      SET completed_checkpoints = (
        SELECT COUNT(*) FROM patrol_logs WHERE shift_id = ${shift_id} AND status = 'ok'
      )
      WHERE id = ${shift_id}
    `;

    return NextResponse.json({ data: log }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal menyimpan log patroli' }, { status: 500 });
  }
}
