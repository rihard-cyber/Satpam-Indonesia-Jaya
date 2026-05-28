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
      return NextResponse.json({
        total_anggota: 0,
        aktif_bertugas: 0,
        checkpoint_hari_ini: 0,
        kejadian_aktif: 0,
        kehadiran_hari_ini: 0,
        total_anggota_team: 0,
      });
    }

    const teamIds = teams.map((t: any) => t.id);

    const [totalMembers] = await sql`
      SELECT COUNT(DISTINCT user_id) as count
      FROM team_members WHERE team_id = ANY(${teamIds}::uuid[])
    `;

    const [activeShifts] = await sql`
      SELECT COUNT(*) as count
      FROM patrol_shifts ps
      JOIN team_members tm ON tm.user_id = ps.user_id
      WHERE tm.team_id = ANY(${teamIds}::uuid[])
        AND ps.status = 'in_progress'
    `;

    const [completedCheckpoints] = await sql`
      SELECT COUNT(*) as count
      FROM patrol_logs pl
      JOIN team_members tm ON tm.user_id = pl.user_id
      WHERE tm.team_id = ANY(${teamIds}::uuid[])
        AND pl.timestamp > CURRENT_DATE
        AND pl.status = 'ok'
    `;

    const [activeIncidents] = await sql`
      SELECT COUNT(*) as count
      FROM incident_reports ir
      JOIN team_members tm ON tm.user_id = ir.user_id
      WHERE tm.team_id = ANY(${teamIds}::uuid[])
        AND ir.status NOT IN ('selesai', 'ditutup')
    `;

    const [attendanceToday] = await sql`
      SELECT COUNT(DISTINCT al.user_id) as count
      FROM attendance_logs al
      JOIN team_members tm ON tm.user_id = al.user_id
      WHERE tm.team_id = ANY(${teamIds}::uuid[])
        AND al.timestamp > CURRENT_DATE
        AND al.type = 'checkin'
    `;

    return NextResponse.json({
      total_anggota: Number(totalMembers.count),
      aktif_bertugas: Number(activeShifts.count),
      checkpoint_hari_ini: Number(completedCheckpoints.count),
      kejadian_aktif: Number(activeIncidents.count),
      kehadiran_hari_ini: Number(attendanceToday.count),
    });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat rekap' }, { status: 500 });
  }
}
