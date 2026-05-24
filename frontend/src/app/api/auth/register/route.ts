import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password, nama_lengkap, nama_panggilan, phone } = await request.json();

    if (!email || !password || !nama_lengkap) {
      return NextResponse.json({ message: 'Email, password, dan nama wajib diisi' }, { status: 400 });
    }

    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const password_hash = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO users (id, email, nama_lengkap, nama_panggilan, phone, password_hash)
      VALUES (${id}, ${email}, ${nama_lengkap}, ${nama_panggilan || null}, ${phone || null}, ${password_hash})
    `;

    await sql`
      INSERT INTO profiles (user_id) VALUES (${id})
    `;

    return NextResponse.json({
      message: 'Registrasi berhasil. Silakan login.',
      user: { id, email, nama_lengkap },
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
