import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@Tests': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        '**/playground/**',
        '**/tests/**',
        '**/types.ts',
        '**/index.ts',
      ],
    },
  },
});
