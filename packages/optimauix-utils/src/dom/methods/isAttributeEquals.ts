import getAttribute from './getAttribute';
import isElement from './isElement';

export default function isAttributeEquals(element: Element, name: string, value: any): boolean {
    return isElement(element) ? getAttribute(element, name) === value : false;
}
