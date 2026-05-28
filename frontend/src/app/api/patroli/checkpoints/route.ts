import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const checkpoints = await sql`
      SELECT * FROM patrol_checkpoints
      WHERE is_active = true
      ORDER BY nama ASC
    `;

    return NextResponse.json({ data: checkpoints });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat checkpoint' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nama, lokasi_lat, lokasi_lng, radius_meters } = body;

    if (!nama) {
      return NextResponse.json({ message: 'Nama checkpoint wajib diisi' }, { status: 400 });
    }

    const [checkpoint] = await sql`
      INSERT INTO patrol_checkpoints (nama, lokasi_lat, lokasi_lng, radius_meters)
      VALUES (${nama}, ${lokasi_lat || null}, ${lokasi_lng || null}, ${radius_meters || 20})
      RETURNING *
    `;

    return NextResponse.json({ data: checkpoint }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal membuat checkpoint' }, { status: 500 });
  }
}
