import isNotEmpty from './isNotEmpty';

/**
 * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
 * https://caniuse.com/mdn-javascript_builtins_array_findlast
 */
export default function findLast<T = any>(arr: T[], callback: (value: T, index: number, array: T[]) => boolean): T | undefined {
    let item;

    if (isNotEmpty(arr)) {
        try {
            item = (arr as any).findLast(callback);
        } catch {
            item = [...arr].reverse().find(callback);
        }
    }

    return item;
}
