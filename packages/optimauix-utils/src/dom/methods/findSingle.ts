import isElement from './isElement';

export default function findSingle(element: Element, selector: string): Element | null {
    return isElement(element) ? (element.matches(selector) ? element : element.querySelector(selector)) : null;
}
