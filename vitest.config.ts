import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

type PackageManifest = {
  imports?: Record<string, unknown>;
};

const packagesDirectory = path.resolve(__dirname, './src/packages');

const packageAliases = Object.fromEntries(
  readdirSync(packagesDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .flatMap(entry => {
      const packageDirectory = path.join(packagesDirectory, entry.name);
      const manifestPath = path.join(packageDirectory, 'package.json');

      if (!existsSync(manifestPath)) {
        return [];
      }

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as PackageManifest;

      return Object.keys(manifest.imports ?? {})
        .filter(specifier => specifier.endsWith('/*'))
        .map(specifier => [specifier.slice(0, -2), packageDirectory] as const);
    }),
);

export default defineConfig({
  resolve: {
    alias: {
      '#koala': path.resolve(__dirname, './src'),
      ...packageAliases,
    },
  },
  test: {
    exclude: [...configDefaults.exclude, 'dist/**'],
    coverage: {
      exclude: ['**/dist/**', '**/playground/**', '**/scripts/**', '**/tests/**', '**/types.*', '**/index.*'],
    },
  },
});
