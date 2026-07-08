export default function isVisible(element?: HTMLElement): boolean {
    return !!(element && element.offsetParent != null);
}
