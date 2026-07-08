export default function getCSSProperty(element?: HTMLElement, property?: string, inline?: boolean): string | null {
    if (element && property) {
        return inline ? element?.style?.getPropertyValue(property) : getComputedStyle(element).getPropertyValue(property);
    }

    return null;
}
