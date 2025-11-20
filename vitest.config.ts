import path from 'path';
import { defineConfig } from 'vitest/config';

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
        '**/playground/**',
        '**/tests/**',
        '**/types.*',
        '**/index.*',
      ],
    },
  },
});
