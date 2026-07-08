import compare from './compare';
import isEmpty from './isEmpty';

export default function sort<T>(value1: T, value2: T, order: number = 1, comparator: (val1: T, val2: T) => number, nullSortOrder: number = 1): number {
    const result = compare(value1, value2, comparator, order);
    let finalSortOrder = order;

    // nullSortOrder == 1 means Excel like sort nulls at bottom
    if (isEmpty(value1) || isEmpty(value2)) {
        finalSortOrder = nullSortOrder === 1 ? order : nullSortOrder;
    }

    return finalSortOrder * result;
}
