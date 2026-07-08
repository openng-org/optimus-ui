import isElement from './isElement';

export default function getAttribute(element: Element, name: string): any {
    if (isElement(element)) {
        const value = element.getAttribute(name);

        if (!isNaN(value as any)) {
            return +(value as string);
        }

        if (value === 'true' || value === 'false') {
            return value === 'true';
        }

        return value;
    }

    return undefined;
}
