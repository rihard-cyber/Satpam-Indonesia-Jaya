import { NextResponse } from 'next/server';
import { runMigration } from '@/lib/neon/migrate';

export async function GET() {
  try {
    await runMigration();
    return NextResponse.json({ message: 'Migration completed successfully' });
  } catch (err) {
    return NextResponse.json(
      { message: 'Migration failed', error: (err as Error).message },
      { status: 500 }
    );
  }
}
