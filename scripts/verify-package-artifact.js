import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const packagePath = process.argv[2];

if (!packagePath) {
  throw new Error('A package path is required.');
}

const packageDirectory = resolve(packagePath);
const { name: packageName } = JSON.parse(readFileSync(join(packageDirectory, 'package.json'), 'utf8'));
const packageDetails = JSON.parse(execFileSync('npm', ['pack', '--json'], { cwd: packageDirectory, encoding: 'utf8' }));
const packageTarball = resolve(packageDirectory, packageDetails[0].filename);
const consumerDirectory = mkdtempSync(join(tmpdir(), 'koala-ts-package-consumer-'));

try {
  execFileSync('npm', ['install', '--ignore-scripts', '--no-package-lock', packageTarball], {
    cwd: consumerDirectory,
    stdio: 'inherit',
  });
  execFileSync(process.execPath, ['--input-type=module', '--eval', 'await import(process.argv[1]);', packageName], {
    cwd: consumerDirectory,
    stdio: 'inherit',
  });
} finally {
  rmSync(packageTarball, { force: true });
  rmSync(consumerDirectory, { force: true, recursive: true });
}
