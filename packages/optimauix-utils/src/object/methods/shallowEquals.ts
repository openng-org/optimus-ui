/**
 * Checks if two values are shallowly equal
 * - Primitives: compared by value (===)
 * - Objects/Arrays: compared by reference and first-level properties
 *
 * @param objA - First value to compare
 * @param objB - Second value to compare
 * @returns True if values are shallowly equal, false otherwise
 *
 * @example
 * shallowEquals(1, 1) // true
 * shallowEquals('a', 'a') // true
 * shallowEquals({ a: 1 }, { a: 1 }) // true (shallow)
 * shallowEquals({ a: { b: 1 } }, { a: { b: 1 } }) // false (nested objects are different references)
 * shallowEquals([1, 2], [1, 2]) // true (shallow)
 * shallowEquals([1, [2]], [1, [2]]) // false (nested arrays are different references)
 */
export default function shallowEquals(objA: unknown, objB: unknown): boolean {
    // Fast path: same reference
    if (objA === objB) return true;

    // Fast path: different types or null
    if (typeof objA !== typeof objB || objA === null || objB === null) {
        return false;
    }

    // Fast path: primitives
    if (typeof objA !== 'object') {
        return objA === objB;
    }

    // Same reference (including null === null, undefined === undefined)
    if (Object.is(objA, objB)) {
        return true;
    }

    // If either is not an object or is null, they're not equal
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }

    // Compare arrays
    if (Array.isArray(objA) && Array.isArray(objB)) {
        if (objA.length !== objB.length) {
            return false;
        }

        for (let i = 0; i < objA.length; i++) {
            if (!Object.is(objA[i], objB[i])) {
                return false;
            }
        }

        return true;
    }

    // If only one is array, they're not equal
    if (Array.isArray(objA) || Array.isArray(objB)) {
        return false;
    }

    // Compare object keys
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Check if all keys and values match
    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is((objA as Record<string, unknown>)[key], (objB as Record<string, unknown>)[key])) {
            return false;
        }
    }

    return true;
}
