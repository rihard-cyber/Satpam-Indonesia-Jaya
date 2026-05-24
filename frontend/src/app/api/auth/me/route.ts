import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, tingkatan:tingkatan_id(*), badges:user_badges(badge:badge_type_id(*))')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      ...profile,
    },
  });
}
