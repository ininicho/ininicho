// Separate from vite.config.ts — Vitest cannot load the sveltekit() and
// tailwindcss() plugins on Node 18 (they pull in undici which needs Node 20+).
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
});
