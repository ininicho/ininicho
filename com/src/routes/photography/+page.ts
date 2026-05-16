// src/routes/photography/+page.ts
import { PHOTOS } from '$lib/content';
import type { PageLoad } from './$types';

/**
 * R2 seam: replace the PHOTOS import below with a fetch() call to your
 * R2-backed API endpoint. The page component receives the same `photos`
 * shape regardless of source.
 */
export const load: PageLoad = () => {
  return { photos: PHOTOS };
};
