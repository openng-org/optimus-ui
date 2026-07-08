export default function hasCSSTransition(element: Element): boolean {
    if (element) {
        const style = getComputedStyle(element);
        const transitionDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');

        return transitionDuration > 0;
    }

    return false;
}
