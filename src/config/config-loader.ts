import path from 'node:path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import type { KoalaDotenvOptions } from './koala-config';

export function loadEnvConfig(env: string, dotenvOptions?: KoalaDotenvOptions): void {
  const rootDir = process.cwd();

  resolveEnvFileNames(env).forEach(fileName => {
    loadEnvFile(path.resolve(rootDir, fileName), resolveDotenvOptions(dotenvOptions));
  });
}

function resolveEnvFileNames(env: string): string[] {
  if (env === 'test') {
    return ['.env', `.env.${env}`, `.env.${env}.local`];
  }

  return ['.env', '.env.local', `.env.${env}`, `.env.${env}.local`];
}

function resolveDotenvOptions(dotenvOptions?: KoalaDotenvOptions): KoalaDotenvOptions {
  return {
    override: true,
    quiet: true,
    ...dotenvOptions,
  };
}

function loadEnvFile(filePath: string, options: KoalaDotenvOptions): void {
  const expandedOptions = dotenv.config({ path: filePath, ...options });

  dotenvExpand.expand(expandedOptions);
}
