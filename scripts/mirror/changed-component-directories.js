import { execFileSync } from 'node:child_process';

const [previousCommit, currentCommit] = process.argv.slice(2);

if (previousCommit && currentCommit) {
  const changedFiles = execFileSync('git', ['diff', '--name-only', previousCommit, currentCommit], {
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean);

  process.stdout.write(`${getChangedComponentDirectories({ changedFiles }).join('\n')}\n`);
}

/**
 * @param {{ changedFiles: string[] }} options
 * @returns {string[]}
 */
export function getChangedComponentDirectories({ changedFiles }) {
  return [...new Set(changedFiles.map(getComponentDirectory).filter(Boolean))].sort();
}

function getComponentDirectory(changedFile) {
  const [sourceDirectory, packagesDirectory, componentDirectory] = changedFile.split('/');

  if (sourceDirectory !== 'src' || packagesDirectory !== 'packages' || !componentDirectory) {
    return undefined;
  }

  return `src/packages/${componentDirectory}`;
}
