import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

const run = async (source: string): Promise<string> => {
    const runner = createMigrationRunner();
    const tree = createAppTree({ '/src/app/app.component.ts': source });
    const result = await runner.runSchematic('config-overlay-options-signal', {}, tree);
    return result.readContent('/src/app/app.component.ts');
};

const runWithWarnings = async (files: Record<string, string>): Promise<{ read: (path: string) => string; warnings: string }> => {
    const runner = createMigrationRunner();
    const tree = createAppTree(files);
    const warnings: string[] = [];
    runner.logger.subscribe((entry) => {
        if (entry.level === 'warn') {
            warnings.push(entry.message);
        }
    });
    const result = await runner.runSchematic('config-overlay-options-signal', {}, tree);
    return { read: (path) => result.readContent(path), warnings: warnings.join('\n') };
};

describe('config-overlay-options-signal', () => {
    it('rewrites an assignment on an inject(Optimus) property to .set()', async () => {
        const output = await run(`import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    config = inject(Optimus);

    constructor() {
        this.config.overlayOptions = { mode: 'modal', responsive: { breakpoint: '640px' } };
    }
}
`);
        expect(output).toContain(`this.config.overlayOptions.set({ mode: 'modal', responsive: { breakpoint: '640px' } });`);
        expect(output).not.toContain('overlayOptions = {');
    });

    it('rewrites reads on a constructor parameter typed Optimus to () calls', async () => {
        const output = await run(`import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    constructor(private primeng: Optimus) {}

    mode() {
        const merged = { ...this.primeng.overlayOptions, target: '@parent' };
        return this.primeng.overlayOptions?.mode ?? this.primeng.overlayOptions.responsive?.direction;
    }
}
`);
        expect(output).toContain(`{ ...this.primeng.overlayOptions(), target: '@parent' }`);
        expect(output).toContain(`this.primeng.overlayOptions()?.mode ?? this.primeng.overlayOptions().responsive?.direction`);
    });

    it('handles a local variable and a direct inject(Optimus) chain', async () => {
        const output = await run(`import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export function setup() {
    const optimus: Optimus = inject(Optimus);
    optimus.overlayOptions = { autoZIndex: false };
    return inject(Optimus).overlayOptions.baseZIndex;
}
`);
        expect(output).toContain(`optimus.overlayOptions.set({ autoZIndex: false });`);
        expect(output).toContain(`inject(Optimus).overlayOptions().baseZIndex`);
    });

    it('leaves already-migrated call sites alone', async () => {
        const source = `import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    config = inject(Optimus);

    update() {
        this.config.overlayOptions.set({ mode: 'modal' });
        this.config.overlayOptions.update((options) => ({ ...options, target: '@parent' }));
        return this.config.overlayOptions().mode;
    }
}
`;
        expect(await run(source)).toBe(source);
    });

    it('does not touch overlayOptions on a receiver that is not the Optimus service', async () => {
        const source = `import { viewChild } from '@angular/core';
import { Select } from '@openng/optimus-ui/select';

export class AppComponent {
    select = viewChild.required(Select);
    settings = { overlayOptions: { mode: 'modal' } };

    apply() {
        this.select().overlayOptions = this.settings.overlayOptions;
    }
}
`;
        expect(await run(source)).toBe(source);
    });

    it('reports a config-looking receiver it cannot prove is the service instead of rewriting it', async () => {
        const runner = createMigrationRunner();
        const source = `export class AppComponent {
    constructor(private config: any) {}

    apply() {
        this.config.overlayOptions = { mode: 'modal' };
    }
}
`;
        const tree = createAppTree({ '/src/app/app.component.ts': source });
        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });
        const result = await runner.runSchematic('config-overlay-options-signal', {}, tree);
        expect(result.readContent('/src/app/app.component.ts')).toBe(source);
        expect(warnings.join('\n')).toContain('/src/app/app.component.ts:5');
    });

    it('reports compound assignments for manual review instead of rewriting them', async () => {
        const runner = createMigrationRunner();
        const source = `import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    config = inject(Optimus);

    apply() {
        this.config.overlayOptions ??= {};
    }
}
`;
        const tree = createAppTree({ '/src/app/app.component.ts': source });
        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });
        const result = await runner.runSchematic('config-overlay-options-signal', {}, tree);
        expect(result.readContent('/src/app/app.component.ts')).toBe(source);
        expect(warnings.join('\n')).toContain('/src/app/app.component.ts:8');
    });

    it('rewrites an assignment whose value spreads the current options', async () => {
        const output = await run(`import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    config = inject(Optimus);

    apply() {
        this.config.overlayOptions = { ...this.config.overlayOptions, mode: 'modal' };
        this.config.overlayOptions = this.config.overlayOptions;
    }
}
`);
        expect(output).toContain(`this.config.overlayOptions.set({ ...this.config.overlayOptions(), mode: 'modal' });`);
        expect(output).toContain(`this.config.overlayOptions.set(this.config.overlayOptions());`);
    });

    it('unwraps casts and non-null assertions on the receiver and the inject() initializer', async () => {
        const output = await run(`import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    config = inject(Optimus) as Optimus;

    mode() {
        return (this.config!).overlayOptions?.mode;
    }
}
`);
        expect(output).toContain(`(this.config!).overlayOptions()?.mode`);
    });

    it('reports nested member writes and delete instead of mutating the signal value in place', async () => {
        const source = `import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    config = inject(Optimus);

    apply() {
        this.config.overlayOptions.hideOnEscape = false;
        this.config.overlayOptions.responsive!.direction = 'top';
        delete this.config.overlayOptions.listener;
        const same = (this.config.overlayOptions = {});
    }
}
`;
        const { read, warnings } = await runWithWarnings({ '/src/app/app.component.ts': source });
        expect(read('/src/app/app.component.ts')).toBe(source);
        expect(warnings).toContain('/src/app/app.component.ts:8');
        expect(warnings).toContain('/src/app/app.component.ts:9');
        expect(warnings).toContain('/src/app/app.component.ts:10');
        expect(warnings).toContain('/src/app/app.component.ts:11');
    });

    it('resolves bindings by scope, so a same-named variable elsewhere in the file is left alone', async () => {
        const source = `import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

export class AppComponent {
    config = inject(Optimus);

    mode() {
        return this.config.overlayOptions.mode;
    }
}

export function apply(config: { overlayOptions: object }) {
    config.overlayOptions = {};
}
`;
        const { read, warnings } = await runWithWarnings({ '/src/app/app.component.ts': source });
        const output = read('/src/app/app.component.ts');
        expect(output).toContain(`return this.config.overlayOptions().mode;`);
        expect(output).toContain(`    config.overlayOptions = {};`);
        expect(warnings).toContain('/src/app/app.component.ts:13');
    });

    it('reports template bindings that read the property in .html files and inline templates', async () => {
        const { read, warnings } = await runWithWarnings({
            '/src/app/app.html': `<p-select [overlayOptions]="config.overlayOptions"></p-select>\n<p-select [overlayOptions]="config.overlayOptions()"></p-select>\n`,
            '/src/app/inline.component.ts': `import { Component, inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';

@Component({
    selector: 'app-inline',
    template: \`
        <p-select [overlayOptions]="primeng.overlayOptions"></p-select>
    \`
})
export class InlineComponent {
    primeng = inject(Optimus);
}
`
        });
        expect(read('/src/app/app.html')).toContain(`[overlayOptions]="config.overlayOptions"`);
        expect(warnings).toContain('/src/app/app.html:1');
        expect(warnings).not.toContain('/src/app/app.html:2');
        expect(warnings).toContain('/src/app/inline.component.ts:7');
    });

    it('skips node_modules and dist', async () => {
        const source = `import { inject } from '@angular/core';
import { Optimus } from '@openng/optimus-ui/config';
export const config = inject(Optimus);
config.overlayOptions = {};
`;
        const { read, warnings } = await runWithWarnings({ '/node_modules/lib/index.ts': source, '/dist/app/main.ts': source });
        expect(read('/node_modules/lib/index.ts')).toBe(source);
        expect(read('/dist/app/main.ts')).toBe(source);
        expect(warnings).toBe('');
    });
});
