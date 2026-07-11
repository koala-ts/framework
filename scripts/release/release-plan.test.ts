import { describe, expect, it } from 'vitest';

import {
  createReleasePlan,
  findPreviousTag,
  getChangedFiles,
  getUnpublishedPackageNames,
  type Package,
} from './release-plan.js';

describe('release plan', () => {
  it('uses the tag before the release tag as the comparison point', () => {
    const calls: string[][] = [];
    const runGit = (arguments_: string[]) => {
      calls.push(arguments_);
      return '2.18.1\n';
    };

    const previousTag = findPreviousTag({ releaseTag: '2.19.0', runGit });

    expect(previousTag).toBe('2.18.1');
    expect(calls).toEqual([['describe', '--tags', '--abbrev=0', '2.19.0^']]);
  });

  it('lists the files changed since the previous tag', () => {
    const runGit = () => 'src/packages/contracts/index.ts\nsrc/index.ts\n';

    const changedFiles = getChangedFiles({ previousTag: '2.18.1', releaseTag: '2.19.0', runGit });

    expect(changedFiles).toEqual(['src/packages/contracts/index.ts', 'src/index.ts']);
  });

  it('creates a dependency-ordered release plan', () => {
    const packages: Package[] = [
      { name: '@koala-ts/framework', path: '.', dependencies: ['@koala-ts/contracts'] },
      { name: '@koala-ts/contracts', path: 'src/packages/contracts' },
    ];

    const releasePlan = createReleasePlan({
      changedFiles: ['package.json', 'src/packages/contracts/index.ts'],
      packages,
    });

    expect(releasePlan).toEqual({ packageNames: ['@koala-ts/contracts', '@koala-ts/framework'] });
  });

  it('includes a package that has not been published', () => {
    const packages: Package[] = [
      { name: '@koala-ts/framework', path: '.' },
      { name: '@koala-ts/contracts', path: 'src/packages/contracts' },
    ];
    const getPublishedVersion = (packageName: string) => (packageName === '@koala-ts/contracts' ? undefined : '2.18.1');

    const unpublishedPackageNames = getUnpublishedPackageNames({ getPublishedVersion, packages });

    expect(unpublishedPackageNames).toEqual(['@koala-ts/contracts']);
    expect(createReleasePlan({ changedFiles: [], packages, unpublishedPackageNames })).toEqual({
      packageNames: ['@koala-ts/contracts'],
    });
  });
});
