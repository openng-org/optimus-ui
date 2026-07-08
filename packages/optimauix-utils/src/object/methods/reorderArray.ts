export default function reorderArray<T>(value: T[], from: number, to: number): void {
    if (value && from !== to) {
        if (to >= value.length) {
            to %= value.length;
            from %= value.length;
        }

        value.splice(to, 0, value.splice(from, 1)[0]);
    }
}
