import ComponentTokens from '@openng/optimus-ui-themes/tokens';
import Aura from '@openng/optimus-ui-themes/aura';
import Lara from '@openng/optimus-ui-themes/lara';
import Material from '@openng/optimus-ui-themes/material';
import Nora from '@openng/optimus-ui-themes/nora';

export const PRESETS = { aura: Aura, lara: Lara, material: Material, nora: Nora };
export const DEFAULT_PRESET = 'aura';

// Keys the styled engine leaves out of token and CSS variable names (see optimus-ui-styled config `excludedKeyRegex`)
const EXCLUDED_KEYS = /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/i;
const REFERENCE = /\{([^}]+)\}/g;

/**
 * Flatten every preset into one token list. Names follow the styled engine (`formField.borderRadius` -> `form.field.border.radius`),
 * so `{references}` in values resolve against them and `variable` matches the generated CSS variable.
 *
 * Each token has a value per preset; tokens under `colorScheme` carry a `{ light, dark }` pair.
 */
export function collectTokens() {
    const tokens = new Map();

    for (const [presetName, preset] of Object.entries(PRESETS)) {
        const add = (name, layer, component, mode, value) => {
            if (!tokens.has(name)) tokens.set(name, { name, variable: `--p-${name.replace(/\./g, '-')}`, layer, component, values: {} });
            const token = tokens.get(name);
            if (mode) {
                const current = typeof token.values[presetName] === 'object' ? token.values[presetName] : {};
                token.values[presetName] = { ...current, [mode]: value };
            } else if (typeof token.values[presetName] !== 'object') {
                token.values[presetName] = value;
            }
        };

        walk(preset.primitive, [], (name, mode, value) => add(name, 'primitive', undefined, mode, value));
        walk(preset.semantic, [], (name, mode, value) => add(name, 'semantic', undefined, mode, value));
        for (const [component, componentTokens] of Object.entries(preset.components ?? {})) {
            walk(componentTokens, [component], (name, mode, value) => add(name, 'component', component, mode, value));
        }
    }

    const descriptions = new Map();
    for (const { tokens: componentTokens } of Object.values(ComponentTokens)) {
        for (const t of componentTokens ?? []) descriptions.set(t.token, t.description);
    }

    const list = [...tokens.values()].map((token) => {
        const description = descriptions.get(token.name);
        return { ...token, type: inferType(token, tokens), ...(description ? { description } : {}) };
    });

    return list.sort((a, b) => layerOrder(a) - layerOrder(b) || a.name.localeCompare(b.name, 'en', { numeric: true }));
}

function walk(node, path, emit, mode) {
    for (const [key, value] of Object.entries(node ?? {})) {
        const lower = key.toLowerCase();
        const nextMode = lower === 'light' || lower === 'dark' ? lower : mode;
        const nextPath = EXCLUDED_KEYS.test(key) ? path : [...path, toTokenKey(key)];

        if (value && typeof value === 'object') {
            walk(value, nextPath, emit, nextMode);
        } else if (!(lower === 'css' && typeof value === 'string') && nextPath.length > 0) {
            emit(nextPath.join('.'), nextMode, normalizeReferences(String(value)));
        }
    }
}

// The styled engine kebab-cases references, so `{overlay.popover.borderRadius}` means `{overlay.popover.border.radius}`
function normalizeReferences(value) {
    return value.replace(REFERENCE, (match, ref) => `{${ref.split('.').map(toTokenKey).join('.')}}`);
}

// Mirrors `toTokenKey` in optimus-ui-styled: `borderRadius` -> `border.radius`
function toTokenKey(key) {
    return key.replace(/[A-Z]/g, (c, i) => (i === 0 ? c : '.' + c.toLowerCase())).toLowerCase();
}

function layerOrder(token) {
    return { primitive: 0, semantic: 1, component: 2 }[token.layer];
}

/**
 * Classify a token by its resolved value in the default preset, falling back to the other presets, with name hints
 * for values that look alike (`500` is a font weight, `0` is a dimension when the name says padding).
 */
function inferType(token, tokens) {
    const name = token.name;
    for (const presetName of [DEFAULT_PRESET, ...Object.keys(PRESETS)]) {
        const value = token.values[presetName];
        if (value === undefined) continue;
        const sample = typeof value === 'object' ? (value.light ?? value.dark) : value;
        const resolved = resolveValue(sample, presetName, tokens, 'light');
        const type = classify(name, resolved);
        if (type) return type;
    }
    return 'string';
}

function classify(name, value) {
    if (value === undefined) return undefined;
    const v = value.trim();
    const last = name.split('.').pop();

    if (/font\.weight$/.test(name)) return 'fontWeight';
    if (/font\.family$/.test(name)) return 'fontFamily';
    if (/(^|\.)shadow$/.test(name)) return v === 'none' ? 'string' : 'shadow';
    if (/duration$/.test(name) || /^[\d.]+m?s$/.test(v)) return 'duration';
    if (/^(#|rgba?\(|hsla?\(|color-mix\()/.test(v) || v === 'transparent' || (/(color|background|border\.color)$/.test(name) && /^[a-z]+$/i.test(v) && v !== 'none' && v !== 'inherit')) return 'color';
    if (/^-?[\d.]+(px|rem|em|%)$/.test(v)) return 'dimension';
    // Match whole name segments: `border.radius.none` is a radius, `list.option.gap` a gap
    if (/^-?[\d.]+$/.test(v)) return v === '0' && /(^|\.)(padding|gap|margin|radius|width|height|size|offset|gutter)(\.|$)/.test(name) ? 'dimension' : last === 'opacity' || /opacity$/.test(name) ? 'opacity' : 'number';
    return undefined;
}

/**
 * Resolve `{references}` in a value against one preset (and color scheme) until only literals remain.
 */
export function resolveValue(value, presetName, tokens, mode = 'light', depth = 0) {
    if (value === undefined || depth > 20) return value;
    return String(value).replace(REFERENCE, (match, ref) => {
        const target = tokens.get(ref);
        const targetValue = target?.values[presetName];
        if (targetValue === undefined) return match;
        const picked = typeof targetValue === 'object' ? (targetValue[mode] ?? targetValue.light) : targetValue;
        return resolveValue(picked, presetName, tokens, mode, depth + 1);
    });
}

export function referencesOf(value) {
    return [...String(value).matchAll(REFERENCE)].map((m) => m[1]);
}
