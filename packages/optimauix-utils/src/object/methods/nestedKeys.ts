import isObject from './isObject';

export default function nestedKeys(obj: Record<string, any> = {}, parentKey: string = ''): string[] {
    return Object.entries(obj).reduce<string[]>((o, [key, value]) => {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;

        isObject(value) ? (o = o.concat(nestedKeys(value, currentKey))) : o.push(currentKey);

        return o;
    }, []);
}
