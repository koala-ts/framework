import path from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export function loadEnvConfig(env: string): void {
  const rootDir = process.cwd();

  resolveEnvFileNames(env).forEach(fileName => {
    loadEnvFile(path.resolve(rootDir, fileName), resolveDotenvOptions());
  });
}

function resolveEnvFileNames(env: string): string[] {
  if (env === 'test') {
    return ['.env', `.env.${env}`, `.env.${env}.local`];
  }

  return ['.env', '.env.local', `.env.${env}`, `.env.${env}.local`];
}

function resolveDotenvOptions(): { override: true; quiet: true } {
  return {
    override: true,
    quiet: true,
  };
}

function loadEnvFile(filePath: string, options: { override: true; quiet: true }): void {
  const expandedOptions = dotenv.config({ path: filePath, ...options });

  dotenvExpand.expand(expandedOptions);
}
