export default function clearSelection(): void {
    if (window.getSelection) {
        const selection: any = window.getSelection() || {};

        if (selection.empty) {
            selection.empty();
        } else if (selection.removeAllRanges && selection.rangeCount > 0 && selection.getRangeAt(0).getClientRects().length > 0) {
            selection.removeAllRanges();
        }
    }
}
