export default function isScalar(value: any): boolean {
    return value != null && (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean');
}
