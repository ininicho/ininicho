// src/routes/photography/+page.ts
import type { PageLoad } from './$types';

const MANIFEST_URL = 'https://public.ininicho.com/gallery/manifest.json';

/** Parse "YY/MM/DD" → sortable integer YYMMDD (e.g. "25/05/15" → 250515). Empty → 0. */
function dateKey(date: string): number {
  if (!date) return 0;
  const [yy, mm, dd] = date.split('/');
  const key = parseInt(`${yy}${mm}${dd}`, 10);
  return isNaN(key) ? 0 : key;
}

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) return { photos: [] };
    const data = await res.json();
    const photos = (data.photos ?? []).slice();
    photos.sort((a: { date: string }, b: { date: string }) => dateKey(b.date) - dateKey(a.date));
    return { photos };
  } catch {
    return { photos: [] };
  }
};
