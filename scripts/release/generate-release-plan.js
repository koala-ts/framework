import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createReleasePlan, findPreviousTag, getChangedFiles } from './release-plan.js';

const releaseTag = process.argv[2];

if (!releaseTag) {
  throw new Error('A release tag is required.');
}

const runGit = arguments_ => execFileSync('git', arguments_, { encoding: 'utf8' });
const previousTag = findPreviousTag({ releaseTag, runGit });
const changedFiles = getChangedFiles({ previousTag, releaseTag, runGit });
const packageDefinitions = [readPackageDefinition('.'), ...readWorkspacePackageDefinitions()];
const releaseMode = process.env.RELEASE_MODE === 'all' ? 'all' : undefined;
const releasePlan = createReleasePlan({ changedFiles, packages: packageDefinitions, releaseMode });

process.stdout.write(`${JSON.stringify({ previousTag, ...releasePlan })}\n`);

function readWorkspacePackageDefinitions() {
  return readdirSync('src/packages', { withFileTypes: true })
    .filter(directoryEntry => directoryEntry.isDirectory())
    .map(directoryEntry => readPackageDefinition(join('src/packages', directoryEntry.name)));
}

function readPackageDefinition(path) {
  const manifestPath = path === '.' ? 'package.json' : join(path, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const dependencies = Object.keys(manifest.dependencies ?? {}).filter(dependency =>
    dependency.startsWith('@koala-ts/'),
  );

  return { name: manifest.name, path, dependencies };
}
