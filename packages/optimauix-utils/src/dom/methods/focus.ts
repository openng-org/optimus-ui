export default function focus(element: HTMLElement, options?: FocusOptions): void {
    if (element && document.activeElement !== element) element.focus(options);
}
