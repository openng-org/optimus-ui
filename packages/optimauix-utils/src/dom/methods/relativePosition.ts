import getCSSVariableByRegex from './getCSSVariableByRegex';
import getHiddenElementDimensions from './getHiddenElementDimensions';
import getViewport from './getViewport';

export default function relativePosition(element: HTMLElement, target: HTMLElement, gutter: boolean = true, fixedOrigin: 'top' | 'bottom' | undefined = undefined): void {
    if (element) {
        const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : getHiddenElementDimensions(element);
        const targetHeight = target.offsetHeight;
        const targetOffset = target.getBoundingClientRect();
        const viewport = getViewport();
        let top,
            left,
            origin = fixedOrigin ?? 'top';

        if (!fixedOrigin && targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
            top = -1 * elementDimensions.height;
            origin = 'bottom';

            if (targetOffset.top + top < 0) {
                top = -1 * targetOffset.top;
            }
        } else {
            top = targetHeight;
        }

        if (elementDimensions.width > viewport.width) {
            // element wider then viewport and cannot fit on screen (align at left side of viewport)
            left = targetOffset.left * -1;
        } else if (targetOffset.left + elementDimensions.width > viewport.width) {
            // element wider then viewport but can be fit on screen (align at right side of viewport)
            left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
        } else {
            // element fits on screen (align with target)
            left = 0;
        }

        element.style.top = top + 'px';
        element.style.insetInlineStart = left + 'px';
        element.style.transformOrigin = origin;

        if (gutter) {
            const gutterValue = getCSSVariableByRegex(/-anchor-gutter$/)?.value;

            element.style.marginTop = origin === 'bottom' ? `calc(${gutterValue ?? '2px'} * -1)` : (gutterValue ?? '');
        }
    }
}
