export default function isObject(value: unknown, empty: boolean = true): value is object {
    return value instanceof Object && value.constructor === Object && (empty || Object.keys(value).length !== 0);
}
