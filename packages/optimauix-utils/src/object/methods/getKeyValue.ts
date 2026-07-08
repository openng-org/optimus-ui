import isObject from './isObject';
import resolve from './resolve';
import toFlatCase from './toFlatCase';

export default function getKeyValue<T extends Record<string, unknown>>(obj: T | undefined, key: string = '', params: unknown = {}): unknown {
    const fKeys = toFlatCase(key).split('.');
    const fKey = fKeys.shift();

    if (fKey) {
        if (isObject(obj)) {
            const matchedKey = Object.keys(obj).find((k) => toFlatCase(k) === fKey) || '';

            return getKeyValue(resolve(obj[matchedKey], params) as Record<string, unknown>, fKeys.join('.'), params);
        }

        return undefined;
    }

    return resolve(obj, params);
}
