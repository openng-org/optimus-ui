import getParentNode from './getParentNode';

export default function isExist(element: Node): boolean {
    return !!(element !== null && typeof element !== 'undefined' && element.nodeName && getParentNode(element));
}
