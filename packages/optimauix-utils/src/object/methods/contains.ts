import equals from './equals';

export default function contains<T = unknown>(value: T, list: T[]): boolean {
    if (value != null && list && list.length) {
        for (const val of list) {
            if (equals(value, val)) return true;
        }
    }

    return false;
}
