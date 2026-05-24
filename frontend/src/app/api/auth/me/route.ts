import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const [user] = await sql`
    SELECT
      u.id, u.email, u.nama_lengkap, u.nama_panggilan, u.foto_profil_url,
      u.phone, u.role, u.tingkatan_id, u.created_at as user_created_at,
      p.tempat_lahir, p.tanggal_lahir, p.tinggi_cm, p.berat_kg,
      p.domisili, p.provinsi, p.pengalaman_kerja, p.keahlian, p.bahasa,
      p.nomor_sim, p.bersedia_shift, p.bersedia_penempatan_luar_kota,
      p.tentang_saya,
      t.nama as tingkatan_nama
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    LEFT JOIN tingkatan t ON t.id = u.tingkatan_id
    WHERE u.id = ${session.user.id}
  `;

  return NextResponse.json({ user });
}
