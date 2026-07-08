import isVisible from './isVisible';

export default function isHidden(element: HTMLElement): boolean {
    return !isVisible(element);
}
