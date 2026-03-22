import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCapitals } from '@/lib/capitals';
import { bearing, yearHint } from '@/lib/geo';
import { metCountryToIso3 } from '@/lib/metCountryMap';

const MAX_GUESSES = 5;
type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/game/:gameId/guess
 *
 * Body: { "country": "CAN", "year": 1965, "objectId": "12345" }
 *
 * Response:
 * {
 *   guessNumber:  1,
 *   guessesLeft:  4,
 *   gameStatus:   "active" | "won" | "lost",
 *   geo: {
 *     bearing:    190.005,
 *     distanceKm: 3124,
 *     display:    "190.005°, 3124km"
 *   },
 *   year: { hint: "Younger" | "Older" | "Correct" }
 * }
 */
export async function POST(req: NextRequest, { params }: Params) {
  const { id: gameId } = await params;
  const body = await req.json();
  const { country, year, objectId, forfeit } = body as {
    country?: string;
    year?: number;
    objectId?: string;
    forfeit?: boolean;
  };

  if (!objectId) {
    return NextResponse.json({ error: '"objectId" is required' }, { status: 400 });
  }

  // ── Forfeit path ──────────────────────────────────────────────────────────
  if (forfeit) {
    const guessCount = await db.game_status.count({ where: { game_id: gameId } });
    const alreadyDone = await db.game_status.findFirst({
      where: {
        game_id: gameId,
        OR: [{ is_correct: true }, { country_guessed: 'FORFEIT' }],
      },
    });
    if (alreadyDone || guessCount >= MAX_GUESSES) {
      return NextResponse.json({ error: 'Game is already finished' }, { status: 409 });
    }

    await db.game_status.create({
      data: {
        game_id:          gameId,
        guess_number:     guessCount + 1,
        country_guessed:  'FORFEIT',
        object_uuid:      BigInt(objectId),
        is_correct:       false,
      },
    });

    return NextResponse.json({ gameStatus: 'forfeited', guessesLeft: 0 });
  }

  if (!country || year === undefined) {
    return NextResponse.json(
      { error: '"country" (ISO alpha-3) and "year" are required (or pass forfeit: true)' },
      { status: 400 },
    );
  }

  const guessedIso3 = country.toUpperCase();

  // ── Load artifact ─────────────────────────────────────────────────────────
  const artifact = await db.metObjects.findUnique({
    where: { Object_ID: BigInt(objectId) },
    select: {
      Object_ID:          true,
      Modern_Country:     true,
      Object_Begin_Date:  true,
    },
  });

  if (!artifact) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
  }

  const artifactIso3 = metCountryToIso3(artifact.Modern_Country!);
  if (!artifactIso3) {
    return NextResponse.json(
      { error: 'Artifact country cannot be resolved — contact admin' },
      { status: 500 },
    );
  }

  const artifactYear = Number(artifact.Object_Begin_Date);

  // ── Count existing guesses for this game ─────────────────────────────────
  const guessCount = await db.game_status.count({ where: { game_id: gameId } });

  if (guessCount >= MAX_GUESSES) {
    return NextResponse.json({ error: 'Game already completed (no guesses left)' }, { status: 409 });
  }

  // Check if already won
  const alreadyWon = await db.game_status.findFirst({
    where: { game_id: gameId, is_correct: true },
  });
  if (alreadyWon) {
    return NextResponse.json({ error: 'Game already won' }, { status: 409 });
  }

  // ── Distance from DistMatrix ──────────────────────────────────────────────
  const isSameCountry = guessedIso3 === artifactIso3;

  let distKm = 0;
  if (!isSameCountry) {
    const entry = await db.distMatrix.findUnique({
      where: { iso_o_iso_d: { iso_o: guessedIso3, iso_d: artifactIso3 } },
    });
    distKm = entry?.distcap ?? 0;
  }

  // ── Bearing from capitals ─────────────────────────────────────────────────
  let bear = 0;
  if (!isSameCountry) {
    const capitals = await getCapitals();
    const from = capitals.get(guessedIso3);
    const to   = capitals.get(artifactIso3);
    if (from && to) {
      bear = bearing(from.lat, from.lng, to.lat, to.lng);
    }
  }

  // ── Year hint ─────────────────────────────────────────────────────────────
  const hint = yearHint(artifactYear, Number(year));

  // ── Win condition ─────────────────────────────────────────────────────────
  const won         = isSameCountry && hint === 'Correct';
  const guessNumber = guessCount + 1;
  const guessesLeft = MAX_GUESSES - guessNumber;
  const lost        = !won && guessesLeft === 0;

  // ── Persist to game_status ────────────────────────────────────────────────
  await db.game_status.create({
    data: {
      game_id:          gameId,
      guess_number:     guessNumber,
      country_guessed:  guessedIso3,
      time_guessed:     new Date(Number(year), 0, 1),
      object_uuid:      BigInt(objectId),
      country_distance: distKm,
      time_distance:    BigInt(Math.abs(artifactYear - Number(year))),
      is_correct:       won,
    },
  });

  const gameStatus = won ? 'won' : lost ? 'lost' : 'active';

  return NextResponse.json({
    guessNumber,
    guessesLeft,
    gameStatus,
    geo: {
      bearing:    parseFloat(bear.toFixed(3)),
      distanceKm: Math.round(distKm),
      display:    isSameCountry
        ? '0.000°, 0km'
        : `${bear.toFixed(3)}°, ${Math.round(distKm)}km`,
    },
    year: { hint },
  });
}
