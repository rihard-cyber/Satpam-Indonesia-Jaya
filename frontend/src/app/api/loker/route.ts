import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  try {
    const data = await sql`
      SELECT *, is_premium = true AND (premium_expires_at IS NULL OR premium_expires_at > NOW()) as is_premium_active
      FROM job_vacancies WHERE status = 'active'
      ORDER BY is_premium DESC, created_at DESC
    `;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal memuat data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await sql`
      INSERT INTO job_vacancies (
        perusahaan_nama, posisi, penempatan, provinsi, kota_kabupaten,
        deskripsi_tugas, gaji_min, gaji_max, jumlah_kebutuhan,
        shift_info, minimal_tinggi_cm, minimal_pendidikan,
        wajib_sertifikat, pengalaman_minimal, jenis_kelamin,
        deadline, benefit, kontak_hrd_nama, kontak_hrd_phone,
        kontak_hrd_email, posted_by
      ) VALUES (
        ${body.perusahaan_nama}, ${body.posisi}, ${body.penempatan},
        ${body.provinsi || null}, ${body.kota_kabupaten || null},
        ${body.deskripsi_tugas}, ${body.gaji_min || null},
        ${body.gaji_max || null}, ${body.jumlah_kebutuhan || 1},
        ${body.shift_info || null}, ${body.minimal_tinggi_cm || null},
        ${body.minimal_pendidikan || null}, ${body.wajib_sertifikat || false},
        ${body.pengalaman_minimal || null}, ${body.jenis_kelamin || 'semua'},
        ${body.deadline || null}, ${body.benefit || null},
        ${body.kontak_hrd_nama || null}, ${body.kontak_hrd_phone || null},
        ${body.kontak_hrd_email || null}, ${session.user.id}
      )
    `;
    return NextResponse.json({ message: 'Lowongan berhasil ditambahkan' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal menambahkan lowongan' }, { status: 500 });
  }
}
