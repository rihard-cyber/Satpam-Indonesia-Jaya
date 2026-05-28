import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (q.length < 1) {
      return NextResponse.json({ data: [] });
    }

    const users = await sql`
      SELECT id, nama_lengkap, email, foto_profil_url
      FROM users
      WHERE (LOWER(nama_lengkap) LIKE ${'%' + q.toLowerCase() + '%'} OR LOWER(email) LIKE ${'%' + q.toLowerCase() + '%'})
        AND id != ${session.user.id}
      ORDER BY nama_lengkap ASC
      LIMIT 20
    `;

    return NextResponse.json({ data: users });
  } catch {
    return NextResponse.json({ message: 'Gagal mencari user' }, { status: 500 });
  }
}
