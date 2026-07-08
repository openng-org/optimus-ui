import isObject from './isObject';

export default function omit(obj: unknown, ...keys: string[]): unknown {
    if (!isObject(obj)) return obj;

    const copy = { ...(obj as Record<string, unknown>) };

    keys?.flat().forEach((key) => delete copy[key]);

    return copy;
}
