export default function hasCSSAnimation(element: Element): boolean {
    if (element) {
        const style = getComputedStyle(element);
        const animationDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');

        return animationDuration > 0;
    }

    return false;
}
