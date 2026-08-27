import { NextRequest, NextResponse } from 'next/server';
import { GameSession } from '@/lib/party/GameSession';

type Params = { params: Promise<{ gameId: string }> };

/**
 * GET /api/party/:gameId/exists
 *
 * Lightweight existence check — does not trigger round resolution.
 * Used by the lobby page to validate a game code before navigating.
 *
 * Response: { exists: true, status: 'waiting' | 'active' | 'finished' }
 */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { gameId } = await params;
    const session = await GameSession.load(gameId);
    if (!session) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    //we need to fix the getStatus method to return status of the game 
    const { status } = session.getStatus();
    return NextResponse.json({ exists: true, status });
  } catch (err) {
    console.error('[party/exists] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
