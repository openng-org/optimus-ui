export default function isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as Partial<Navigator & { msMaxTouchPoints?: number }>).msMaxTouchPoints! > 0;
}
