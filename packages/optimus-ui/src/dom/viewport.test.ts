import { absolutePosition, getViewport, relativePosition } from '@openng/optimus-ui-utils/dom';
import { DomHandler } from './domhandler';

// Classic (non-overlay) scrollbars take layout space: window.innerWidth includes the vertical scrollbar,
// documentElement.clientWidth does not. Headless browsers often use overlay scrollbars, so the scrollbar
// is simulated by shrinking documentElement.clientWidth/clientHeight. See issue #1926.
const SCROLLBAR = 16;

describe('Viewport and scrollbars', () => {
    let clientWidth: number;
    let clientHeight: number;
    let target: HTMLElement;
    let element: HTMLElement;

    beforeEach(() => {
        clientWidth = window.innerWidth - SCROLLBAR;
        clientHeight = window.innerHeight - SCROLLBAR;
        vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(clientWidth);
        vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(clientHeight);
    });

    afterEach(() => {
        target?.remove();
        element?.remove();
    });

    const createTarget = (left: number, width: number) => {
        target = document.createElement('div');
        Object.assign(target.style, { position: 'fixed', top: '10px', left: `${left}px`, width: `${width}px`, height: '20px' });
        document.body.appendChild(target);
        return target;
    };

    const createElement = (width: number, parent: HTMLElement) => {
        element = document.createElement('div');
        Object.assign(element.style, { position: 'absolute', width: `${width}px`, height: '50px' });
        parent.appendChild(element);
        return element;
    };

    it('getViewport should exclude the page scrollbars', () => {
        expect(getViewport()).toEqual({ width: clientWidth, height: clientHeight });
    });

    it('DomHandler.getViewport should exclude the page scrollbars', () => {
        expect(DomHandler.getViewport()).toEqual({ width: clientWidth, height: clientHeight });
    });

    it('relativePosition should keep an overlay at the right edge out from under the vertical scrollbar', () => {
        createTarget(clientWidth - 100, 100);
        createElement(200, target);

        relativePosition(element, target, false);

        expect(element.getBoundingClientRect().right).toBeLessThanOrEqual(clientWidth);
    });

    it('absolutePosition should flip an overlay whose right edge would fall under the vertical scrollbar', () => {
        // the overlay ends between clientWidth and innerWidth: visible area is exceeded, window is not
        createTarget(clientWidth - 190, 100);
        createElement(200, document.body);

        absolutePosition(element, target, false);

        expect(element.getBoundingClientRect().right).toBeLessThanOrEqual(clientWidth);
    });
});
