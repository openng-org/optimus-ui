import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MANIFEST_PATH } from './build-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../public/design-tokens');

const REM_IN_PX = 16;
const REFERENCE = /\{([^}]+)\}/g;
const ONLY_REFERENCE = /^\{([^}]+)\}$/;
const MODES = ['light', 'dark'];
const LAYERS = ['primitive', 'semantic', 'component'];

/**
 * Export the design tokens in the manifest as Penpot token files (https://help.penpot.app/user-guide/design-systems/design-tokens/),
 * one per preset: `public/design-tokens/optimus-ui-<preset>.tokens.json`.
 *
 * Each file has a token set per layer (primitive, semantic, component) plus light and dark sets for the color scheme
 * tokens, and a "Color scheme" theme group to switch between them. Token names are the Optimus UI token names
 * (`button.primary.background` is `--p-button-primary-background`), so `{references}` keep working in Penpot.
 *
 * Penpot works in px and has no type for durations, CSS keywords or shorthands (`0.5rem 1rem`), so rem values are
 * converted to px, `color-mix()` is computed, CSS shadows become shadow objects, and tokens Penpot cannot represent
 * are left out together with the tokens that reference them.
 */
function main() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        throw new Error(`${MANIFEST_PATH} is missing. Run \`npm run build:manifest\` first.`);
    }
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (const preset of manifest.theme.presets) {
        const { file, exported, skipped } = buildPresetFile(manifest, preset);
        const outputPath = path.join(OUTPUT_DIR, `optimus-ui-${preset}.tokens.json`);
        fs.writeFileSync(outputPath, JSON.stringify(file, null, 2), 'utf-8');
        console.log(`✓ Generated ${path.relative(process.cwd(), outputPath)} (${exported} tokens, ${skipped} without a Penpot equivalent)`);
    }
}

export function buildPresetFile(manifest, preset) {
    const tokensByName = new Map(manifest.theme.tokens.map((t) => [t.name, t]));

    // 1. Convert every value of this preset to its Penpot form, per set
    const entries = [];
    for (const token of manifest.theme.tokens) {
        const value = token.values[preset];
        if (value === undefined) continue;
        const type = penpotType(token);
        const modes = typeof value === 'object' ? MODES.filter((m) => value[m] !== undefined).map((m) => [m, value[m]]) : [[undefined, value]];

        for (const [mode, raw] of modes) {
            const set = mode ? `${token.layer}/${mode}` : token.layer;
            const converted = type ? convertValue(raw, type, { preset, mode: mode ?? 'light', tokensByName }) : undefined;
            entries.push({ token, set, type, value: converted });
        }
    }

    // 2. Leave out tokens without a Penpot form, then everything that references them, until nothing changes
    const exportedNames = () => new Set(entries.filter((e) => e.value !== undefined).map((e) => e.token.name));
    let names = exportedNames();
    for (let changed = true; changed;) {
        changed = false;
        for (const entry of entries) {
            if (entry.value !== undefined && referencesOf(entry.value).some((ref) => !names.has(ref))) {
                entry.value = undefined;
                changed = true;
            }
        }
        if (changed) names = exportedNames();
    }

    // 3. Nest `a.b.c` names into groups, per set
    const sets = new Map();
    for (const setName of LAYERS.flatMap((layer) => [layer, ...MODES.map((m) => `${layer}/${m}`)])) sets.set(setName, {});
    for (const entry of entries) {
        if (entry.value === undefined) continue;
        const node = { $value: entry.value, $type: entry.type };
        if (entry.token.description) node.$description = entry.token.description;
        setPath(sets.get(entry.set), entry.token.name.split('.'), node);
    }
    for (const [name, content] of sets) if (Object.keys(content).length === 0) sets.delete(name);

    const setOrder = [...sets.keys()];
    const themeSets = (mode) => setOrder.filter((name) => !MODES.some((m) => name.endsWith(`/${m}`)) || name.endsWith(`/${mode}`));
    const themes = MODES.map((mode) => ({
        id: deterministicId(`${preset}-${mode}`),
        name: capitalize(mode),
        group: 'Color scheme',
        description: `Optimus UI ${capitalize(preset)} preset, ${mode} color scheme`,
        isSource: false,
        selectedTokenSets: Object.fromEntries(themeSets(mode).map((name) => [name, 'enabled']))
    }));

    const file = {
        ...Object.fromEntries(sets),
        $themes: themes,
        $metadata: {
            tokenSetOrder: setOrder,
            activeThemes: ['Color scheme/Light'],
            activeSets: themeSets('light')
        }
    };

    const exported = entries.filter((e) => e.value !== undefined).length;
    return { file, exported, skipped: entries.length - exported };
}

