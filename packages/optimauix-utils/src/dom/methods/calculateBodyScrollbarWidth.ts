export default function calculateBodyScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.offsetWidth;
}
