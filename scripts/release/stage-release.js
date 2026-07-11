import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { stagePackageManifests } from './release-staging.js';

const [releaseTag, releasePlanPath] = process.argv.slice(2);

if (!releaseTag || !releasePlanPath) {
  throw new Error('A release tag and release plan path are required.');
}

const releasePlan = JSON.parse(readFileSync(releasePlanPath, 'utf8'));
const packageRecords = [readPackageRecord('.'), ...readWorkspacePackageRecords()];
const selectedPackageNames = releasePlan.packageNames;
const publishedVersions = getPublishedVersions({ packageRecords, selectedPackageNames });
const stagedManifests = stagePackageManifests({
  manifests: packageRecords.map(({ manifest }) => manifest),
  publishedVersions,
  selectedPackageNames,
  version: releaseTag,
});

for (const packageRecord of packageRecords) {
  if (!selectedPackageNames.includes(packageRecord.manifest.name)) {
    continue;
  }

  const stagedManifest = stagedManifests.find(({ name }) => name === packageRecord.manifest.name);
  writeFileSync(packageRecord.manifestPath, `${JSON.stringify(stagedManifest, null, 2)}\n`);
}

function readWorkspacePackageRecords() {
  return readdirSync('src/packages', { withFileTypes: true })
    .filter(directoryEntry => directoryEntry.isDirectory())
    .map(directoryEntry => readPackageRecord(join('src/packages', directoryEntry.name)));
}

function readPackageRecord(path) {
  const manifestPath = path === '.' ? 'package.json' : join(path, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  return { manifest, manifestPath };
}

function getPublishedVersions({ packageRecords, selectedPackageNames }) {
  const unchangedDependencies = packageRecords
    .filter(({ manifest }) => selectedPackageNames.includes(manifest.name))
    .flatMap(({ manifest }) => Object.keys(manifest.dependencies ?? {}))
    .filter(dependency => dependency.startsWith('@koala-ts/') && !selectedPackageNames.includes(dependency));

  return Object.fromEntries(
    [...new Set(unchangedDependencies)].map(dependency => [
      dependency,
      execFileSync('npm', ['view', dependency, 'version'], { encoding: 'utf8' }).trim(),
    ]),
  );
}
