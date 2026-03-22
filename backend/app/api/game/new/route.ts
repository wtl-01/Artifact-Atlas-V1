import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { metCountryToIso3 } from '@/lib/metCountryMap';

/**
 * POST /api/game/new
 *
 * Picks a random eligible MetObject (has image + country + begin date)
 * and starts a new 5-guess game.
 *
 * Response:
 *   { gameId, objectId, imageUrl }
 *
 * The client must echo back objectId with every subsequent guess.
 */
export async function POST() {
  // Count eligible objects
  const count = await db.metObjects.count({
    where: {
      Primary_Image_URL:  { not: null },
      Modern_Country:     { not: null },
      Object_Begin_Date:  { not: null },
    },
  });

  if (count === 0) {
    return NextResponse.json({ error: 'No eligible artifacts found' }, { status: 404 });
  }

  // Random skip — keep retrying if the selected row has an unmappable country
  for (let attempts = 0; attempts < 10; attempts++) {
    const skip = Math.floor(Math.random() * count);

    const artifact = await db.metObjects.findFirst({
      where: {
        Primary_Image_URL: { not: null },
        Modern_Country:    { not: null },
        Object_Begin_Date: { not: null },
      },
      select: {
        Object_ID:           true,
        Primary_Image_URL:   true,
        Modern_Country:      true,
        Object_Begin_Date:   true,
        Title:               true,
      },
      skip,
    });

    if (!artifact) continue;

    const iso3 = metCountryToIso3(artifact.Modern_Country!);
    if (!iso3) continue; // skip if country name isn't in our map

    return NextResponse.json({
      gameId:   crypto.randomUUID(),
      objectId: artifact.Object_ID.toString(),
      imageUrl: artifact.Primary_Image_URL,
      title:    artifact.Title,
    }, { status: 201 });
  }

  return NextResponse.json(
    { error: 'Could not find an artifact with a mappable country — try again' },
    { status: 500 },
  );
}
