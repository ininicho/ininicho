import { describe, it, expect } from 'vitest';
import { filterPhotos, photoColumns, paginatePhotos } from '$lib/utils/photos';
import type { Photo } from '$lib/content';

const mock: Photo[] = [
  { id: '001', caption: 'A', place: 'Kensington', date: '01·25', ratio: '4/5', tags: ['Toronto'] },
  { id: '002', caption: 'B', place: 'Montreal',   date: '02·25', ratio: '3/4', tags: ['Travel'] },
  { id: '003', caption: 'C', place: 'Kensington', date: '03·25', ratio: '1/1', tags: ['Toronto', 'Film'] },
  { id: '004', caption: 'D', place: 'Vancouver',  date: '04·25', ratio: '4/3', tags: ['Travel', 'Film'] },
  { id: '005', caption: 'E', place: 'Annex',      date: '05·25', ratio: '4/5', tags: ['Toronto', 'Digital'] },
];

describe('filterPhotos', () => {
  it('returns all photos when filter is "All"', () => {
    expect(filterPhotos(mock, 'All')).toHaveLength(5);
  });

  it('filters by a single tag', () => {
    const result = filterPhotos(mock, 'Toronto');
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.tags.includes('Toronto'))).toBe(true);
  });

  it('returns photos that have the tag among multiple tags', () => {
    expect(filterPhotos(mock, 'Film')).toHaveLength(2);
  });

  it('returns empty array when no photos match', () => {
    expect(filterPhotos(mock, 'Street')).toHaveLength(0);
  });
});

describe('paginatePhotos', () => {
  it('slices to visible count', () => {
    expect(paginatePhotos(mock, 3)).toHaveLength(3);
  });

  it('returns all when visible >= length', () => {
    expect(paginatePhotos(mock, 100)).toHaveLength(5);
  });
});

describe('photoColumns', () => {
  it('distributes photos across N columns in stripe order', () => {
    const cols = photoColumns(mock, 3);
    expect(cols).toHaveLength(3);
    expect(cols[0][0].id).toBe('001');
    expect(cols[1][0].id).toBe('002');
    expect(cols[2][0].id).toBe('003');
    expect(cols[0][1].id).toBe('004');
    expect(cols[1][1].id).toBe('005');
  });

  it('handles fewer photos than columns', () => {
    const cols = photoColumns(mock.slice(0, 2), 3);
    expect(cols[0]).toHaveLength(1);
    expect(cols[1]).toHaveLength(1);
    expect(cols[2]).toHaveLength(0);
  });
});
