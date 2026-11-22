import { getKeyValue, isArray, isNotEmpty, isNumber, isObject, isString, matchRegex, omit, toKebabCase } from '@openng/optimus-ui-utils/object';

export const EXPR_REGEX = /{([^}]*)}/g; // Exp: '{a}', '{a.b}', '{a.b.c}' etc.
export const CALC_REGEX = /(\d+\s+[\+\-\*\/]\s+\d+)/g;
export const VAR_REGEX = /var\([^)]+\)/g;

export function toTokenKey(str: string): string {
    return isString(str) ? str.replace(/[A-Z]/g, (c: string, i: number) => (i === 0 ? c : '.' + c.toLowerCase())).toLowerCase() : str;
}

export function merge(value1: any, value2: any): void {
    if (isArray(value1)) {
        value1.push(...(value2 || []));
    } else if (isObject(value1)) {
        Object.assign(value1, value2);
    }
}

export function toValue(value: any): any {
    // Check for Figma ($value-$type)
    return isObject(value) && value.hasOwnProperty('$value') && value.hasOwnProperty('$type') ? (value as any).$value : value;
}

export function toUnit(value: string, variable: string = ''): string {
    const excludedProperties = ['opacity', 'z-index', 'line-height', 'font-weight', 'flex', 'flex-grow', 'flex-shrink', 'order'];

    if (!excludedProperties.some((property) => variable.endsWith(property))) {
        const val = `${value}`.trim();
        const valArr = val.split(' ');

        return valArr.map((v) => (isNumber(v) ? `${v}px` : v)).join(' ');
    }

    return value;
}

export function toNormalizePrefix(prefix: string): string {
    return prefix.replaceAll(/ /g, '').replace(/[^\w]/g, '-');
}

export function toNormalizeVariable(prefix: string = '', variable: string = ''): string {
    return toNormalizePrefix(`${isString(prefix, false) && isString(variable, false) ? `${prefix}-` : prefix}${variable}`);
}

export function getVariableName(prefix: string = '', variable: string = ''): string {
    return `--${toNormalizeVariable(prefix, variable)}`;
}

export function hasOddBraces(str: string = ''): boolean {
    const openBraces = (str.match(/{/g) || []).length;
    const closeBraces = (str.match(/}/g) || []).length;

    return (openBraces + closeBraces) % 2 !== 0;
}

export function getVariableValue(value: any, variable: string = '', prefix: string = '', excludedKeyRegexes: RegExp[] = [], fallback?: string): string | undefined {
    if (isString(value)) {
        const val = value.trim();

        if (hasOddBraces(val)) {
            return undefined;
        } else if (matchRegex(val, EXPR_REGEX)) {
            const _val = val.replaceAll(EXPR_REGEX, (v: string) => {
                const path = v.replace(/{|}/g, '');
                const keys = path.split('.').filter((_v: string) => !excludedKeyRegexes.some((_r) => matchRegex(_v, _r)));

                return `var(${getVariableName(prefix, toKebabCase(keys.join('-')))}${isNotEmpty(fallback) ? `, ${fallback}` : ''})`;
            });

            return matchRegex(_val.replace(VAR_REGEX, '0'), CALC_REGEX) ? `calc(${_val})` : _val;
        }

        return val; //toUnit(val, variable);
    } else if (isNumber(value)) {
        return value; //toUnit(value, variable);
    }

    return undefined;
}

export function getComputedValue(obj = {}, value: any): any {
    if (isString(value)) {
        const val = value.trim();

        return matchRegex(val, EXPR_REGEX) ? val.replaceAll(EXPR_REGEX, (v: string) => getKeyValue(obj, v.replace(/{|}/g, '')) as string) : val;
    } else if (isNumber(value)) {
        return value;
    }

    return undefined;
}

export function setProperty(properties: string[], key: string, value?: string) {
    if (isString(key, false)) {
        properties.push(`${key}:${value};`);
    }
}

export function getRule(selector: string, properties: string): string {
    if (selector) {
        return `${selector}{${properties}}`;
    }

    return '';
}

