import type { Photo } from '$lib/content';

/** Returns all photos if filter is 'All', otherwise filters by tag membership. */
export function filterPhotos(photos: Photo[], filter: string): Photo[] {
  if (filter === 'All') return photos;
  return photos.filter((p) => p.tags.includes(filter));
}

/** Returns the first `visible` photos. */
export function paginatePhotos(photos: Photo[], visible: number): Photo[] {
  return photos.slice(0, visible);
}

/**
 * Stripes photos across `cols` columns for a masonry-ish layout.
 * photo[0] → col[0], photo[1] → col[1], …, photo[cols] → col[0], …
 */
export function photoColumns(photos: Photo[], cols: number): Photo[][] {
  const columns: Photo[][] = Array.from({ length: cols }, () => []);
  photos.forEach((p, i) => columns[i % cols].push(p));
  return columns;
}
