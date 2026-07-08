export default function getInnerWidth(element: HTMLElement): number {
    if (element) {
        let width = element.offsetWidth;
        const style = getComputedStyle(element);

        width -= parseFloat(style.borderLeft) + parseFloat(style.borderRight);

        return width;
    }

    return 0;
}
