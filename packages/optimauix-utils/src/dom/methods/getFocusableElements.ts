import find from './find';

export default function getFocusableElements(element: Element, selector: string = ''): Element[] {
    const focusableElements = find(
        element,
        `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${selector},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`
    );

    const visibleFocusableElements: Element[] = [];

    for (const focusableElement of focusableElements) {
        if (getComputedStyle(focusableElement).display != 'none' && getComputedStyle(focusableElement).visibility != 'hidden') visibleFocusableElements.push(focusableElement);
    }

    return visibleFocusableElements;
}
