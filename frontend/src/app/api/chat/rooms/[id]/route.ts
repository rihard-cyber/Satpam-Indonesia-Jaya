import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const [room] = await sql`
      SELECT cr.* FROM chat_rooms cr
      JOIN chat_room_members crm ON crm.room_id = cr.id AND crm.user_id = ${session.user.id}
      WHERE cr.id = ${id}
      LIMIT 1
    `;

    if (!room) {
      return NextResponse.json({ message: 'Room tidak ditemukan' }, { status: 404 });
    }

    const members = await sql`
      SELECT crm.*, u.nama_lengkap, u.email, u.foto_profil_url
      FROM chat_room_members crm
      JOIN users u ON u.id = crm.user_id
      WHERE crm.room_id = ${id}
      ORDER BY crm.joined_at ASC
    `;

    return NextResponse.json({ data: room, members });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat room' }, { status: 500 });
  }
}
