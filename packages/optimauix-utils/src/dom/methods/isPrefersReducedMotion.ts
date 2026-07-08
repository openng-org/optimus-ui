export default function isPrefersReducedMotion(): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    return mediaQuery.matches;
}
