export default function remove(element: Element) {
    if (element) {
        if (!('remove' in Element.prototype)) element.parentNode?.removeChild(element);
        else element.remove();
    }
}
