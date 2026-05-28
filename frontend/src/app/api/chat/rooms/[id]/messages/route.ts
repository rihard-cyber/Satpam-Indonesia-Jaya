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
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const [isMember] = await sql`
      SELECT 1 FROM chat_room_members WHERE room_id = ${id} AND user_id = ${session.user.id} LIMIT 1
    `;
    if (!isMember) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const messages = await sql`
      SELECT cm.*, u.nama_lengkap, u.foto_profil_url
      FROM chat_messages cm
      JOIN users u ON u.id = cm.user_id
      WHERE cm.room_id = ${id}
      ORDER BY cm.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const total = await sql`
      SELECT COUNT(*)::int as count FROM chat_messages WHERE room_id = ${id}
    `;

    return NextResponse.json({
      data: (messages as any[]).reverse(),
      total: (total[0] as any)?.count || 0,
    });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat pesan' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const [isMember] = await sql`
      SELECT 1 FROM chat_room_members WHERE room_id = ${id} AND user_id = ${session.user.id} LIMIT 1
    `;
    if (!isMember) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { message, type, attachment_url } = await request.json();
    if (!message && !attachment_url) {
      return NextResponse.json({ message: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const [msg] = await sql`
      INSERT INTO chat_messages (room_id, user_id, message, type, attachment_url)
      VALUES (${id}, ${session.user.id}, ${message || ''}, ${type || 'text'}, ${attachment_url || null})
      RETURNING *
    `;

    return NextResponse.json({ data: msg }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal mengirim pesan' }, { status: 500 });
  }
}
