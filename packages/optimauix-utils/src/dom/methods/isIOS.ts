export default function isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}