/**
 * Map a manifest token type to a Penpot `$type`; dimensions are split by what they size, which decides where Penpot lets you apply them.
 */
function penpotType(token) {
    const name = token.name;
    switch (token.type) {
        case 'color':
            return 'color';
        case 'opacity':
            return 'opacity';
        case 'number':
            return 'number';
        case 'fontWeight':
            return 'fontWeights';
        case 'fontFamily':
            return 'fontFamilies';
        case 'shadow':
            return 'shadow';
        case 'dimension':
            if (/font\.size$/.test(name)) return 'fontSizes';
            // Primitive radii are named by size (`border.radius.md`), so match the segment, not the end
            if (/(^|\.)radius(\.|$)/.test(name)) return 'borderRadius';
            if (/(border|outline|ring)\.width$/.test(name)) return 'borderWidth';
            if (/(padding(\.[xy])?|gap|margin|gutter|offset)$/.test(name)) return 'spacing';
            if (/(width|height|size)$/.test(name)) return 'sizing';
            return 'dimension';
        default:
            return undefined;
    }
}

function convertValue(raw, type, context) {
    const value = String(raw).trim();
    if (ONLY_REFERENCE.test(value)) return value;

    switch (type) {
        case 'color':
            return convertColor(value, context);
        case 'shadow':
            return convertShadow(value);
        case 'fontWeights':
        case 'number':
        case 'opacity':
            return /^-?[\d.]+$/.test(value) ? value : undefined;
        case 'borderRadius':
            // Penpot radii are px only; a 9999 radius draws the same circle or pill as 50% on the square elements that use it
            return value === '50%' ? '9999' : toPx(value);
        default:
            return toPx(value);
    }
}

/** `0.75rem` -> `12`, `2px` -> `2`; Penpot reads unitless dimensions as px. Percentages and shorthands have no Penpot form. */
function toPx(value) {
    const match = value.match(/^(-?[\d.]+)(px|rem|em)?$/);
    if (!match) return undefined;
    const number = parseFloat(match[1]) * (match[2] === 'rem' || match[2] === 'em' ? REM_IN_PX : 1);
    return String(Math.round(number * 100) / 100);
}

