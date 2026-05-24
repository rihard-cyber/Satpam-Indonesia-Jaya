import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon/db';
import { getAIResponse } from '@/lib/ai-knowledge';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, contextTitle, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    let reply = getAIResponse(message, contextTitle);

    if (sessionId) {
      await sql`
        INSERT INTO ai_chat_messages (user_id, role, message)
        VALUES (${session.user.id}, 'user', ${message})
      `;
      await sql`
        INSERT INTO ai_chat_messages (user_id, role, message)
        VALUES (${session.user.id}, 'assistant', ${reply})
      `;
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Maaf, terjadi gangguan. Silakan coba lagi.' });
  }
}
