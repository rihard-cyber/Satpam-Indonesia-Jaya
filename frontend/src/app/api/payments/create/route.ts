import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { plan_code } = await request.json();
    if (!plan_code) {
      return NextResponse.json({ message: 'plan_code diperlukan' }, { status: 400 });
    }

    const [plan] = await sql`
      SELECT * FROM payment_plans WHERE code = ${plan_code} AND is_active = true
    `;

    if (!plan) {
      return NextResponse.json({ message: 'Paket tidak ditemukan' }, { status: 404 });
    }

    const expires_at = plan.durasi_hari > 0
      ? new Date(Date.now() + plan.durasi_hari * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const [payment] = await sql`
      INSERT INTO payments (user_id, plan_id, amount, expires_at)
      VALUES (${session.user.id}, ${plan.id}, ${plan.harga}, ${expires_at})
      RETURNING id
    `;

    return NextResponse.json({
      redirect_url: `/payments/confirm/${payment.id}`,
      payment_id: payment.id,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal membuat pembayaran' }, { status: 500 });
  }
}
