export default function isString(value: unknown, empty: boolean = true): value is string {
    return typeof value === 'string' && (empty || value !== '');
}
