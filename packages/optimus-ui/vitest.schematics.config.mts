import { defineConfig } from 'vitest/config';

// The schematics suite runs under plain vitest (see the test:schematics script),
// not the Angular unit-test builder that drives vitest.config.mts, so it has to
// declare its own include and environment.
export default defineConfig({
    test: {
        include: ['schematics/**/*.spec.ts'],
        environment: 'node'
    }
});
