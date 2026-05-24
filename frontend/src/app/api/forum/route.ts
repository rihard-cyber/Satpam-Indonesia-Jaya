import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let posts;
    if (category && category !== 'Semua') {
      posts = await sql`
        SELECT fp.*, u.nama_lengkap as author_name, fc.nama as category_name,
          (SELECT COUNT(*) FROM forum_comments WHERE post_id = fp.id) as comment_count
        FROM forum_posts fp
        JOIN users u ON u.id = fp.user_id
        JOIN forum_categories fc ON fc.id = fp.category_id
        WHERE fc.nama = ${category}
        ORDER BY fp.is_pinned DESC, fp.created_at DESC
        LIMIT 50
      `;
    } else {
      posts = await sql`
        SELECT fp.*, u.nama_lengkap as author_name, fc.nama as category_name,
          (SELECT COUNT(*) FROM forum_comments WHERE post_id = fp.id) as comment_count
        FROM forum_posts fp
        JOIN users u ON u.id = fp.user_id
        JOIN forum_categories fc ON fc.id = fp.category_id
        ORDER BY fp.is_pinned DESC, fp.created_at DESC
        LIMIT 50
      `;
    }

    const categories = await sql`SELECT * FROM forum_categories ORDER BY urutan`;
    const stats = await sql`
      SELECT
        (SELECT COUNT(*) FROM forum_posts) as total_posts,
        (SELECT COUNT(*) FROM forum_comments) as total_comments,
        (SELECT COUNT(*) FROM users) as total_members
    `;

    return NextResponse.json({ data: posts, categories, stats: stats[0] });
  } catch {
    return NextResponse.json({ message: 'Gagal memuat forum' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { category_id, judul, konten } = await request.json();
    await sql`
      INSERT INTO forum_posts (category_id, user_id, judul, konten)
      VALUES (${category_id}, ${session.user.id}, ${judul}, ${konten})
    `;
    return NextResponse.json({ message: 'Post berhasil dibuat' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Gagal membuat post' }, { status: 500 });
  }
}
