export default function getParentNode(element: Node): ParentNode | null {
    if (element) {
        let parent = element.parentNode;

        if (parent && parent instanceof ShadowRoot && parent.host) {
            parent = parent.host;
        }

        return parent;
    }

    return null;
}
