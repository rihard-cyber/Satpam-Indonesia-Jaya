import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { vacancy_id, payment_id } = await request.json();
    if (!vacancy_id || !payment_id) {
      return NextResponse.json({ message: 'vacancy_id dan payment_id diperlukan' }, { status: 400 });
    }

    const [vacancy] = await sql`
      SELECT * FROM job_vacancies WHERE id = ${vacancy_id} AND posted_by = ${session.user.id}
    `;

    if (!vacancy) {
      return NextResponse.json({ message: 'Lowongan tidak ditemukan' }, { status: 404 });
    }

    const [payment] = await sql`
      SELECT p.*, pp.durasi_hari FROM payments p
      JOIN payment_plans pp ON pp.id = p.plan_id
      WHERE p.id = ${payment_id} AND p.status = 'success'
    `;

    if (!payment) {
      return NextResponse.json({ message: 'Pembayaran tidak valid' }, { status: 400 });
    }

    const premium_expires_at = new Date(Date.now() + payment.durasi_hari * 24 * 60 * 60 * 1000).toISOString();

    await sql`
      UPDATE job_vacancies SET
        is_premium = true,
        premium_expires_at = ${premium_expires_at},
        payment_id = ${payment_id}
      WHERE id = ${vacancy_id}
    `;

    return NextResponse.json({ message: 'Lowongan berhasil dipremiumkan' });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal mempremiumkan lowongan' }, { status: 500 });
  }
}
