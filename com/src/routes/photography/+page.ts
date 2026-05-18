// src/routes/photography/+page.ts
import type { PageLoad } from './$types';

const MANIFEST_URL = 'https://public.ininicho.com/gallery/manifest.json';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) return { photos: [] };
    const data = await res.json();
    return { photos: data.photos ?? [] };
  } catch {
    return { photos: [] };
  }
};
