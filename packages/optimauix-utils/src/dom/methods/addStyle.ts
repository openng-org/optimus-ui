export default function addStyle(element: HTMLElement, style: string | object): void {
    if (element) {
        if (typeof style === 'string') {
            element.style.cssText = style;
        } else {
            Object.entries(style || {}).forEach(([key, value]: [string, string]) => ((element.style as any)[key] = value));
        }
    }
}