function convertColor(value, context) {
    if (/^(#[\da-f]{3,8}|rgba?\([^{}]*\)|hsla?\([^{}]*\))$/i.test(value) || value === 'transparent') return value;
    const mix = value.match(/^color-mix\(in srgb,\s*(.+)\)$/i);
    if (mix) return mixColors(splitTopLevel(mix[1]), context);
    return undefined;
}

/**
 * Compute `color-mix(in srgb, A p%, B q%)` against this preset and color scheme, since Penpot has no color-mix.
 */
function mixColors(args, context) {
    if (args.length !== 2) return undefined;
    const parsed = args.map((arg) => {
        const match = arg.trim().match(/^(.*?)(?:\s+([\d.]+)%)?$/);
        return { color: parseColor(resolve(match[1].trim(), context)), weight: match[2] !== undefined ? parseFloat(match[2]) / 100 : undefined };
    });
    if (parsed.some((p) => !p.color)) return undefined;

    let [a, b] = parsed;
    if (a.weight === undefined && b.weight === undefined) a.weight = b.weight = 0.5;
    else if (a.weight === undefined) a.weight = 1 - b.weight;
    else if (b.weight === undefined) b.weight = 1 - a.weight;

    const alpha = a.color[3] * a.weight + b.color[3] * b.weight;
    const channel = (i) => (alpha === 0 ? 0 : (a.color[i] * a.color[3] * a.weight + b.color[i] * b.color[3] * b.weight) / alpha);
    const rgb = [0, 1, 2].map((i) => Math.round(channel(i)));
    return alpha >= 1 ? `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}` : `rgba(${rgb.join(', ')}, ${Math.round(alpha * 1000) / 1000})`;
}

function resolve(value, { preset, mode, tokensByName }, depth = 0) {
    if (depth > 20) return value;
    return value.replace(REFERENCE, (match, ref) => {
        const target = tokensByName.get(ref)?.values[preset];
        if (target === undefined) return match;
        return resolve(String(typeof target === 'object' ? (target[mode] ?? target.light) : target), { preset, mode, tokensByName }, depth + 1);
    });
}

/** Parse hex, rgb(a) and `transparent` into [r, g, b, a]. */
function parseColor(value) {
    if (value === 'transparent') return [0, 0, 0, 0];
    const hex = value.match(/^#([\da-f]{3,8})$/i)?.[1];
    if (hex) {
        const full = hex.length <= 4 ? [...hex].map((c) => c + c).join('') : hex;
        const [r, g, b, a = 255] = full.match(/../g).map((h) => parseInt(h, 16));
        return [r, g, b, a / 255];
    }
    const rgb = value.match(/^rgba?\(([^)]+)\)$/i)?.[1];
    if (rgb) {
        const parts = rgb
            .split(/[\s,/]+/)
            .filter(Boolean)
            .map(parseFloat);
        return parts.length >= 3 ? [parts[0], parts[1], parts[2], parts[3] ?? 1] : undefined;
    }
    return undefined;
}

/**
 * `0 1px 3px 0 rgba(0, 0, 0, 0.1), inset 0 1px 2px {primary.color}` -> Penpot shadow objects.
 */
function convertShadow(value) {
    if (value === 'none') return undefined;
    const shadows = splitTopLevel(value).map((part) => {
        const tokens = part.trim().match(/\{[^}]+\}|[a-z-]+\([^)]*\)|\S+/gi) ?? [];
        const inset = tokens[0] === 'inset';
        const rest = inset ? tokens.slice(1) : tokens;
        const lengths = [];
        let color;
        for (const t of rest) {
            const px = toPx(t);
            if (px !== undefined && color === undefined) lengths.push(px);
            else if (color === undefined) color = t;
            else return undefined;
        }
        if (lengths.length < 2 || lengths.length > 4 || !color) return undefined;
        const [offsetX, offsetY, blur = '0', spread = '0'] = lengths;
        return { offsetX, offsetY, blur, spread, color, inset };
    });
    if (shadows.some((s) => !s)) return undefined;
    return shadows.length === 1 ? shadows[0] : shadows;
}

/** Split on commas that are not inside parentheses. */
function splitTopLevel(value) {
    const parts = [];
    let depth = 0;
    let current = '';
    for (const char of value) {
        if (char === '(') depth++;
        if (char === ')') depth--;
        if (char === ',' && depth === 0) {
            parts.push(current);
            current = '';
        } else current += char;
    }
    parts.push(current);
    return parts.map((p) => p.trim()).filter(Boolean);
}

function referencesOf(value) {
    if (typeof value === 'string') return [...value.matchAll(REFERENCE)].map((m) => m[1]);
    if (value && typeof value === 'object') return Object.values(value).flatMap(referencesOf);
    return [];
}

function setPath(target, parts, node) {
    let current = target;
    for (const part of parts.slice(0, -1)) current = current[part] ??= {};
    current[parts[parts.length - 1]] = node;
}

/** A stable UUID-shaped id, so rebuilding does not churn the theme ids. */
function deterministicId(seed) {
    const hex = crypto.createHash('sha1').update(`optimus-ui-penpot-${seed}`).digest('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main();
}
