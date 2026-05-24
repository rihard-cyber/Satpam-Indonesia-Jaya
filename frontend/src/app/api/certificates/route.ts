import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const certificates = await sql`
      SELECT * FROM certificates WHERE user_id = ${session.user.id} ORDER BY created_at DESC
    `;
    return NextResponse.json({ data: certificates });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat sertifikat' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { jenis, nama_sertifikat, penerbit, nomor_sertifikat, file_url } = await request.json();
    await sql`
      INSERT INTO certificates (user_id, jenis, nama_sertifikat, penerbit, nomor_sertifikat, file_url)
      VALUES (${session.user.id}, ${jenis}, ${nama_sertifikat}, ${penerbit}, ${nomor_sertifikat}, ${file_url})
    `;
    return NextResponse.json({ message: 'Sertifikat ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal menambah sertifikat' }, { status: 500 });
  }
}
