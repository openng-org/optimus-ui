export default function getScrollLeft(element?: HTMLElement): number {
    // for RTL scrollLeft should be negative
    return element ? Math.abs(element.scrollLeft) : 0;
}
