export default function getPreviousElementSibling(element: Element, selector: string): Element | null {
    let previousElement = element.previousElementSibling;

    while (previousElement) {
        if (previousElement.matches(selector)) {
            return previousElement;
        } else {
            previousElement = previousElement.previousElementSibling;
        }
    }

    return null;
}
