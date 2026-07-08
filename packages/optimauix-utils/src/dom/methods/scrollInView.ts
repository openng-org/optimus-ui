import getOuterHeight from './getOuterHeight';

export default function scrollInView(container: HTMLElement, item: HTMLElement): void {
    const borderTopValue = getComputedStyle(container).getPropertyValue('borderTopWidth');
    const borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
    const paddingTopValue = getComputedStyle(container).getPropertyValue('paddingTop');
    const paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    const scroll = container.scrollTop;
    const elementHeight = container.clientHeight;
    const itemHeight = getOuterHeight(item);

    if (offset < 0) {
        container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
        container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
}
