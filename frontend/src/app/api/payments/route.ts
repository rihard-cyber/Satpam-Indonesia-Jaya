import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await sql`
      SELECT p.*, pp.nama as plan_nama, pp.code as plan_code, pp.type as plan_type, pp.fitur as plan_fitur
      FROM payments p
      LEFT JOIN payment_plans pp ON pp.id = p.plan_id
      WHERE p.user_id = ${session.user.id}
      ORDER BY p.created_at DESC
    `;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal memuat pembayaran' }, { status: 500 });
  }
}
