import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MAX_GUESSES = 5;
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/game/:gameId
 *
 * Returns all guesses made so far and derived game state.
 * Does NOT reveal the artifact's answer.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id: gameId } = await params;

  const guesses = await db.game_status.findMany({
    where: { game_id: gameId },
    orderBy: { guess_number: 'asc' },
  });

  const guessesLeft = Math.max(0, MAX_GUESSES - guesses.length);
  const won       = guesses.some((g) => g.is_correct);
  const forfeited = guesses.some((g) => g.country_guessed === 'FORFEIT');
  const lost      = !won && !forfeited && guessesLeft === 0;
  const status    = won ? 'won' : forfeited ? 'forfeited' : lost ? 'lost' : 'active';

  return NextResponse.json({
    gameId,
    status,
    guessesLeft,
    guesses: guesses.map((g) => ({
      guessNumber:  g.guess_number,
      country:      g.country_guessed,
      year:         g.time_guessed ? new Date(g.time_guessed).getFullYear() : null,
      geo: {
        distanceKm: g.country_distance ? Math.round(g.country_distance) : 0,
        display:    g.country_distance
          ? `${Math.round(g.country_distance)}km`
          : '0km',
      },
      yearDiff: g.time_distance ? Number(g.time_distance) : 0,
      correct:      g.is_correct,
    })),
  });
}
