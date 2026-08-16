import { defineConfig } from 'vitest/config';

// Jasmine implicitly restores every spyOn'd method after each spec; vitest does
// not, so spies on shared globals (document, window.MutationObserver, ...) leak
// across tests and files. restoreMocks replicates jasmine's per-spec restoration
// suite-wide. Only options the Angular unit-test builder does not manage belong
// in this file.
export default defineConfig({
    test: {
        restoreMocks: true
    }
});
