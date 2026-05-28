import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';
import crypto from 'crypto';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    let [shift] = await sql`
      SELECT id FROM patrol_shifts
      WHERE user_id = ${session.user.id}
        AND shift_date = ${today}
        AND status IN ('scheduled', 'in_progress')
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!shift) {
      const hour = new Date().getHours();
      let shift_type = 'pagi';
      if (hour >= 12 && hour < 18) shift_type = 'siang';
      else if (hour >= 18) shift_type = 'malam';

      [shift] = await sql`
        INSERT INTO patrol_shifts (user_id, shift_date, shift_type, status)
        VALUES (${session.user.id}, ${today}, ${shift_type}, 'scheduled')
        RETURNING id
      `;
    }

    const token = crypto.randomBytes(32).toString('hex');

    return NextResponse.json({
      token: JSON.stringify({
        user_id: session.user.id,
        shift_id: shift.id,
        token: token,
        timestamp: new Date().toISOString(),
      }),
      shift_id: shift.id,
    });
  } catch {
    return NextResponse.json({ message: 'Gagal generate QR code' }, { status: 500 });
  }
}
