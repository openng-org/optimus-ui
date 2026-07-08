export default function setCSSProperty(element?: HTMLElement, property?: string, value: any = null, priority?: string): void {
    property && element?.style?.setProperty(property, value, priority);
}
