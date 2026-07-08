import isArray from './isArray';
import isDate from './isDate';
import isFunction from './isFunction';
import isObject from './isObject';

export default function stringify(value: unknown, indent: number = 2, currentIndent: number = 0): string {
    const currentIndentStr = ' '.repeat(currentIndent);
    const nextIndentStr = ' '.repeat(currentIndent + indent);

    if (isArray(value)) {
        return '[' + (value as unknown[]).map((v: unknown) => stringify(v, indent, currentIndent + indent)).join(', ') + ']';
    } else if (isDate(value)) {
        return value.toISOString();
    } else if (isFunction(value)) {
        return value.toString();
    } else if (isObject(value)) {
        return (
            '{\n' +
            Object.entries(value)
                .map(([k, v]) => `${nextIndentStr}${k}: ${stringify(v, indent, currentIndent + indent)}`)
                .join(',\n') +
            `\n${currentIndentStr}` +
            '}'
        );
    } else {
        return JSON.stringify(value);
    }
}
