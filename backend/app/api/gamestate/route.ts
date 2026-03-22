import { NextResponse } from 'next/server';

// Disabled — use GET /api/game/:id
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
