import isElement from './isElement';

export default function find(element: Element, selector: string): Element[] {
    return isElement(element) ? Array.from(element.querySelectorAll(selector)) : [];
}
