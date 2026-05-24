import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [user] = await sql`
      SELECT u.*, p.*, t.nama as tingkatan_nama, t.kode as tingkatan_kode
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN tingkatan t ON t.id = u.tingkatan_id
      WHERE u.id = ${session.user.id}
      LIMIT 1
    `;

    const badges = await sql`
      SELECT bt.kode, bt.nama FROM user_badges ub
      JOIN badge_types bt ON bt.id = ub.badge_id
      WHERE ub.user_id = ${session.user.id}
    `;

    const kta = await sql`
      SELECT * FROM kta_documents WHERE user_id = ${session.user.id} ORDER BY created_at DESC LIMIT 1
    `;

    return NextResponse.json({ data: user, badges, kta: kta[0] || null });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat profil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nama_lengkap, nama_panggilan, tempat_lahir, tanggal_lahir, tinggi_cm, berat_kg, domisili, provinsi, pengalaman_kerja, keahlian, bahasa, nomor_sim, bersedia_shift, bersedia_penempatan_luar_kota, tentang_saya } = body;

    if (nama_lengkap) {
      await sql`UPDATE users SET nama_lengkap = ${nama_lengkap} WHERE id = ${session.user.id}`;
    }

    await sql`
      INSERT INTO profiles (user_id, tempat_lahir, tanggal_lahir, tinggi_cm, berat_kg, domisili, provinsi, pengalaman_kerja, keahlian, bahasa, nomor_sim, bersedia_shift, bersedia_penempatan_luar_kota, tentang_saya)
      VALUES (${session.user.id}, ${tempat_lahir || null}, ${tanggal_lahir || null}, ${tinggi_cm || null}, ${berat_kg || null}, ${domisili || null}, ${provinsi || null}, ${pengalaman_kerja || null}, ${keahlian || null}, ${bahasa || null}, ${nomor_sim || null}, ${bersedia_shift ?? true}, ${bersedia_penempatan_luar_kota ?? false}, ${tentang_saya || null})
      ON CONFLICT (user_id) DO UPDATE SET
        tempat_lahir = EXCLUDED.tempat_lahir,
        tanggal_lahir = EXCLUDED.tanggal_lahir,
        tinggi_cm = EXCLUDED.tinggi_cm,
        berat_kg = EXCLUDED.berat_kg,
        domisili = EXCLUDED.domisili,
        provinsi = EXCLUDED.provinsi,
        pengalaman_kerja = EXCLUDED.pengalaman_kerja,
        keahlian = EXCLUDED.keahlian,
        bahasa = EXCLUDED.bahasa,
        nomor_sim = EXCLUDED.nomor_sim,
        bersedia_shift = EXCLUDED.bersedia_shift,
        bersedia_penempatan_luar_kota = EXCLUDED.bersedia_penempatan_luar_kota,
        tentang_saya = EXCLUDED.tentang_saya
    `;

    return NextResponse.json({ message: 'Profil diperbarui' });
  } catch {
    return NextResponse.json({ message: 'Gagal update profil' }, { status: 500 });
  }
}
