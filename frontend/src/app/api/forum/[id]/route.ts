import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [post] = await sql`
      SELECT fp.*, u.nama_lengkap as author_name, u.foto_profil_url, fc.nama as category_name
      FROM forum_posts fp
      JOIN users u ON u.id = fp.user_id
      JOIN forum_categories fc ON fc.id = fp.category_id
      WHERE fp.id = ${id}
      LIMIT 1
    `;
    if (!post) {
      return NextResponse.json({ message: 'Post tidak ditemukan' }, { status: 404 });
    }

    await sql`UPDATE forum_posts SET views_count = views_count + 1 WHERE id = ${id}`;

    const comments = await sql`
      SELECT fc.*, u.nama_lengkap as author_name, u.foto_profil_url
      FROM forum_comments fc
      JOIN users u ON u.id = fc.user_id
      WHERE fc.post_id = ${id}
      ORDER BY fc.created_at ASC
    `;

    return NextResponse.json({ data: post, comments });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat post' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { konten } = await request.json();
    await sql`
      INSERT INTO forum_comments (post_id, user_id, konten)
      VALUES (${id}, ${session.user.id}, ${konten})
    `;
    return NextResponse.json({ message: 'Komentar ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal menambah komentar' }, { status: 500 });
  }
}
