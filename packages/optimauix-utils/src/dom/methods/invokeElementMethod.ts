export default function invokeElementMethod<T extends keyof Element>(element: Element, methodName: T, args?: unknown[]): void {
    const method = element[methodName];

    if (typeof method === 'function') {
        (method as (...args: unknown[]) => void).apply(element, args ?? []);
    }
}
