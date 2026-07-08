export default function isClient(): boolean {
    return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
