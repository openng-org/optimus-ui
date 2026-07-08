import isExist from './isExist';

export default function removeStyleTag(element: Node): Node | null {
    if (isExist(element)) {
        try {
            element.parentNode?.removeChild(element);
        } catch {
            // style element may have already been removed in a fast refresh
        }

        return null;
    }

    return element;
}
