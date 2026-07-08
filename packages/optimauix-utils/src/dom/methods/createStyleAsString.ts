import createStyleMarkup from './createStyleMarkup';

/**
 * @deprecated Use `createStyleMarkup` instead.
 */
export default function createStyleAsString(css?: string, options: Record<string, unknown> = {}) {
    return createStyleMarkup(css, options);
}
