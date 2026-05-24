import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  try {
    const data = await sql`
      SELECT * FROM job_vacancies WHERE status = 'active' ORDER BY created_at DESC
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
      INSERT INTO job_vacancies (perusahaan_nama, posisi, penempatan, deskripsi_tugas, posted_by)
      VALUES (${body.perusahaan_nama}, ${body.posisi}, ${body.penempatan}, ${body.deskripsi_tugas}, ${session.user.id})
    `;
    return NextResponse.json({ message: 'Lowongan berhasil ditambahkan' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Gagal menambahkan lowongan' }, { status: 500 });
  }
}
