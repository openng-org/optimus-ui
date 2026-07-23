import { describe, expect, it } from 'vitest';
import { mapModuleSpecifier, VERSIONS } from './mappings';
import { getPrimengMajor, swapDependencies } from './package-json';

describe('mapModuleSpecifier', () => {
    it('maps primeng root and secondary entry points', () => {
        expect(mapModuleSpecifier('primeng')).toBe('@openng/optimus-ui');
        expect(mapModuleSpecifier('primeng/button')).toBe('@openng/optimus-ui/button');
        expect(mapModuleSpecifier('primeng/config')).toBe('@openng/optimus-ui/config');
    });

    it('maps the five @primeuix packages including subpaths', () => {
        expect(mapModuleSpecifier('@primeuix/themes')).toBe('@openng/optimus-ui-themes');
        expect(mapModuleSpecifier('@primeuix/themes/aura')).toBe('@openng/optimus-ui-themes/aura');
        expect(mapModuleSpecifier('@primeuix/styled')).toBe('@openng/optimus-ui-styled');
        expect(mapModuleSpecifier('@primeuix/styles')).toBe('@openng/optimus-ui-styles');
        expect(mapModuleSpecifier('@primeuix/utils')).toBe('@openng/optimus-ui-utils');
        expect(mapModuleSpecifier('@primeuix/motion')).toBe('@openng/optimus-ui-motion');
    });

    it('maps primeicons, including the renamed stylesheet', () => {
        expect(mapModuleSpecifier('primeicons')).toBe('@openng/icons');
        expect(mapModuleSpecifier('primeicons/primeicons.css')).toBe('@openng/icons/openng-icons.css');
        expect(mapModuleSpecifier('primeicons/raw-svg/check.svg')).toBe('@openng/icons/raw-svg/check.svg');
    });

    it('maps tailwindcss-primeui including subpaths', () => {
        expect(mapModuleSpecifier('tailwindcss-primeui')).toBe('@openng/optimus-ui-tailwindcss');
        expect(mapModuleSpecifier('tailwindcss-primeui/v4/index.css')).toBe('@openng/optimus-ui-tailwindcss/v4/index.css');
    });

    it('maps primelocale including subpaths', () => {
        expect(mapModuleSpecifier('primelocale')).toBe('@openng/optimus-ui-locale');
        expect(mapModuleSpecifier('primelocale/de.json')).toBe('@openng/optimus-ui-locale/de.json');
        expect(mapModuleSpecifier('primelocale/js/de.js')).toBe('@openng/optimus-ui-locale/js/de.js');
    });

    it('leaves unrelated specifiers alone', () => {
        expect(mapModuleSpecifier('primeng-extensions')).toBeNull();
        expect(mapModuleSpecifier('@angular/core')).toBeNull();
    });
});

describe('swapDependencies', () => {
    it('replaces primeng and only the @primeuix packages that are present', () => {
        const pkg: Record<string, any> = {
            dependencies: {
                primeng: '^21.0.2',
                '@primeuix/themes': '^1.2.0',
                'tailwindcss-primeui': '^0.6.1',
                primeicons: '^7.0.0',
                primelocale: '^2.4.0'
            }
        };
        const result = swapDependencies(pkg);
        expect(result.changed).toBe(true);
        expect(pkg.dependencies.primeng).toBeUndefined();
        expect(pkg.dependencies['@primeuix/themes']).toBeUndefined();
        expect(pkg.dependencies['@openng/optimus-ui']).toBe(VERSIONS['@openng/optimus-ui']);
        expect(pkg.dependencies['@openng/optimus-ui-themes']).toBe(VERSIONS['@openng/optimus-ui-themes']);
        expect(pkg.dependencies['@openng/optimus-ui-styled']).toBeUndefined();
        expect(pkg.dependencies['tailwindcss-primeui']).toBeUndefined();
        expect(pkg.dependencies['@openng/optimus-ui-tailwindcss']).toBe(VERSIONS['@openng/optimus-ui-tailwindcss']);
        expect(pkg.dependencies['primeicons']).toBeUndefined();
        expect(pkg.dependencies['@openng/icons']).toBe(VERSIONS['@openng/icons']);
        expect(pkg.dependencies['primelocale']).toBeUndefined();
        expect(pkg.dependencies['@openng/optimus-ui-locale']).toBe(VERSIONS['@openng/optimus-ui-locale']);
        expect(result.removed.sort()).toEqual(['@primeuix/themes', 'primeicons', 'primelocale', 'primeng', 'tailwindcss-primeui']);
    });

    it('handles devDependencies and reports no change when nothing matches', () => {
        const pkg: Record<string, any> = {
            dependencies: { '@angular/core': '^21.0.0' },
            devDependencies: { '@primeuix/utils': '^1.0.0' }
        };
        const result = swapDependencies(pkg);
        expect(result.changed).toBe(true);
        expect(pkg.devDependencies['@openng/optimus-ui-utils']).toBe(VERSIONS['@openng/optimus-ui-utils']);

        const clean: Record<string, any> = { dependencies: { '@angular/core': '^21.0.0' } };
        expect(swapDependencies(clean).changed).toBe(false);
    });
});

describe('getPrimengMajor', () => {
    it('extracts the first major from common range formats', () => {
        expect(getPrimengMajor({ dependencies: { primeng: '^21.0.2' } })).toBe(21);
        expect(getPrimengMajor({ dependencies: { primeng: '~19.1.0' } })).toBe(19);
        expect(getPrimengMajor({ devDependencies: { primeng: '>=20.0.0 <22' } })).toBe(20);
        expect(getPrimengMajor({ dependencies: { primeng: '21.0.0-rc.1' } })).toBe(21);
    });

    it('returns null when primeng is absent or unparseable', () => {
        expect(getPrimengMajor({ dependencies: {} })).toBeNull();
        expect(getPrimengMajor({})).toBeNull();
        expect(getPrimengMajor({ dependencies: { primeng: 'latest' } })).toBeNull();
    });
});
