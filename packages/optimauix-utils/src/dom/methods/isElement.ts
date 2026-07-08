export default function isElement(element: unknown): element is Element {
    return typeof Element !== 'undefined' ? element instanceof Element : element !== null && typeof element === 'object' && (element as Element).nodeType === 1 && typeof (element as Element).nodeName === 'string';
}
