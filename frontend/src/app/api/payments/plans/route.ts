import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data;
    if (type) {
      data = await sql`
        SELECT * FROM payment_plans WHERE is_active = true AND type = ${type} ORDER BY harga ASC
      `;
    } else {
      data = await sql`
        SELECT * FROM payment_plans WHERE is_active = true ORDER BY type, harga ASC
      `;
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal memuat paket' }, { status: 500 });
  }
}