export function evaluateDtExpressions(input: string, fn: (...args: any[]) => string): string {
    if (input.indexOf('dt(') === -1) return input;

    function fastParseArgs(str: string, fn: (...args: (string | number)[]) => string): (string | number)[] {
        const args: (string | number)[] = [];
        let i = 0;
        let current = '';
        let quote: string | null = null;
        let depth = 0;

        while (i <= str.length) {
            const c = str[i];

            if ((c === '"' || c === "'" || c === '`') && str[i - 1] !== '\\') {
                quote = quote === c ? null : c;
            }

            if (!quote) {
                if (c === '(') depth++;
                if (c === ')') depth--;

                if ((c === ',' || i === str.length) && depth === 0) {
                    const arg = current.trim();

                    if (arg.startsWith('dt(')) {
                        args.push(evaluateDtExpressions(arg, fn));
                    } else {
                        args.push(parseArg(arg));
                    }

                    current = '';
                    i++;
                    continue;
                }
            }

            if (c !== undefined) current += c;
            i++;
        }

        return args;
    }

    function parseArg(arg: string): string | number {
        const q = arg[0];

        if ((q === '"' || q === "'" || q === '`') && arg[arg.length - 1] === q) {
            return arg.slice(1, -1);
        }

        const num = Number(arg);

        return isNaN(num) ? arg : num;
    }

    const indices: [number, number][] = [];
    const stack: number[] = [];

    for (let i = 0; i < input.length; i++) {
        if (input[i] === 'd' && input.slice(i, i + 3) === 'dt(') {
            stack.push(i);
            i += 2;
        } else if (input[i] === ')' && stack.length > 0) {
            const start = stack.pop()!;

            if (stack.length === 0) {
                indices.push([start, i]);
            }
        }
    }

    if (!indices.length) return input;

    for (let i = indices.length - 1; i >= 0; i--) {
        const [start, end] = indices[i];
        const inner = input.slice(start + 3, end);
        const args = fastParseArgs(inner, fn);
        const resolved = fn(...args);

        input = input.slice(0, start) + resolved + input.slice(end + 1);
    }

    return input;
}

function toTokenVariableKey(path: string[], excludedKeyRegex?: RegExp): string {
    return toNormalizePrefix(
        path
            .filter((key) => !matchRegex(key, excludedKeyRegex))
            .map((key) => toKebabCase(key))
            .join('-')
    );
}

function getTokenVariableKeys(tokens: any, excludedKeyRegex?: RegExp, path: string[] = []): string[] {
    return Object.entries(tokens || {}).flatMap(([key, value]) => (isObject(toValue(value)) ? getTokenVariableKeys(value, excludedKeyRegex, [...path, key]) : [toTokenVariableKey([...path, key], excludedKeyRegex)]));
}

function omitTokenVariableKeys(tokens: any, keys: Set<string>, excludedKeyRegex?: RegExp, path: string[] = []): any {
    return Object.entries(tokens).reduce((acc: any, [key, value]) => {
        if (isObject(toValue(value))) {
            acc[key] = omitTokenVariableKeys(value, keys, excludedKeyRegex, [...path, key]);
        } else if (!keys.has(toTokenVariableKey([...path, key], excludedKeyRegex))) {
            acc[key] = value;
        }

        return acc;
    }, {});
}

function mergePreset(target: any = {}, source: any = {}, excludedKeyRegex?: RegExp): any {
    const merged = { ...target };
    const light = target.colorScheme?.light;

    // Top-level tokens of the later preset override the same tokens of the earlier `colorScheme.light`,
    // otherwise the earlier light-scheme value would still win in the generated light-mode css.
    if (isObject(light)) {
        const overrides = new Set(getTokenVariableKeys(omit(source, 'colorScheme', 'extend', 'css'), excludedKeyRegex));

        if (overrides.size) {
            merged.colorScheme = { ...target.colorScheme, light: omitTokenVariableKeys(light, overrides, excludedKeyRegex) };
        }
    }

    Object.keys(source).forEach((key) => {
        merged[key] = isObject(source[key]) && isObject(merged[key]) ? mergePreset(merged[key], source[key], excludedKeyRegex) : source[key];
    });

    return merged;
}

/**
 * Deep merges presets, where later presets take precedence over earlier ones.
 * Within a single preset a `colorScheme.light`/`colorScheme.dark` token is more specific than the same token at the top level,
 * but a top-level token of a later preset still replaces the light-scheme token of an earlier one.
 * @param presets - Presets to merge.
 * @param excludedKeyRegex - Keys that are skipped when building css variable names.
 * @returns Merged preset.
 */
export function mergePresets(presets: any[], excludedKeyRegex?: RegExp): any {
    return presets.reduce((acc, preset, i) => (i === 0 ? preset : mergePreset(acc, preset, excludedKeyRegex)), {});
}
