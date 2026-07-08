export default function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
    return typeof value === 'function' && 'call' in value && 'apply' in value;
}
