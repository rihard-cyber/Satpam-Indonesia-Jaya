import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*, tingkatan:tingkatan_id(*)')
      .eq('user_id', data.user.id)
      .single();

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile,
      },
      session: data.session,
    });
  } catch (err) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
