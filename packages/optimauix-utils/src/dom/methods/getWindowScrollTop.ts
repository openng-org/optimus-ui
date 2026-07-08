export default function getWindowScrollTop(): number {
    const doc = document.documentElement;

    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
}
