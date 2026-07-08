/**
 * Shallow equal for React/Vue props comparison
 * Ignores functions (common in props)
 */
export default function shallowEqualProps(propsA: Record<string, unknown>, propsB: Record<string, unknown>): boolean {
    if (propsA === propsB) return true;

    const keysA = Object.keys(propsA);
    const keysB = Object.keys(propsB);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        const valueA = propsA[key];
        const valueB = propsB[key];

        // Skip function comparison (they rarely change)
        if (typeof valueA === 'function' && typeof valueB === 'function') {
            continue;
        }

        if (!Object.is(valueA, valueB)) {
            return false;
        }
    }

    return true;
}
