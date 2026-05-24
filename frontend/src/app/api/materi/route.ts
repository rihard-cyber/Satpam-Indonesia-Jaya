import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const tingkatan = searchParams.get('tingkatan');

  let query = supabase
    .from('materi')
    .select('*, kategori:materi_kategori_id(*), tingkatan:materi_kategori!inner(tingkatan_id, tingkatan:tingkatan_id(*))')
    .eq('is_published', true)
    .order('urutan');

  if (tingkatan) {
    query = query.eq('kategori.tingkatan_id', tingkatan);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from('materi_progress')
    .upsert({
      user_id: user.id,
      materi_id: body.materi_id,
      is_completed: body.is_completed,
      last_position_seconds: body.last_position_seconds,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
