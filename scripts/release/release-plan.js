import { selectChangedPackages, sortPackagesForPublishing } from './package-selection.js';

/**
 * @typedef {object} Package
 * @property {string} name
 * @property {string} path
 * @property {string[]} [dependencies]
 */

/**
 * @param {{ changedFiles: string[]; packages: Package[]; releaseMode?: 'all' }} options
 * @returns {{ packageNames: string[] }}
 */
export const createReleasePlan = ({ changedFiles, packages, releaseMode }) => {
  const selectedPackageNames = selectChangedPackages({ changedFiles, packages, releaseMode });

  return {
    packageNames: sortPackagesForPublishing({ packages, selectedPackageNames }),
  };
};

/**
 * @param {{ releaseTag: string; runGit: (arguments_: string[]) => string }} options
 * @returns {string}
 */
export const findPreviousTag = ({ releaseTag, runGit }) =>
  runGit(['describe', '--tags', '--abbrev=0', `${releaseTag}^`]).trim();

/**
 * @param {{ previousTag: string; releaseTag: string; runGit: (arguments_: string[]) => string }} options
 * @returns {string[]}
 */
export const getChangedFiles = ({ previousTag, releaseTag, runGit }) =>
  runGit(['diff', '--name-only', `${previousTag}..${releaseTag}`])
    .trim()
    .split('\n')
    .filter(Boolean);
