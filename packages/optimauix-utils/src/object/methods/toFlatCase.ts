import isString from './isString';

export default function toFlatCase(str: string): string {
    // convert snake, kebab, camel and pascal cases to flat case
    return isString(str) ? str.replace(/(-|_)/g, '').toLowerCase() : str;
}
