import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['store/**/*.test.ts', 'components/**/*.test.tsx', 'app/**/*.test.ts'],
    pool: 'forks',
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './'),
    },
  },
});
