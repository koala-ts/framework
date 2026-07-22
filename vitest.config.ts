import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

type PackageManifest = {
  name?: string;
  exports?: Record<string, unknown>;
  imports?: Record<string, unknown>;
};

type PackageExport = Readonly<{
  types: string;
}>;

const isPackageExport = (value: unknown): value is PackageExport =>
  typeof value === 'object' && value !== null && 'types' in value && typeof value.types === 'string';

const sourcePathFromTypesPath = (typesPath: string): string =>
  typesPath.replace('./dist/', './').replace('.d.ts', '.ts');

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

      const internalAliases = Object.keys(manifest.imports ?? {})
        .filter(specifier => specifier.endsWith('/*'))
        .map(specifier => [specifier.slice(0, -2), packageDirectory] as const);

      const publicAliases = Object.entries(manifest.exports ?? {})
        .filter(
          (entry): entry is [string, PackageExport] =>
            manifest.name !== undefined && entry[0].startsWith('./') && isPackageExport(entry[1]),
        )
        .map(
          ([specifier, target]) =>
            [
              `${manifest.name}/${specifier.slice(2)}`,
              path.resolve(packageDirectory, sourcePathFromTypesPath(target.types)),
            ] as const,
        );

      return [...internalAliases, ...publicAliases];
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
