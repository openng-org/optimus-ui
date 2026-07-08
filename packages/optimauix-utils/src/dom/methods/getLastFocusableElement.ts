import getFocusableElements from './getFocusableElements';

export default function getLastFocusableElement(element: Element, selector?: string): Element | null {
    const focusableElements = getFocusableElements(element, selector);

    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
}
