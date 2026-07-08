export default function isArray(value: any, empty: boolean = true): boolean {
    return Array.isArray(value) && (empty || value.length !== 0);
}
