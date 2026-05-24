import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const [user] = await sql`
    SELECT u.*, p.*, t.nama as tingkatan_nama
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    LEFT JOIN tingkatan t ON t.id = u.tingkatan_id
    WHERE u.id = ${session.user.id}
  `;

  return NextResponse.json({ user });
}
