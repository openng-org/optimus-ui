export default function toMs(value: string | number): number {
    if (value === 'auto') return 0;

    if (typeof value === 'number') return value;

    return Number(value.replace(/[^\d.]/g, '').replace(',', '.')) * 1000;
}
