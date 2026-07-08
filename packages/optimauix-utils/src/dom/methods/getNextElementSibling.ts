export default function getNextElementSibling(element: Element, selector: string): Element | null {
    let nextElement = element.nextElementSibling;

    while (nextElement) {
        if (nextElement.matches(selector)) {
            return nextElement;
        } else {
            nextElement = nextElement.nextElementSibling;
        }
    }

    return null;
}
