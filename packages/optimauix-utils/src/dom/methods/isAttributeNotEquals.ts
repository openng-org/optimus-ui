import isAttributeEquals from './isAttributeEquals';

export default function isAttributeNotEquals(element: Element, name: string, value: any): boolean {
    return !isAttributeEquals(element, name, value);
}
