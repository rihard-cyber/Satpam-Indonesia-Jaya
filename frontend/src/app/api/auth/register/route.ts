import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nama_lengkap, nama_panggilan, phone, tingkatan_id } = body;

    const supabase = createAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { nama_lengkap, nama_panggilan },
    });

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        nama_lengkap,
        nama_panggilan,
        phone,
        tingkatan_id,
      })
      .eq('user_id', authData.user.id);

    if (profileError) {
      return NextResponse.json({ message: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
      user_id: authData.user.id,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
