import { selectChangedPackages, sortPackagesForPublishing } from './package-selection.js';

/**
 * @typedef {object} Package
 * @property {string} name
 * @property {string} path
 * @property {string[]} [dependencies]
 */

/**
 * @param {{ changedFiles: string[]; packages: Package[]; releaseMode?: 'all'; unpublishedPackageNames?: string[] }} options
 * @returns {{ packageNames: string[] }}
 */
export const createReleasePlan = ({ changedFiles, packages, releaseMode, unpublishedPackageNames = [] }) => {
  const selectedPackageNames = [
    ...new Set([...selectChangedPackages({ changedFiles, packages, releaseMode }), ...unpublishedPackageNames]),
  ];

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

/**
 * @param {{ packages: Package[]; getPublishedVersion: (packageName: string) => string | undefined }} options
 * @returns {string[]}
 */
export const getUnpublishedPackageNames = ({ packages, getPublishedVersion }) =>
  packages.filter(({ name }) => !getPublishedVersion(name)).map(({ name }) => name);
