import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rooms = await sql`
      SELECT cr.*,
        (SELECT message FROM chat_messages WHERE room_id = cr.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM chat_messages WHERE room_id = cr.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
        (SELECT COUNT(*)::int FROM chat_messages cm WHERE cm.room_id = cr.id AND cm.user_id != ${session.user.id} AND cm.created_at > COALESCE(crm.last_read_at, '1970-01-01')) as unread_count
      FROM chat_rooms cr
      JOIN chat_room_members crm ON crm.room_id = cr.id AND crm.user_id = ${session.user.id}
      ORDER BY (SELECT created_at FROM chat_messages WHERE room_id = cr.id ORDER BY created_at DESC LIMIT 1) DESC NULLS LAST, cr.created_at DESC
    `;

    return NextResponse.json({ data: rooms });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat chat' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { type, nama, team_id, member_ids } = await request.json();

    if (!type || !['direct', 'group', 'team'].includes(type)) {
      return NextResponse.json({ message: 'Tipe chat tidak valid' }, { status: 400 });
    }

    if (!member_ids || !Array.isArray(member_ids) || member_ids.length === 0) {
      return NextResponse.json({ message: 'Pilih minimal 1 anggota' }, { status: 400 });
    }

    if (type === 'direct' && member_ids.length === 1) {
      const [existingRoom] = await sql`
        SELECT cr.id FROM chat_rooms cr
        WHERE cr.type = 'direct' AND cr.id IN (
          SELECT room_id FROM chat_room_members WHERE user_id = ${userId}
        ) AND cr.id IN (
          SELECT room_id FROM chat_room_members WHERE user_id = ${member_ids[0]}
        )
        LIMIT 1
      `;

      if (existingRoom) {
        return NextResponse.json({ data: existingRoom });
      }
    }

    const allMemberIds = [userId, ...member_ids.filter((id: string) => id !== userId)];

    const [room] = await sql`
      INSERT INTO chat_rooms (nama, type, team_id, created_by)
      VALUES (${nama || null}, ${type}, ${team_id || null}, ${userId})
      RETURNING *
    `;

    for (const userId of allMemberIds) {
      await sql`
        INSERT INTO chat_room_members (room_id, user_id)
        VALUES (${room.id}, ${userId})
        ON CONFLICT (room_id, user_id) DO NOTHING
      `;
    }

    if (type !== 'direct') {
      const names = await sql`
        SELECT array_agg(u.nama_lengkap) as names FROM users u WHERE u.id = ANY(${allMemberIds})
      `;
      const [systemMsg] = names as { names: string[] }[];
      await sql`
        INSERT INTO chat_messages (room_id, user_id, message, type)
        VALUES (${room.id}, ${userId}, ${'Grup "' + (nama || 'Baru') + '" telah dibuat'}, 'system')
      `;
    }

    return NextResponse.json({ data: room }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal membuat chat' }, { status: 500 });
  }
}
