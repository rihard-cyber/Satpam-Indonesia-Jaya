import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const teams = await sql`
      SELECT
        gt.*,
        (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = gt.id) as member_count,
        (SELECT COUNT(*) FROM team_members tm
         JOIN users u ON u.id = tm.user_id
         WHERE tm.team_id = gt.id AND u.last_login_at > NOW() - INTERVAL '24 hours'
        ) as online_count
      FROM guard_teams gt
      WHERE gt.commander_id = ${session.user.id}
      ORDER BY gt.created_at DESC
    `;

    return NextResponse.json({ data: teams });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat tim' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nama_team, perusahaan, lokasi } = body;

    if (!nama_team?.trim()) {
      return NextResponse.json({ message: 'Nama tim wajib diisi' }, { status: 400 });
    }

    const [team] = await sql`
      INSERT INTO guard_teams (commander_id, nama_team, perusahaan, lokasi)
      VALUES (${session.user.id}, ${nama_team.trim()}, ${perusahaan || null}, ${lokasi || null})
      RETURNING *
    `;

    await sql`
      INSERT INTO team_members (team_id, user_id, role)
      VALUES (${team.id}, ${session.user.id}, 'komandan')
    `;

    return NextResponse.json({ data: team, message: 'Tim berhasil dibuat' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal membuat tim' }, { status: 500 });
  }
}
