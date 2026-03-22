import { NextResponse } from 'next/server';

// Disabled — use POST /api/game/new
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
