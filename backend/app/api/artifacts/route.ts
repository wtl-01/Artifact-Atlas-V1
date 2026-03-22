import { NextResponse } from 'next/server';

// Disabled — artifacts are served via /api/artifacts/:id and /api/game/new
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
