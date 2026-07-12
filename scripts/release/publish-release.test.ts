import { describe, expect, it } from 'vitest';

import { selectPackagesToPublish } from './publish-release.ts';

describe('release publishing', () => {
  it('selects the root package and every selected component that is not published at the release version', () => {
    const packageNames = ['@koala-ts/contracts', '@koala-ts/framework'];
    const getPublishedVersion = () => undefined;

    const packageNamesToPublish = selectPackagesToPublish({
      getPublishedVersion,
      packageNames,
      releaseTag: '2.28.7',
    });

    expect(packageNamesToPublish).toEqual(['@koala-ts/contracts', '@koala-ts/framework']);
  });

  it('skips a package already published at the release version', () => {
    const packageNames = ['@koala-ts/contracts', '@koala-ts/framework'];
    const getPublishedVersion = (packageName: string) => (packageName === '@koala-ts/contracts' ? '2.28.7' : undefined);

    const packageNamesToPublish = selectPackagesToPublish({
      getPublishedVersion,
      packageNames,
      releaseTag: '2.28.7',
    });

    expect(packageNamesToPublish).toEqual(['@koala-ts/framework']);
  });

  it('rejects a package with an unexpected published version', () => {
    const packageNames = ['@koala-ts/contracts'];
    const getPublishedVersion = () => '2.28.6';

    const selectPackages = () => selectPackagesToPublish({ getPublishedVersion, packageNames, releaseTag: '2.28.7' });

    expect(selectPackages).toThrow('@koala-ts/contracts is already published as 2.28.6.');
  });
});
