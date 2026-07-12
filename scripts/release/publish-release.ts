import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [releaseTag, releasePlanPath] = process.argv.slice(2);

if (releaseTag && releasePlanPath) {
  const { packageNames } = JSON.parse(readFileSync(releasePlanPath, 'utf8'));
  const packageNamesToPublish = selectPackagesToPublish({
    getPublishedVersion,
    packageNames,
    releaseTag,
  });

  for (const packageName of packageNamesToPublish) {
    publishPackage(packageName);
  }

  const skippedPackageNames = packageNames.filter(packageName => !packageNamesToPublish.includes(packageName));
  process.stdout.write(`Published packages: ${packageNamesToPublish.join(', ') || 'none'}\n`);
  process.stdout.write(`Skipped packages: ${skippedPackageNames.join(', ') || 'none'}\n`);
}

/**
 * @param {{
 *   packageNames: string[];
 *   releaseTag: string;
 *   getPublishedVersion: (packageName: string) => string | undefined;
 * }} options
 * @returns {string[]}
 */
export function selectPackagesToPublish({ getPublishedVersion, packageNames, releaseTag }) {
  return packageNames.filter(packageName => {
    const publishedVersion = getPublishedVersion(packageName);

    if (!publishedVersion) {
      return true;
    }

    if (publishedVersion === releaseTag) {
      return false;
    }

    throw new Error(`${packageName} is already published as ${publishedVersion}.`);
  });
}

function getPublishedVersion(packageName) {
  try {
    return execFileSync('npm', ['view', `${packageName}@${releaseTag}`, 'version'], { encoding: 'utf8' }).trim();
  } catch (error) {
    if (error.status === 1 && error.stderr.includes('E404')) {
      return undefined;
    }

    throw error;
  }
}

function publishPackage(packageName) {
  const arguments_ = ['publish', '--provenance', '--access', 'public'];

  if (packageName !== '@koala-ts/framework') {
    arguments_.push(`--workspace=${packageName}`);
  }

  execFileSync('npm', arguments_, { stdio: 'inherit' });
}
