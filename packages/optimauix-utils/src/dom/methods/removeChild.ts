import toElement from './toElement';

export default function removeChild(element: unknown, child: Node) {
    const target = toElement(element);

    if (target) target.removeChild(child);
    else throw new Error('Cannot remove ' + child + ' from ' + element);
}
