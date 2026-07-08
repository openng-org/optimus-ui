export default function getWidth(element: HTMLElement): number {
    if (element) {
        let width = element.offsetWidth;
        const style = getComputedStyle(element);

        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

        return width;
    }

    return 0;
}
