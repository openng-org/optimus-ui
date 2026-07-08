export default function isRTL(element?: HTMLElement): boolean {
    return element ? getComputedStyle(element).direction === 'rtl' : false;
}
