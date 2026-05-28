import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await sql`
      SELECT role FROM users WHERE id = ${session.user.id}
    `;

    const isCommander = user[0]?.role === 'admin' || user[0]?.role === 'superadmin' || user[0]?.role === 'danru';

    let alerts;
    if (isCommander) {
      alerts = await sql`
        SELECT
          pa.*,
          u.nama_lengkap as user_nama,
          u.foto_profil_url as user_foto,
          u.phone as user_phone,
          ack.nama_lengkap as acknowledged_nama
        FROM panic_alerts pa
        JOIN users u ON u.id = pa.user_id
        LEFT JOIN users ack ON ack.id = pa.acknowledged_by
        WHERE pa.status = 'active'
        ORDER BY pa.created_at DESC
      `;
    } else {
      alerts = await sql`
        SELECT
          pa.*,
          u.nama_lengkap as user_nama,
          u.foto_profil_url as user_foto,
          ack.nama_lengkap as acknowledged_nama
        FROM panic_alerts pa
        JOIN users u ON u.id = pa.user_id
        LEFT JOIN users ack ON ack.id = pa.acknowledged_by
        WHERE pa.user_id = ${session.user.id}
        ORDER BY pa.created_at DESC
        LIMIT 20
      `;
    }

    return NextResponse.json({ data: alerts });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat panic alert' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, lokasi_lat, lokasi_lng, lokasi_nama, message } = body;

    const [alert] = await sql`
      INSERT INTO panic_alerts (user_id, type, lokasi_lat, lokasi_lng, lokasi_nama, message)
      VALUES (
        ${session.user.id},
        ${type || 'panic'},
        ${lokasi_lat || null},
        ${lokasi_lng || null},
        ${lokasi_nama || null},
        ${message || null}
      )
      RETURNING *
    `;

    const teamCommander = await sql`
      SELECT DISTINCT gt.commander_id
      FROM guard_teams gt
      JOIN team_members tm ON tm.team_id = gt.id
      WHERE tm.user_id = ${session.user.id}
    `;

    for (const cmd of teamCommander) {
      await sql`
        INSERT INTO notifications (user_id, type, title, body, data)
        VALUES (
          ${cmd.commander_id},
          'panic',
          'Panic Alert!',
          CONCAT('Anggota mengirim panic alert: ', ${type || 'panic'}),
          ${JSON.stringify({ alert_id: alert.id, type: alert.type })}
        )
      `;
    }

    await sql`
      INSERT INTO notifications (user_id, type, title, body, data)
      VALUES (
        ${session.user.id},
        'panic',
        'Panic Alert Terkirim',
        CONCAT('Alert ', ${alert.id}, ' telah dikirim ke komandan tim'),
        ${JSON.stringify({ alert_id: alert.id })}
      )
    `;

    return NextResponse.json({ data: alert, message: 'Panic alert terkirim' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal mengirim panic alert' }, { status: 500 });
  }
}
