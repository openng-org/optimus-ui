import getTargetElement from './getTargetElement';

export default function appendChild(element: unknown, child: Node | Element) {
    const target: Document | Element | null | undefined = getTargetElement(element, child as Element) as Exclude<ReturnType<typeof getTargetElement>, Window>;

    if (target) target.appendChild(child);
    else throw new Error('Cannot append ' + child + ' to ' + element);
}
