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
    const date = searchParams.get('date');

    let query = sql`
      SELECT * FROM attendance_logs
      WHERE user_id = ${session.user.id}
    `;

    if (date) {
      query = sql`${query} AND DATE(timestamp) = ${date}::date`;
    }

    query = sql`${query} ORDER BY timestamp DESC`;

    const logs = await query;
    return NextResponse.json({ data: logs });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat absensi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, method, foto_url, lokasi_lat, lokasi_lng, lokasi_nama, device_info } = body;

    if (!type || !method) {
      return NextResponse.json({ message: 'type dan method wajib diisi' }, { status: 400 });
    }

    const validTypes = ['checkin', 'checkout'];
    const validMethods = ['qr', 'gps', 'manual'];

    if (!validTypes.includes(type)) {
      return NextResponse.json({ message: 'type harus checkin atau checkout' }, { status: 400 });
    }
    if (!validMethods.includes(method)) {
      return NextResponse.json({ message: 'method harus qr, gps, atau manual' }, { status: 400 });
    }

    const [log] = await sql`
      INSERT INTO attendance_logs (user_id, type, method, foto_url, lokasi_lat, lokasi_lng, lokasi_nama, device_info)
      VALUES (${session.user.id}, ${type}, ${method}, ${foto_url || null}, ${lokasi_lat || null}, ${lokasi_lng || null}, ${lokasi_nama || null}, ${device_info || null})
      RETURNING *
    `;

    return NextResponse.json({ data: log }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal mencatat absensi' }, { status: 500 });
  }
}
