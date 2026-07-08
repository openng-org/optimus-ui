export default function isAndroid(): boolean {
    return /(android)/i.test(navigator.userAgent);
}
