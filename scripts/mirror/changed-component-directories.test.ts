import { describe, expect, it } from 'vitest';

import { getChangedComponentDirectories } from './changed-component-directories.ts';

describe('changed component directories', () => {
  it('returns each changed component directory once', () => {
    const changedFiles = [
      'src/packages/contracts/index.ts',
      'src/packages/contracts/package.json',
      'src/packages/validation/index.ts',
      'src/index.ts',
    ];

    const componentDirectories = getChangedComponentDirectories({ changedFiles });

    expect(componentDirectories).toEqual(['src/packages/contracts', 'src/packages/validation']);
  });
});
