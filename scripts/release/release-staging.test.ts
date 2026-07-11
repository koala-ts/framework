import { describe, expect, it } from 'vitest';

import { type PackageManifest, stagePackageManifests } from './release-staging.js';

describe('release staging', () => {
  it('applies the release version to selected packages', () => {
    const manifests: PackageManifest[] = [{ name: '@koala-ts/contracts', version: '2.0.0' }];

    const stagedManifests = stagePackageManifests({
      manifests,
      selectedPackageNames: ['@koala-ts/contracts'],
      version: '2.18.1',
    });

    expect(stagedManifests).toEqual([{ name: '@koala-ts/contracts', version: '2.18.1' }]);
  });

  it('uses the release version for selected internal dependencies', () => {
    const manifests: PackageManifest[] = [
      { name: '@koala-ts/contracts', version: '2.0.0' },
      { name: '@koala-ts/framework', version: '2.0.0', dependencies: { '@koala-ts/contracts': '*' } },
    ];

    const stagedManifests = stagePackageManifests({
      manifests,
      selectedPackageNames: ['@koala-ts/contracts', '@koala-ts/framework'],
      version: '2.18.1',
    });

    expect(stagedManifests[1]).toEqual({
      name: '@koala-ts/framework',
      version: '2.18.1',
      dependencies: { '@koala-ts/contracts': '^2.18.1' },
    });
  });

  it('uses the installed version for an unchanged internal dependency', () => {
    const manifests: PackageManifest[] = [
      { name: '@koala-ts/contracts', version: '2.0.0' },
      { name: '@koala-ts/framework', version: '2.0.0', dependencies: { '@koala-ts/contracts': '*' } },
    ];

    const stagedManifests = stagePackageManifests({
      manifests,
      selectedPackageNames: ['@koala-ts/framework'],
      publishedVersions: { '@koala-ts/contracts': '2.17.0' },
      version: '2.18.1',
    });

    expect(stagedManifests[1]).toEqual({
      name: '@koala-ts/framework',
      version: '2.18.1',
      dependencies: { '@koala-ts/contracts': '^2.17.0' },
    });
  });
});
