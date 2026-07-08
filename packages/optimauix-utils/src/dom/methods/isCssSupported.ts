/**
 * Checks if a given CSS property-value pair is supported by the browser.
 *
 * @param property - CSS property string
 * @param value - CSS value string
 * @returns True if supported, false otherwise
 */
export function isCssSupported(property: keyof CSSStyleDeclaration | string, value: string): boolean;

/**
 * Checks if a given CSS condition is supported by the browser.
 *
 * @param condition - CSS condition string
 * @returns True if supported, false otherwise
 */
export function isCssSupported(condition: string): boolean;

/**
 * Checks if a given CSS property-value pair or condition is supported by the browser.
 *
 * @param input - CSS property or condition
 * @param value - CSS value (optional)
 * @returns True if supported, false otherwise
 */
export default function isCssSupported(input: keyof CSSStyleDeclaration | string, value?: string): boolean {
    if (typeof CSS === 'undefined' || !CSS.supports) {
        return false;
    }

    if (value !== undefined) {
        const prop = input.toString().replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

        return CSS.supports(prop, value);
    }

    return CSS.supports(input.toString());
}
