import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['acknowledged', 'resolved', 'false_alarm'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 });
    }

    const [alert] = await sql`
      SELECT * FROM panic_alerts WHERE id = ${id}
    `;

    if (!alert) {
      return NextResponse.json({ message: 'Alert tidak ditemukan' }, { status: 404 });
    }

    const updates: Record<string, any> = { status };
    if (status === 'acknowledged') {
      updates.acknowledged_by = session.user.id;
      updates.acknowledged_at = new Date().toISOString();
    }
    if (status === 'resolved' || status === 'false_alarm') {
      updates.resolved_at = new Date().toISOString();
    }

    const [updated] = await sql`
      UPDATE panic_alerts SET
        status = ${updates.status},
        acknowledged_by = COALESCE(${updates.acknowledged_by || null}, acknowledged_by),
        acknowledged_at = COALESCE(${updates.acknowledged_at || null}::timestamptz, acknowledged_at),
        resolved_at = COALESCE(${updates.resolved_at || null}::timestamptz, resolved_at)
      WHERE id = ${id}
      RETURNING *
    `;

    await sql`
      INSERT INTO notifications (user_id, type, title, body, data)
      VALUES (
        ${alert.user_id},
        'panic',
        'Status Panic Alert',
        CONCAT('Alert Anda telah ', ${status === 'acknowledged' ? 'diakui' : status === 'resolved' ? 'diselesaikan' : 'dinyatakan sebagai false alarm'}),
        ${JSON.stringify({ alert_id: id, status })}
      )
    `;

    return NextResponse.json({ data: updated, message: 'Alert berhasil diperbarui' });
  } catch {
    return NextResponse.json({ message: 'Gagal memperbarui alert' }, { status: 500 });
  }
}
