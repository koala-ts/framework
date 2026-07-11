/**
 * @typedef {object} Package
 * @property {string} name
 * @property {string} path
 * @property {string[]} [dependencies]
 */

/**
 * @param {{ changedFiles: string[]; packages: Package[]; releaseMode?: 'all' }} options
 * @returns {string[]}
 */
export const selectChangedPackages = ({ changedFiles, packages, releaseMode }) => {
  if (releaseMode === 'all') {
    return packages.map(({ name }) => name);
  }

  return packages
    .filter(packageDefinition => changedFiles.some(changedFile => belongsToPackage({ changedFile, packageDefinition })))
    .map(({ name }) => name);
};

/**
 * @param {{ changedFile: string; packageDefinition: Package }} options
 * @returns {boolean}
 */
const belongsToPackage = ({ changedFile, packageDefinition }) => {
  if (packageDefinition.path === '.') {
    return !changedFile.startsWith('src/packages/');
  }

  return changedFile === packageDefinition.path || changedFile.startsWith(`${packageDefinition.path}/`);
};

/**
 * @param {{ packages: Package[]; selectedPackageNames: string[] }} options
 * @returns {string[]}
 */
export const sortPackagesForPublishing = ({ packages, selectedPackageNames }) => {
  const selectedPackages = packages.filter(({ name }) => selectedPackageNames.includes(name));
  const remainingPackages = new Map(
    selectedPackages.map(packageDefinition => [packageDefinition.name, packageDefinition]),
  );
  const orderedPackages = [];

  while (remainingPackages.size > 0) {
    const publishablePackage = [...remainingPackages.values()].find(({ dependencies = [] }) =>
      dependencies.every(dependency => !remainingPackages.has(dependency)),
    );

    if (!publishablePackage) {
      throw new Error('Selected packages contain a dependency cycle.');
    }

    orderedPackages.push(publishablePackage.name);
    remainingPackages.delete(publishablePackage.name);
  }

  return orderedPackages;
};
