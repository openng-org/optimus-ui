import resolve from './resolve';

/**
 * Resolves the underlying value from various wrapper patterns
 * Supports React refs, Vue refs, Lit directives, Angular signals, and direct values/functions
 * @param value - The value to resolve
 */
export default function toValue(value: unknown): unknown {
    if (value && typeof value === 'object') {
        // React ref pattern: { current: unknown }
        if ('current' in value) {
            return (value as { current: unknown }).current;
        }
        // Vue ref / Lit pattern: { value: unknown }
        // Note: Vue 3 refs use getters/setters, so we need 'in' operator instead of hasOwn
        else if ('value' in value) {
            return (value as { value: unknown }).value;
        }
    }

    // Angular signals or fallback to direct value/function
    return resolve(value);
}
