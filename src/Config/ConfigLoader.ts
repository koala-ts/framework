import path from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export function loadEnvConfig(env: string): void {
  loadEnvFile('.env');

  if (env !== 'test') loadEnvFile('.env.local');

  loadEnvFile(`.env.${env}`);
  loadEnvFile(`.env.${env}.local`);
}

function loadEnvFile(fileName: string): void {
  const rootDir = process.cwd();

  const expandedOptions = dotenv.config({
    path: path.resolve(rootDir, fileName),
    override: true,
  });

  dotenvExpand.expand(expandedOptions);
}
