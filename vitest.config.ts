import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@Tests': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, 'dist/**'],
    coverage: {
      exclude: ['**/dist/**', '**/playground/**', '**/tests/**', '**/types.*', '**/index.*'],
    },
  },
});
