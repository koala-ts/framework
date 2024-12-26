import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            exclude: [
                ...configDefaults.exclude,
                '**/playground/**',
                '**/tests/**',
                '**/types.ts',
            ],
        },
    },
});
