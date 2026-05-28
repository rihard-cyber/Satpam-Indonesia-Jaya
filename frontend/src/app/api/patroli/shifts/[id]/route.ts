import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const [shift] = await sql`
      SELECT
        ps.*,
        u.nama_lengkap as user_nama,
        u.foto_profil_url as user_foto
      FROM patrol_shifts ps
      JOIN users u ON u.id = ps.user_id
      WHERE ps.id = ${id}
    `;

    if (!shift) {
      return NextResponse.json({ message: 'Shift tidak ditemukan' }, { status: 404 });
    }

    const logs = await sql`
      SELECT
        pl.*,
        pc.nama as checkpoint_nama,
        pc.lokasi_lat as checkpoint_lat,
        pc.lokasi_lng as checkpoint_lng
      FROM patrol_logs pl
      LEFT JOIN patrol_checkpoints pc ON pc.id = pl.checkpoint_id
      WHERE pl.shift_id = ${id}
      ORDER BY pl.timestamp ASC
    `;

    const totalCheckpoints = await sql`
      SELECT COUNT(*) as total FROM patrol_checkpoints WHERE is_active = true
    `;

    return NextResponse.json({
      data: shift,
      logs,
      total_checkpoints_all: Number(totalCheckpoints[0]?.total || 0),
    });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat detail shift' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const [shift] = await sql`SELECT * FROM patrol_shifts WHERE id = ${id}`;
    if (!shift) {
      return NextResponse.json({ message: 'Shift tidak ditemukan' }, { status: 404 });
    }

    let updated;

    if (action === 'start') {
      if (shift.status !== 'scheduled') {
        return NextResponse.json({ message: 'Shift sudah dimulai atau selesai' }, { status: 400 });
      }
      [updated] = await sql`
        UPDATE patrol_shifts
        SET status = 'in_progress', start_time = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (action === 'end') {
      if (shift.status !== 'in_progress') {
        return NextResponse.json({ message: 'Shift belum dimulai atau sudah selesai' }, { status: 400 });
      }
      [updated] = await sql`
        UPDATE patrol_shifts
        SET status = 'completed', end_time = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      return NextResponse.json({ message: 'Action harus start atau end' }, { status: 400 });
    }

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ message: 'Gagal update shift' }, { status: 500 });
  }
}
