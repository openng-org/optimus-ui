import { afterEach, describe, expect, it } from 'vitest';
import Theme from '../config/index';
import { $t } from '../helpers/t';
import ThemeUtils from '../utils/themeUtils';
import definePreset from './definePreset';
import updatePreset from './updatePreset';
import usePreset from './usePreset';

const defaults = {
    variable: {
        prefix: 'p',
        selector: ':root,:host',
        excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi
    },
    options: { prefix: 'p', darkModeSelector: 'system', cssLayer: false }
};

const noopSet = { layerNames: () => {} };

const define = (...presets: any[]): any => definePreset(...presets);

function componentCss(name: string, preset: any): string {
    return ThemeUtils.getPreset({ name, preset: preset.components[name], options: {}, params: undefined, set: noopSet, defaults, selector: undefined }).css;
}

function semanticCss(preset: any): string {
    return ThemeUtils.getCommon({ name: 'test', theme: { preset, options: {} }, params: undefined, set: noopSet, defaults }).semantic.css;
}

// The value the browser ends up with: the last declaration of the variable in the light (or dark) rule.
function resolved(css: string, variable: string, scheme: 'light' | 'dark' = 'light'): string | undefined {
    const [light, dark = ''] = css.split('@media');
    const matches = [...(scheme === 'light' ? light : dark).matchAll(new RegExp(`${variable}:([^;}]+)`, 'g'))];

    return matches.at(-1)?.[1];
}

// Mirrors how the built-in presets (Aura, Lara, Nora, Material) define most tokens at the top level.
const basePreset = {
    semantic: {
        primary: { color: '{blue.500}' },
        colorScheme: {
            light: { highlight: { background: '{primary.50}' } },
            dark: { highlight: { background: '{primary.950}' } }
        }
    },
    components: {
        menubar: {
            item: {
                color: '{navigation.item.color}',
                icon: { color: '{navigation.item.icon.color}' }
            }
        },
        togglebutton: {
            colorScheme: {
                light: { root: { checkedBackground: '{surface.100}' } },
                dark: { root: { checkedBackground: '{surface.950}' } }
            }
        }
    }
};

describe('definePreset', () => {
    describe('colorScheme.light overrides a top-level token of the base preset (#1754)', () => {
        it('applies the light-scheme value for a component token', () => {
            const preset = define(basePreset, {
                components: { menubar: { colorScheme: { light: { item: { color: 'red' } } } } }
            });

            expect(resolved(componentCss('menubar', preset), '--p-menubar-item-color')).toBe('red');
        });

        it('resolves a light-scheme reference to another overridden token', () => {
            const preset = define(basePreset, {
                components: {
                    menubar: {
                        colorScheme: {
                            light: { item: { color: 'red', icon: { color: '{menubar.item.color}' } } },
                            dark: { item: { color: 'blue', icon: { color: '{menubar.item.color}' } } }
                        }
                    }
                }
            });
            const css = componentCss('menubar', preset);

            expect(resolved(css, '--p-menubar-item-color')).toBe('red');
            expect(resolved(css, '--p-menubar-item-icon-color')).toBe('var(--p-menubar-item-color)');
            expect(resolved(css, '--p-menubar-item-color', 'dark')).toBe('blue');
            expect(resolved(css, '--p-menubar-item-icon-color', 'dark')).toBe('var(--p-menubar-item-color)');
        });

        it('keeps the top-level value as the light-scheme default when only dark is overridden', () => {
            const preset = define(basePreset, {
                components: { menubar: { item: { icon: { color: '{menubar.item.color}' } }, colorScheme: { dark: { item: { color: 'blue' } } } } }
            });
            const css = componentCss('menubar', preset);

            expect(resolved(css, '--p-menubar-item-color')).toBe('var(--p-navigation-item-color)');
            expect(resolved(css, '--p-menubar-item-icon-color')).toBe('var(--p-menubar-item-color)');
            expect(resolved(css, '--p-menubar-item-color', 'dark')).toBe('blue');
        });

        it('applies the light-scheme value for a semantic token', () => {
            const preset = define(basePreset, {
                semantic: { colorScheme: { light: { primary: { color: '{indigo.500}' } } } }
            });

            expect(resolved(semanticCss(preset), '--p-primary-color')).toBe('var(--p-indigo-500)');
        });
    });

    describe('a top-level token overrides colorScheme.light of the base preset (#1)', () => {
        it('applies the top-level value in light mode and leaves dark mode untouched', () => {
            const preset = define(basePreset, {
                components: { togglebutton: { root: { checkedBackground: 'blue' } } }
            });
            const css = componentCss('togglebutton', preset);

            expect(resolved(css, '--p-togglebutton-checked-background')).toBe('blue');
            expect(resolved(css, '--p-togglebutton-checked-background', 'dark')).toBe('var(--p-surface-950)');
        });

        it('matches tokens by their css variable, regardless of the excluded `root` segment or nesting', () => {
            const preset = define(basePreset, {
                components: { togglebutton: { checked: { background: 'blue' } } }
            });

            expect(resolved(componentCss('togglebutton', preset), '--p-togglebutton-checked-background')).toBe('blue');
        });

        it('applies the top-level value for a semantic token', () => {
            const preset = define(basePreset, {
                semantic: { highlight: { background: 'yellow' } }
            });
            const css = semanticCss(preset);

            expect(resolved(css, '--p-highlight-background')).toBe('yellow');
            expect(resolved(css, '--p-highlight-background', 'dark')).toBe('var(--p-primary-950)');
        });

        it('lets a colorScheme.light value of the same preset win over its own top-level value', () => {
            const preset = define(basePreset, {
                components: { togglebutton: { root: { checkedBackground: 'blue' }, colorScheme: { light: { root: { checkedBackground: 'green' } } } } }
            });

            expect(resolved(componentCss('togglebutton', preset), '--p-togglebutton-checked-background')).toBe('green');
        });
    });

    it('lets colorScheme.light win over a top-level token within a single preset', () => {
        const preset = define({
            components: { toolbar: { root: { background: '{content.background}' }, colorScheme: { light: { root: { background: '{surface.50}' } } } } }
        });

        expect(resolved(componentCss('toolbar', preset), '--p-toolbar-background')).toBe('var(--p-surface-50)');
    });

    it('does not mutate the presets it merges', () => {
        const snapshot = JSON.parse(JSON.stringify(basePreset));

        define(basePreset, { components: { togglebutton: { root: { checkedBackground: 'blue' } } } });

        expect(basePreset).toEqual(snapshot);
    });
});

describe('preset merging through the theme', () => {
    const override = { components: { togglebutton: { root: { checkedBackground: 'blue' } } } };

    afterEach(() => {
        Theme.setPreset(undefined);
    });

    it('usePreset applies the same precedence', () => {
        usePreset<any>(basePreset, override);

        expect(resolved(componentCss('togglebutton', Theme.getPreset()), '--p-togglebutton-checked-background')).toBe('blue');
    });

    it('updatePreset applies the same precedence', () => {
        Theme.setPreset(basePreset);
        updatePreset<any>(override);

        expect(resolved(componentCss('togglebutton', Theme.getPreset()), '--p-togglebutton-checked-background')).toBe('blue');
    });

    it('$t().preset() applies the same precedence', () => {
        const { preset } = $t().preset(basePreset).preset(override).define();

        expect(resolved(componentCss('togglebutton', preset), '--p-togglebutton-checked-background')).toBe('blue');
    });
});
