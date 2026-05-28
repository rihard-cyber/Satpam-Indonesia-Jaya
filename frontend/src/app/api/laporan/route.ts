import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const jenis_kejadian = searchParams.get('jenis_kejadian');
    const tingkat_darurat = searchParams.get('tingkat_darurat');
    const user_id = searchParams.get('user_id');

    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push(`ir.status = $${params.length + 1}`);
      params.push(status);
    }
    if (jenis_kejadian) {
      conditions.push(`ir.jenis_kejadian = $${params.length + 1}`);
      params.push(jenis_kejadian);
    }
    if (tingkat_darurat) {
      conditions.push(`ir.tingkat_darurat = $${params.length + 1}`);
      params.push(tingkat_darurat);
    }
    if (user_id) {
      conditions.push(`ir.user_id = $${params.length + 1}`);
      params.push(user_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const reports = await sql.query(`
      SELECT
        ir.*,
        u.nama_lengkap as user_nama,
        u.foto_profil_url as user_foto,
        h.nama_lengkap as handler_nama
      FROM incident_reports ir
      JOIN users u ON u.id = ir.user_id
      LEFT JOIN users h ON h.id = ir.handled_by
      ${whereClause}
      ORDER BY ir.created_at DESC
      LIMIT 50
    `, params);

    const [statusCounts] = await sql.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'dilaporkan') as dilaporkan,
        COUNT(*) FILTER (WHERE status = 'diverifikasi') as diverifikasi,
        COUNT(*) FILTER (WHERE status = 'ditangani') as ditangani,
        COUNT(*) FILTER (WHERE status = 'selesai') as selesai,
        COUNT(*) FILTER (WHERE status = 'ditutup') as ditutup
      FROM incident_reports
    `);

    const levels = ['rendah', 'sedang', 'tinggi', 'kritis'];
    const sorted = (reports as any[]).sort(
      (a, b) => levels.indexOf(b.tingkat_darurat) - levels.indexOf(a.tingkat_darurat)
    );

    return NextResponse.json({ data: sorted, statusCounts });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat laporan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      jenis_kejadian, tingkat_darurat, judul, deskripsi,
      lokasi, lokasi_lat, lokasi_lng, foto_url, video_url,
      korban_jiwa, korban_luka, kerugian_perkiraan, tindakan_awal
    } = body;

    if (!jenis_kejadian || !judul?.trim() || !deskripsi?.trim()) {
      return NextResponse.json({ message: 'Jenis kejadian, judul, dan deskripsi wajib diisi' }, { status: 400 });
    }

    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
    const [counter] = await sql`
      SELECT COALESCE(MAX(SUBSTRING(nomor_laporan FROM '/(\d+)$')::int), 0) + 1 as next
      FROM incident_reports
      WHERE nomor_laporan LIKE ${'INC/' + dateStr + '/%'}
    `;

    const nomor_laporan = `INC/${dateStr}/${String(counter.next).padStart(5, '0')}`;

    const [report] = await sql`
      INSERT INTO incident_reports (
        user_id, nomor_laporan, jenis_kejadian, tingkat_darurat,
        judul, deskripsi, lokasi, lokasi_lat, lokasi_lng,
        foto_url, video_url, korban_jiwa, korban_luka,
        kerugian_perkiraan, tindakan_awal
      ) VALUES (
        ${session.user.id}, ${nomor_laporan}, ${jenis_kejadian}, ${tingkat_darurat || 'rendah'},
        ${judul.trim()}, ${deskripsi.trim()}, ${lokasi || null}, ${lokasi_lat || null}, ${lokasi_lng || null},
        ${foto_url?.length ? foto_url : []}, ${video_url?.length ? video_url : []},
        ${korban_jiwa || 0}, ${korban_luka || 0},
        ${kerugian_perkiraan || null}, ${tindakan_awal || null}
      )
      RETURNING *
    `;

    return NextResponse.json({ data: report, message: 'Laporan berhasil dibuat' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal membuat laporan' }, { status: 500 });
  }
}
