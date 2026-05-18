// src/routes/+page.ts
import type { PageLoad } from './$types';

const MANIFEST_URL = 'https://public.ininicho.com/gallery/manifest.json';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) return { pinnedPhotos: [] };
    const data = await res.json();

    const pinned: string[] = data.pinned ?? [];
    const photos: Record<string, unknown>[] = data.photos ?? [];

    const pinnedPhotos = pinned
      .map((id) => photos.find((p) => p.id === id))
      .filter(Boolean);

    return { pinnedPhotos };
  } catch {
    return { pinnedPhotos: [] };
  }
};
