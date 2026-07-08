import isString from './isString';

export default function toKebabCase(str: string): string {
    // convert snake, camel and pascal cases to kebab case
    return isString(str)
        ? str
              .replace(/(_)/g, '-')
              .replace(/([a-z])([A-Z])/g, '$1-$2')
              .toLowerCase()
        : str;
}
