import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await sql`
      SELECT * FROM notifications
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const unreadCount = await sql`
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ${session.user.id} AND is_read = false
    `;

    return NextResponse.json({ data: notifications, unreadCount: unreadCount[0]?.count || 0 });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat notifikasi' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, is_read } = await request.json();
    if (id === 'all') {
      await sql`UPDATE notifications SET is_read = true WHERE user_id = ${session.user.id}`;
    } else {
      await sql`UPDATE notifications SET is_read = ${is_read} WHERE id = ${id} AND user_id = ${session.user.id}`;
    }
    return NextResponse.json({ message: 'OK' });
  } catch {
    return NextResponse.json({ message: 'Gagal update notifikasi' }, { status: 500 });
  }
}
