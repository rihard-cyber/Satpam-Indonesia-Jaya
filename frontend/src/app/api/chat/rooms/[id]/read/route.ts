import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    await sql`
      UPDATE chat_room_members
      SET last_read_at = NOW()
      WHERE room_id = ${id} AND user_id = ${session.user.id}
    `;

    return NextResponse.json({ message: 'OK' });
  } catch {
    return NextResponse.json({ message: 'Gagal update status baca' }, { status: 500 });
  }
}
