import deepMerge from './deepMerge';

/**
 * @deprecated Use `deepMerge` instead.
 *
 * Merges multiple objects into one.
 * @param args - Objects to merge.
 * @returns Merged object.
 */
export default function mergeKeys(...args: Record<string, unknown>[]): Record<string, unknown> {
    return deepMerge(...args);
}
