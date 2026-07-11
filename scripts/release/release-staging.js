/**
 * @typedef {object} PackageManifest
 * @property {string} name
 * @property {string} version
 * @property {Record<string, string>} [dependencies]
 */

/**
 * @param {{
 *   manifests: PackageManifest[];
 *   selectedPackageNames: string[];
 *   publishedVersions?: Record<string, string>;
 *   version: string;
 * }} options
 * @returns {PackageManifest[]}
 */
export const stagePackageManifests = ({ manifests, selectedPackageNames, publishedVersions = {}, version }) =>
  manifests.map(manifest => {
    if (!selectedPackageNames.includes(manifest.name)) {
      return manifest;
    }

    const dependencies = stageDependencies({
      dependencies: manifest.dependencies,
      publishedVersions,
      selectedPackageNames,
      version,
    });

    return {
      ...manifest,
      version,
      ...(dependencies ? { dependencies } : {}),
    };
  });

/**
 * @param {{
 *   dependencies?: Record<string, string>;
 *   publishedVersions: Record<string, string>;
 *   selectedPackageNames: string[];
 *   version: string;
 * }} options
 * @returns {Record<string, string> | undefined}
 */
const stageDependencies = ({ dependencies, publishedVersions, selectedPackageNames, version }) => {
  if (!dependencies) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(dependencies).map(([dependency, dependencyVersion]) => {
      if (!dependency.startsWith('@koala-ts/')) {
        return [dependency, dependencyVersion];
      }

      if (selectedPackageNames.includes(dependency)) {
        return [dependency, `^${version}`];
      }

      const publishedVersion = publishedVersions[dependency];

      if (!publishedVersion) {
        throw new Error(`No published version is available for ${dependency}.`);
      }

      return [dependency, `^${publishedVersion}`];
    }),
  );
};
