import getParentNode from './getParentNode';

export default function getParents(element: Node, parents: ParentNode[] = []): ParentNode[] {
    const parent = getParentNode(element);

    return parent === null ? parents : getParents(parent, parents.concat([parent]));
}
