import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const [team] = await sql`
      SELECT * FROM guard_teams WHERE id = ${id} AND commander_id = ${session.user.id}
    `;

    if (!team) {
      return NextResponse.json({ message: 'Tim tidak ditemukan' }, { status: 404 });
    }

    const members = await sql`
      SELECT
        tm.*,
        u.nama_lengkap,
        u.nama_panggilan,
        u.foto_profil_url,
        u.email,
        u.phone,
        u.role as user_role,
        u.last_login_at,
        u.is_active
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = ${id}
      ORDER BY
        CASE tm.role
          WHEN 'komandan' THEN 1
          WHEN 'danru' THEN 2
          WHEN 'anggota' THEN 3
        END,
        u.nama_lengkap
    `;

    return NextResponse.json({ data: { ...team, members } });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat detail tim' }, { status: 500 });
  }
}

export async function POST(
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
    const { user_id, email, role } = body;

    const [team] = await sql`
      SELECT * FROM guard_teams WHERE id = ${id} AND commander_id = ${session.user.id}
    `;

    if (!team) {
      return NextResponse.json({ message: 'Tim tidak ditemukan' }, { status: 404 });
    }

    let targetUserId = user_id;
    if (email && !user_id) {
      const [found] = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (!found) {
        return NextResponse.json({ message: 'Email tidak ditemukan' }, { status: 404 });
      }
      targetUserId = found.id;
    }

    if (!targetUserId || !role) {
      return NextResponse.json({ message: 'user_id/email dan role wajib diisi' }, { status: 400 });
    }

    if (!['komandan', 'danru', 'anggota'].includes(role)) {
      return NextResponse.json({ message: 'Role tidak valid' }, { status: 400 });
    }

    const [existing] = await sql`
      SELECT id FROM team_members WHERE team_id = ${id} AND user_id = ${targetUserId}
    `;

    if (existing) {
      return NextResponse.json({ message: 'Anggota sudah terdaftar di tim ini' }, { status: 409 });
    }

    const [member] = await sql`
      INSERT INTO team_members (team_id, user_id, role)
      VALUES (${id}, ${targetUserId}, ${role})
      RETURNING *
    `;

    await sql`
      INSERT INTO notifications (user_id, type, title, body)
      VALUES (
        ${targetUserId},
        'team',
        'Ditambahkan ke Tim',
        CONCAT('Anda ditambahkan ke tim ', ${team.nama_team}, ' sebagai ', ${role})
      )
    `;

    return NextResponse.json({ data: member, message: 'Anggota berhasil ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal menambahkan anggota' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('member_id');

    const [team] = await sql`
      SELECT * FROM guard_teams WHERE id = ${id} AND commander_id = ${session.user.id}
    `;

    if (!team) {
      return NextResponse.json({ message: 'Tim tidak ditemukan' }, { status: 404 });
    }

    if (!memberId) {
      return NextResponse.json({ message: 'member_id wajib diisi' }, { status: 400 });
    }

    const [member] = await sql`
      DELETE FROM team_members WHERE id = ${memberId} AND team_id = ${id}
      RETURNING *
    `;

    if (!member) {
      return NextResponse.json({ message: 'Anggota tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Anggota berhasil dihapus' });
  } catch {
    return NextResponse.json({ message: 'Gagal menghapus anggota' }, { status: 500 });
  }
}
