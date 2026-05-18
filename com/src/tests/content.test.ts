// src/tests/content.test.ts
import { describe, it, expect } from 'vitest';
import {
  IDENTITY,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  SKILLS,
  PHOTOS,
  SITE_META,
} from '$lib/content';

describe('IDENTITY', () => {
  it('has all required fields', () => {
    expect(IDENTITY.name).toBeTruthy();
    expect(IDENTITY.email).toBeTruthy();
    expect(IDENTITY.github).toBeTruthy();
    expect(IDENTITY.linkedin).toBeTruthy();
    expect(IDENTITY.location).toBeTruthy();
    expect(IDENTITY.role).toBeTruthy();
    expect(IDENTITY.org).toBeTruthy();
    expect(IDENTITY.updated).toBeTruthy();
  });
});

describe('PROJECTS', () => {
  it('is non-empty', () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });
  it('each project has required fields', () => {
    for (const p of PROJECTS) {
      expect(p.no).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.client).toBeTruthy();
      expect(p.year).toBeTruthy();
      expect(p.blurb).toBeTruthy();
      expect(Array.isArray(p.tags)).toBe(true);
    }
  });
});

describe('EXPERIENCE', () => {
  it('is non-empty', () => {
    expect(EXPERIENCE.length).toBeGreaterThan(0);
  });
  it('each entry has bullets and stack', () => {
    for (const e of EXPERIENCE) {
      expect(e.bullets.length).toBeGreaterThan(0);
      expect(e.stack.length).toBeGreaterThan(0);
    }
  });
});

describe('SKILLS', () => {
  it('has at least 4 groups', () => {
    expect(SKILLS.length).toBeGreaterThanOrEqual(4);
  });
  it('each group has items', () => {
    for (const s of SKILLS) {
      expect(s.items.length).toBeGreaterThan(0);
    }
  });
});

describe('PHOTOS', () => {
  it('is non-empty', () => {
    expect(PHOTOS.length).toBeGreaterThan(0);
  });
  it('each photo has a valid ratio', () => {
    const validRatios = ['4/5', '3/4', '1/1', '4/3'];
    for (const p of PHOTOS) {
      expect(validRatios).toContain(p.ratio);
    }
  });
  it('each photo has a unique id', () => {
    const ids = PHOTOS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('SITE_META', () => {
  it('has version and updatedLabel', () => {
    expect(SITE_META.version).toBeTruthy();
    expect(SITE_META.updatedLabel).toBeTruthy();
  });
});
