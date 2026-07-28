import { HostTree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { describe, expect, it } from 'vitest';
import { createIgnoreMatcher } from './gitignore';

function matcher(files: Record<string, string>) {
    const tree = new UnitTestTree(new HostTree());
    for (const [path, content] of Object.entries(files)) {
        tree.create(path, content);
    }
    return createIgnoreMatcher(tree);
}

describe('createIgnoreMatcher', () => {
    it('ignores nothing when the workspace has no .gitignore', () => {
        expect(matcher({ '/src/main.ts': '' })('/src/main.ts')).toBe(false);
    });

    it('skips comments and blank lines', () => {
        const isIgnored = matcher({ '/.gitignore': '# coverage\n\n  \ndist\n' });
        expect(isIgnored('/coverage/index.html')).toBe(false);
        expect(isIgnored('/dist/main.js')).toBe(true);
    });

    it('matches a directory pattern at any depth, including its contents', () => {
        const isIgnored = matcher({ '/.gitignore': 'coverage/\n' });
        expect(isIgnored('/coverage/lcov-report/index.html')).toBe(true);
        expect(isIgnored('/libs/app/coverage/index.html')).toBe(true);
        expect(isIgnored('/src/coverage.ts')).toBe(false);
    });

    it('anchors patterns that contain a separator', () => {
        const isIgnored = matcher({ '/.gitignore': '/dist\nsrc/generated\n' });
        expect(isIgnored('/dist/main.js')).toBe(true);
        expect(isIgnored('/libs/dist/main.js')).toBe(false);
        expect(isIgnored('/src/generated/api.ts')).toBe(true);
        expect(isIgnored('/libs/src/generated/api.ts')).toBe(false);
    });

    it('supports wildcards, globstars and character classes', () => {
        const isIgnored = matcher({ '/.gitignore': '*.log\nsrc/**/*.tmp.ts\nreport-[0-9].json\n' });
        expect(isIgnored('/logs/debug.log')).toBe(true);
        expect(isIgnored('/src/app/a/b.tmp.ts')).toBe(true);
        expect(isIgnored('/src/b.tmp.ts')).toBe(true);
        expect(isIgnored('/report-3.json')).toBe(true);
        expect(isIgnored('/report-ab.json')).toBe(false);
    });

    it('honours negation, but not below an ignored directory', () => {
        const isIgnored = matcher({ '/.gitignore': '*.log\n!keep.log\ncoverage/\n!coverage/keep.ts\n' });
        expect(isIgnored('/debug.log')).toBe(true);
        expect(isIgnored('/keep.log')).toBe(false);
        expect(isIgnored('/coverage/keep.ts')).toBe(true);
    });

    it('lets a nested .gitignore override the one above it', () => {
        const isIgnored = matcher({ '/.gitignore': '*.generated.ts\n', '/libs/app/.gitignore': '!*.generated.ts\n' });
        expect(isIgnored('/src/api.generated.ts')).toBe(true);
        expect(isIgnored('/libs/app/api.generated.ts')).toBe(false);
    });

    it('applies a nested .gitignore only below its own directory', () => {
        const isIgnored = matcher({ '/libs/app/.gitignore': 'build/\n' });
        expect(isIgnored('/libs/app/build/main.js')).toBe(true);
        expect(isIgnored('/build/main.js')).toBe(false);
    });
});
