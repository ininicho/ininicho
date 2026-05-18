// src/routes/+page.ts
import type { PageLoad } from './$types';
import type { Photo } from '$lib/content';

const MANIFEST_URL = 'https://public.ininicho.com/gallery/manifest.json';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) return { pinnedPhotos: [] };
    const data = await res.json() as { pinned?: string[]; photos?: Photo[] };

    const pinned = data.pinned ?? [];
    const photos = data.photos ?? [];

    const pinnedPhotos = pinned
      .map((id) => photos.find((p) => p.id === id))
      .filter((p): p is Photo => p !== undefined);

    return { pinnedPhotos };
  } catch {
    return { pinnedPhotos: [] };
  }
};
