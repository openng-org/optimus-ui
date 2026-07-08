import getParentNode from './getParentNode';

export default function getIndex(element: HTMLElement): number {
    if (element) {
        const children = getParentNode(element)?.childNodes;
        let num = 0;

        if (children) {
            for (let i = 0; i < children.length; i++) {
                if (children[i] === element) return num;
                if (children[i].nodeType === 1) num++;
            }
        }
    }

    return -1;
}
