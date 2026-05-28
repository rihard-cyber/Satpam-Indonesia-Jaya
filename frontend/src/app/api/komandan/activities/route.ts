import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const teams = await sql`
      SELECT id FROM guard_teams WHERE commander_id = ${session.user.id}
    `;

    if (teams.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const teamIds = teams.map((t: any) => t.id);

    const memberIds = await sql`
      SELECT DISTINCT user_id FROM team_members WHERE team_id = ANY(${teamIds}::uuid[])
    `;

    const userIds = memberIds.map((m: any) => m.user_id);

    if (userIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const patrolLogs = await sql`
      SELECT
        pl.id, pl.timestamp as waktu, pl.status,
        'patroli' as jenis,
        u.nama_lengkap as user_nama,
        u.foto_profil_url,
        ps.shift_type
      FROM patrol_logs pl
      JOIN users u ON u.id = pl.user_id
      JOIN patrol_shifts ps ON ps.id = pl.shift_id
      WHERE pl.user_id = ANY(${userIds}::text[])
        AND pl.timestamp > NOW() - INTERVAL '24 hours'
      ORDER BY pl.timestamp DESC
      LIMIT 20
    `;

    const attendanceLogs = await sql`
      SELECT
        al.id, al.timestamp as waktu, al.type,
        'absensi' as jenis,
        u.nama_lengkap as user_nama,
        u.foto_profil_url,
        al.method
      FROM attendance_logs al
      JOIN users u ON u.id = al.user_id
      WHERE al.user_id = ANY(${userIds}::text[])
        AND al.timestamp > NOW() - INTERVAL '24 hours'
      ORDER BY al.timestamp DESC
      LIMIT 20
    `;

    const incidentReports = await sql`
      SELECT
        ir.id, ir.created_at as waktu, ir.judul,
        'laporan' as jenis,
        u.nama_lengkap as user_nama,
        u.foto_profil_url,
        ir.tingkat_darurat,
        ir.status
      FROM incident_reports ir
      JOIN users u ON u.id = ir.user_id
      WHERE ir.user_id = ANY(${userIds}::text[])
        AND ir.created_at > NOW() - INTERVAL '24 hours'
      ORDER BY ir.created_at DESC
      LIMIT 20
    `;

    const combined = [
      ...patrolLogs.map((l: any) => ({ ...l, waktu: l.waktu?.toISOString?.() || l.waktu })),
      ...attendanceLogs.map((l: any) => ({ ...l, waktu: l.waktu?.toISOString?.() || l.waktu })),
      ...incidentReports.map((l: any) => ({ ...l, waktu: l.waktu?.toISOString?.() || l.waktu })),
    ].sort((a: any, b: any) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime())
     .slice(0, 30);

    return NextResponse.json({ data: combined });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat aktivitas' }, { status: 500 });
  }
}
