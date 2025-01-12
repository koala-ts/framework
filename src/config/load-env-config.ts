import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';

function loadEnvConfig(env: string): void {
    const rootDir = process.cwd();

    const loadFile = (fileName: string) => {
        dotenvExpand.expand(dotenv.config({ path: path.resolve(rootDir, fileName), override: true }));
    };

    loadFile('.env');
    if (env !== 'test') loadFile('.env.local');
    loadFile(`.env.${env}`);
    loadFile(`.env.${env}.local`);
}

export { loadEnvConfig };
