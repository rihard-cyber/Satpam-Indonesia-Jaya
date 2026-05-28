import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, transaction_status, payment_type } = body;

    if (!order_id) {
      return NextResponse.json({ message: 'order_id required' }, { status: 400 });
    }

    const [payment] = await sql`
      SELECT * FROM payments WHERE id = ${order_id}
    `;

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    let newStatus = payment.status;
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      newStatus = 'success';
    } else if (transaction_status === 'pending') {
      newStatus = 'pending';
    } else if (['deny', 'cancel', 'expire', 'failure'].includes(transaction_status)) {
      newStatus = 'failed';
    }

    await sql`
      UPDATE payments SET
        status = ${newStatus},
        payment_method = ${payment_type || null},
        midtrans_transaction_id = ${body.transaction_id || null},
        paid_at = ${newStatus === 'success' ? new Date().toISOString() : null}
      WHERE id = ${order_id}
    `;

    if (newStatus === 'success') {
      const [plan] = await sql`
        SELECT * FROM payment_plans WHERE id = ${payment.plan_id}
      `;

      if (plan) {
        if (plan.type === 'loker') {
          const [lokerPayment] = await sql`
            SELECT * FROM job_vacancies WHERE payment_id = ${payment.id}
          `;
          if (lokerPayment) {
            const expiresAt = new Date(Date.now() + plan.durasi_hari * 24 * 60 * 60 * 1000).toISOString();
            await sql`
              UPDATE job_vacancies SET is_premium = true, premium_expires_at = ${expiresAt} WHERE id = ${lokerPayment.id}
            `;
          }
        } else if (plan.type === 'course') {
          const expiresAt = new Date(Date.now() + plan.durasi_hari * 24 * 60 * 60 * 1000).toISOString();
          await sql`
            INSERT INTO course_purchases (user_id, payment_id, course_code, course_nama, access_until)
            VALUES (${payment.user_id}, ${payment.id}, ${plan.code}, ${plan.nama}, ${expiresAt})
          `;
        }
      }
    }

    return NextResponse.json({ message: 'OK' });
  } catch (err) {
    return NextResponse.json({ message: 'Webhook failed' }, { status: 500 });
  }
}
