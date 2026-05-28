import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [report] = await sql`
      SELECT
        ir.*,
        u.nama_lengkap as user_nama,
        u.foto_profil_url as user_foto,
        u.email as user_email,
        u.phone as user_phone,
        h.nama_lengkap as handler_nama
      FROM incident_reports ir
      JOIN users u ON u.id = ir.user_id
      LEFT JOIN users h ON h.id = ir.handled_by
      WHERE ir.id = ${id}
    `;

    if (!report) {
      return NextResponse.json({ message: 'Laporan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data: report });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat laporan' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, resolved_notes, handled_by } = body;

    const [report] = await sql`
      SELECT * FROM incident_reports WHERE id = ${id}
    `;

    if (!report) {
      return NextResponse.json({ message: 'Laporan tidak ditemukan' }, { status: 404 });
    }

    const validStatuses = ['diverifikasi', 'ditangani', 'selesai', 'ditutup'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 });
    }

    const updates: Record<string, any> = { status: status || report.status };
    if (resolved_notes) updates.resolved_notes = resolved_notes;
    if (status === 'ditangani' || status === 'diverifikasi') {
      updates.handled_by = handled_by || session.user.id;
      updates.handled_at = new Date().toISOString();
    }
    if (status === 'selesai' || status === 'ditutup') {
      updates.resolved_at = new Date().toISOString();
    }

    const [updated] = await sql`
      UPDATE incident_reports SET
        status = ${updates.status},
        resolved_notes = COALESCE(${updates.resolved_notes || null}, resolved_notes),
        handled_by = COALESCE(${updates.handled_by || null}, handled_by),
        handled_at = COALESCE(${updates.handled_at || null}::timestamptz, handled_at),
        resolved_at = COALESCE(${updates.resolved_at || null}::timestamptz, resolved_at)
      WHERE id = ${id}
      RETURNING *
    `;

    await sql`
      INSERT INTO notifications (user_id, type, title, body, data)
      VALUES (
        ${report.user_id},
        'incident',
        CONCAT('Laporan: ', ${updated.judul}),
        CONCAT('Status laporan berubah menjadi ', ${updated.status}),
        ${JSON.stringify({ report_id: id, status: updated.status })}
      )
    `;

    return NextResponse.json({ data: updated, message: 'Laporan berhasil diperbarui' });
  } catch {
    return NextResponse.json({ message: 'Gagal memperbarui laporan' }, { status: 500 });
  }
}
