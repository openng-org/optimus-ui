import absolutePosition from './absolutePosition';
import getOuterWidth from './getOuterWidth';
import relativePosition from './relativePosition';

export default function alignOverlay(overlay: HTMLElement, target: HTMLElement, appendTo: string, calculateMinWidth: boolean = true) {
    if (overlay && target) {
        if (appendTo === 'self') {
            relativePosition(overlay, target);
        } else {
            if (calculateMinWidth) overlay.style.minWidth = getOuterWidth(target) + 'px';
            absolutePosition(overlay, target);
        }
    }
}
