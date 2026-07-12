import { describe, expect, it } from 'vitest';

import { type Package, selectChangedPackages, sortPackagesForPublishing } from './package-selection.ts';

describe('release package selection', () => {
  it('includes the component whose source changed', () => {
    const packages: Package[] = [
      { name: '@koala-ts/framework', path: '.' },
      { name: '@koala-ts/contracts', path: 'src/packages/contracts' },
    ];

    const selectedPackages = selectChangedPackages({ changedFiles: ['src/packages/contracts/index.ts'], packages });

    expect(selectedPackages).toEqual(['@koala-ts/contracts']);
  });

  it('includes the framework when framework source changed', () => {
    const packages: Package[] = [
      { name: '@koala-ts/framework', path: '.' },
      { name: '@koala-ts/contracts', path: 'src/packages/contracts' },
    ];

    const selectedPackages = selectChangedPackages({
      changedFiles: ['src/application/create-application.ts'],
      packages,
    });

    expect(selectedPackages).toEqual(['@koala-ts/framework']);
  });

  it('includes every package in a full release', () => {
    const packages: Package[] = [
      { name: '@koala-ts/framework', path: '.' },
      { name: '@koala-ts/contracts', path: 'src/packages/contracts' },
    ];

    const selectedPackages = selectChangedPackages({ changedFiles: [], packages, releaseMode: 'all' });

    expect(selectedPackages).toEqual(['@koala-ts/framework', '@koala-ts/contracts']);
  });

  it('publishes a dependency before its dependent', () => {
    const packages: Package[] = [
      { name: '@koala-ts/framework', path: '.', dependencies: ['@koala-ts/contracts'] },
      { name: '@koala-ts/contracts', path: 'src/packages/contracts' },
    ];

    const orderedPackages = sortPackagesForPublishing({
      packages,
      selectedPackageNames: ['@koala-ts/framework', '@koala-ts/contracts'],
    });

    expect(orderedPackages).toEqual(['@koala-ts/contracts', '@koala-ts/framework']);
  });

  it('rejects packages with a circular dependency', () => {
    const packages: Package[] = [
      { name: '@koala-ts/framework', path: '.', dependencies: ['@koala-ts/contracts'] },
      { name: '@koala-ts/contracts', path: 'src/packages/contracts', dependencies: ['@koala-ts/framework'] },
    ];

    const sortPackages = () =>
      sortPackagesForPublishing({ packages, selectedPackageNames: packages.map(({ name }) => name) });

    expect(sortPackages).toThrow('Selected packages contain a dependency cycle.');
  });
});
