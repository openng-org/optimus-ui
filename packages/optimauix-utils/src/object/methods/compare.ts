import isEmpty from './isEmpty';

export default function compare<T = unknown>(value1: T, value2: T, comparator: (val1: T, val2: T) => number, order: number = 1): number {
    let result = -1;
    const emptyValue1 = isEmpty(value1);
    const emptyValue2 = isEmpty(value2);

    if (emptyValue1 && emptyValue2) result = 0;
    else if (emptyValue1) result = order;
    else if (emptyValue2) result = -order;
    else if (typeof value1 === 'string' && typeof value2 === 'string') result = comparator(value1, value2);
    else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

    return result;
}
